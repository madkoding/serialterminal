module.exports = {
  extends: ["react-app", "react-app/jest"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  rules: {
    // Aquí puedes agregar reglas personalizadas si es necesario
  },
};
