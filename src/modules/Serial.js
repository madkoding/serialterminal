export default class Serial {
    onSuccess = () => { }
    onFail = () => { }
    onReceive = () => { }
    onReconnecting = () => { }
    onReconnectFailed = () => { }

    constructor() {
        this.open = false
        this.intentionalClose = false

        this.textDecoder = undefined
        this.readableStreamClosed = undefined
        this.reader = undefined

        this.port = undefined
        this.portIdentity = null

        this.outputStream = undefined
        this.inputStream = undefined

        this.baudRate = 115200

        // Auto-reconnect settings
        this.maxReconnectAttempts = 20
        this.reconnectInterval = 3000
        this.backoffEnabled = true
        this.reconnectAttempts = 0
        this.reconnectTimer = null
    }

    supported() {
        return ('serial' in navigator)
    }

    async requestPort() {
        await this.close()
        this.intentionalClose = false
        this.reconnectAttempts = 0
        this.clearReconnectTimer()

        try {
            this.port = await navigator.serial.requestPort({ filters: [] })
        } catch (e) {
            console.error(e)
            return `${e}`
        }

        return this.openPort()
    }

    async openPort() {
        try {
            await this.port.open({ baudRate: this.baudRate })
        } catch (e) {
            console.error('[SERIAL] Failed to open port:', e)
            return `${e}`
        }

        console.log(`[SERIAL] Connected`)

        // Save port identity for smart reconnection
        try {
            const info = this.port.getInfo()
            this.portIdentity = {
                usbVendorId: info.usbVendorId,
                usbProductId: info.usbProductId,
            }
            console.log(`[SERIAL] Port identity: vendor=${info.usbVendorId}, product=${info.usbProductId}`)
        } catch (e) {
            this.portIdentity = null
            console.warn('[SERIAL] Could not get port info:', e)
        }

        this.reconnectAttempts = 0
        this.clearReconnectTimer()

        this.port.addEventListener('disconnect', () => {
            console.warn(`[SERIAL] Disconnected!`)
            this.handleDisconnect()
        })

        this.outputStream = this.port.writable
        this.inputStream = this.port.readable

        this.onSuccess()
        this.open = true

        this.read()

        return ''
    }

    handleDisconnect() {
        if (!this.open && this.reconnectAttempts > 0) {
            return
        }

        this.open = false

        if (this.intentionalClose) {
            this.onFail()
            return
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect()
        } else {
            console.warn(`[SERIAL] Max reconnect attempts (${this.maxReconnectAttempts}) reached`)
            this.onReconnectFailed()
            this.onFail()
        }
    }

    scheduleReconnect() {
        this.clearReconnectTimer()
        this.reconnectAttempts++

        let delay = this.reconnectInterval
        if (this.backoffEnabled) {
            delay = Math.min(this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1), 15000)
        }

        console.log(`[SERIAL] Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`)
        this.onReconnecting(this.reconnectAttempts, this.maxReconnectAttempts, delay)

        this.reconnectTimer = setTimeout(async () => {
            await this.attemptReconnect()
        }, delay)
    }

    async attemptReconnect() {
        console.log(`[SERIAL] Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`)

        try {
            await this.cleanupConnection()

            const ports = await navigator.serial.getPorts()

            // Try to find the same port by USB vendor/product ID
            let matchedPort = null
            if (this.portIdentity) {
                for (const p of ports) {
                    try {
                        const info = p.getInfo()
                        if (info.usbVendorId === this.portIdentity.usbVendorId &&
                            info.usbProductId === this.portIdentity.usbProductId) {
                            matchedPort = p
                            console.log(`[SERIAL] Found matching port by identity`)
                            break
                        }
                    } catch (e) {
                        // Skip ports we can't query
                    }
                }
            }

            if (!matchedPort && this.portIdentity) {
                // Try to find by reference as fallback
                matchedPort = ports.find(p => p === this.port)
            }

            if (matchedPort) {
                this.port = matchedPort
                const result = await this.openPort()
                if (result === '') {
                    console.log(`[SERIAL] Reconnected successfully!`)
                    return
                }
            }

            console.warn(`[SERIAL] Reconnect attempt ${this.reconnectAttempts} failed - matching port not found`)

            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.scheduleReconnect()
            } else {
                console.warn(`[SERIAL] Max reconnect attempts reached`)
                this.onReconnectFailed()
                this.onFail()
            }
        } catch (e) {
            console.error(`[SERIAL] Reconnect attempt failed:`, e)

            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.scheduleReconnect()
            } else {
                this.onReconnectFailed()
                this.onFail()
            }
        }
    }

    async cleanupConnection() {
        try {
            await this.reader?.cancel().catch(() => { })
            await this.readableStreamClosed?.catch(() => { })

            if (this.port) {
                try {
                    await this.port.close()
                } catch (e) {
                    // Port might already be closed
                }
            }
        } catch (e) {
            // Ignore cleanup errors
        }
    }

    clearReconnectTimer() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer)
            this.reconnectTimer = null
        }
    }

    async read() {
        while (this.port.readable && this.open) {
            this.textDecoder = new window.TextDecoderStream()
            this.readableStreamClosed = this.port.readable.pipeTo(this.textDecoder.writable)
            this.reader = this.textDecoder.readable.getReader()

            try {
                while (true && this.open) {
                    const { value, done } = await this.reader.read()
                    if (done) {
                        break
                    }
                    if (value) this.onReceive(value)
                }
            } catch (error) {
                console.error('[SERIAL] Read error:', error)
                if (!this.intentionalClose) {
                    this.handleDisconnect()
                    return
                }
            }
        }

        if (this.intentionalClose) {
            await this.closePort()
        }
    }

    async send(value) {
        console.log(`Send: ${value}`)

        const encoder = new TextEncoder()
        const writer = this.outputStream.getWriter()

        writer.write(encoder.encode(value))
        writer.releaseLock()
    }

    async sendByte(value) {
        const writer = this.outputStream.getWriter()

        const data = new Uint8Array([value])
        await writer.write(data)

        writer.releaseLock()
    }

    async close() {
        this.intentionalClose = true
        this.clearReconnectTimer()
        await this.closePort()
    }

    async closePort() {
        if (this.open) {
            this.open = false

            await this.reader?.cancel().catch(() => { })
            await this.readableStreamClosed?.catch(() => { })

            try {
                await this.port?.close()
            } catch (e) {
                // Ignore close errors
            }

            console.log('[SERIAL] Closed')
        }
    }

    setBaudRate(newBaudRate) {
        this.baudRate = newBaudRate
    }

    setReconnectOptions({ maxAttempts, interval, backoff }) {
        if (maxAttempts !== undefined) this.maxReconnectAttempts = maxAttempts
        if (interval !== undefined) this.reconnectInterval = interval
        if (backoff !== undefined) this.backoffEnabled = backoff
    }
}
