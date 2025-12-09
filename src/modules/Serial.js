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

        this.outputStream = undefined
        this.inputStream = undefined

        this.baudRate = 115200

        // Auto-reconnect settings
        this.maxReconnectAttempts = 20
        this.reconnectInterval = 3000 // 3 seconds (20 attempts in 1 minute)
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

        /*
        navigator.serial.addEventListener('connect', (e) => {
            this.port = e.port || e.target
            this.openPort()
        })

        navigator.serial.addEventListener('disconnect', () => {
            console.warn(`[SERIAL] Disconnected!`)
            this.onFail()
        })
        */

        // Filter on devices with the Arduino Uno USB Vendor/Product IDs
        const filters = [
            //{ usbVendorId: 0x2341, usbProductId: 0x0043 },
            //{ usbVendorId: 0x2341, usbProductId: 0x0001 }
        ]

        // Prompt user to select a serial port
        try {
            this.port = await navigator.serial.requestPort({ filters })
            //await port.open({ baudRate: 115200 })
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

        // Reset reconnect attempts on successful connection
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
        // Prevent multiple disconnect handlers
        if (!this.open && this.reconnectAttempts > 0) {
            return
        }
        
        this.open = false
        
        // If it was an intentional close, don't try to reconnect
        if (this.intentionalClose) {
            this.onFail()
            return
        }

        // Try to reconnect automatically
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
        
        console.log(`[SERIAL] Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${this.reconnectInterval / 1000}s`)
        this.onReconnecting(this.reconnectAttempts, this.maxReconnectAttempts)
        
        this.reconnectTimer = setTimeout(async () => {
            await this.attemptReconnect()
        }, this.reconnectInterval)
    }

    async attemptReconnect() {
        console.log(`[SERIAL] Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`)

        try {
            // First, try to close any existing connection
            await this.cleanupConnection()

            // Try to get previously authorized ports
            const ports = await navigator.serial.getPorts()
            
            if (ports.length > 0) {
                // Use the first available port (or the same one if still in list)
                this.port = ports.find(p => p === this.port) || ports[0]
                
                // Try to reopen the port
                const result = await this.openPort()
                if (result === '') {
                    console.log(`[SERIAL] Reconnected successfully!`)
                    return
                }
            }
            
            // If we get here, reconnection failed
            console.warn(`[SERIAL] Reconnect attempt ${this.reconnectAttempts} failed`)
            
            // Schedule next attempt if we haven't reached max
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.scheduleReconnect()
            } else {
                console.warn(`[SERIAL] Max reconnect attempts reached`)
                this.onReconnectFailed()
                this.onFail()
            }
        } catch (e) {
            console.error(`[SERIAL] Reconnect attempt failed:`, e)
            
            // Schedule next attempt if we haven't reached max
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
            await this.reader?.cancel().catch(() => {})
            await this.readableStreamClosed?.catch(() => {})
            
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
                        // |reader| has been canceled.
                        break
                    }
                    if (value) this.onReceive(value)
                }
            } catch (error) {
                // Handle |error|...
                console.error('[SERIAL] Read error:', error)
                if (!this.intentionalClose) {
                    this.handleDisconnect()
                    return // Exit without calling closePort, let reconnect handle it
                }
            }
        }
        
        // Only close port if it was intentional or we exited normally
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
        /*sendMessage(value, this.outputStream)

        const textEncoder = new window.TextEncoderStream()
        textEncoder.readable.pipeTo(this.outputStream)
        const writer = textEncoder.writable.getWriter()

        await writer.write(value)
        writer.releaseLock()*/
    }

    async sendByte(value) {
        const writer =  this.outputStream.getWriter()

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

            await this.reader?.cancel().catch(() => { /* Ignore the error */ })
            await this.readableStreamClosed?.catch(() => { /* Ignore the error */ })

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
}