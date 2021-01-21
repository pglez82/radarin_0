const { setup: setupDevServer } = require("jest-dev-server")
module.exports = async () => {
    await setupDevServer(
    {
        command: 'node start-restapi.js',
        launchTimeout: 30000,
        debug:true,
        port: 5000,
    })
    await setupDevServer(
    {
        command: 'BROWSER=none npm start',
        launchTimeout: 30000,
        debug: true,
        port: 3000
    })
}