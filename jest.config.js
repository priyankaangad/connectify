module.exports = {
    transform: {
      '^.+\\.[tj]sx?$': 'babel-jest', // Use Babel to transform JS/JSX
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
    },
    testEnvironment: 'jsdom', // Use JSDOM for React tests
  };
  