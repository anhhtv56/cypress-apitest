const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  env:{
    username: 'anhautotest@test.com',
    password: '',
    apiUrl: 'https://conduit-api.bondaracademy.com'
  },
  retries: {
    runMode: 2,
    openMode: 0
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // const username = process.env.DB_USERNAME
      // const password = process.env.PASSWORD
      // if(!password){
      //   throw new Error(`missing PASSWORD environment`)
      // }
      // config.env = {username, password}
      // return config
    },
    baseUrl: 'https://conduit.bondaracademy.com/',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}'
  },
});
