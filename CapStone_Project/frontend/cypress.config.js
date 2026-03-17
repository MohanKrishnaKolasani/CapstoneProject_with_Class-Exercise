const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 8000,
    env: {
      USER_EMAIL: 'testuser@music.com',
      USER_PASSWORD: 'test123',
      ADMIN_EMAIL: 'admin@musiclibrary.com',
      ADMIN_PASSWORD: 'Admin@1234',
    },
    setupNodeEvents(on, config) {},
  },
});