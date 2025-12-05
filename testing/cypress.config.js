const { defineConfig } = require("cypress");
require('dotenv').config();


module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config.env = config.env || {};
      if (process.env.CLOSET_AUTH_TOKEN) {
        config.env.CLOSET_AUTH_TOKEN = process.env.CLOSET_AUTH_TOKEN;
      }
      return config;
    }

  },
});
