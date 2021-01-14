const express = require("express")
const dbHandler = require('./db-handler');
const api = require('../api');
const request = require('supertest');


let app //api end point
let server //server, we need this to finish it after the tests

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect().then(() => {
    app = express()
    app.use(express.json())
    app.use("/api", api)
    server = app.listen(5000)
}));

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
    await server.close() //finish the server
    await dbHandler.closeDatabase(); //close database
})

/**
 * Product test suite.
 */
describe('user ', () => {
    /**
     * Test that we can list users without any error.
     */
    it('can be listed',async () => {
        const response = await request(app).get("/api/users/list");
        expect(response.statusCode).toBe(200);
    });

    /**
     * Tests that a user can be created through the productService without throwing any errors.
     */
    it('can be created correctly', async () => {
        username = 'Pablo'
        email = 'pablo@uniovi.es'
        const response = await request(app).post('/api/users/add').send({name: username,email: email}).set('Accept', 'application/json')
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(username);
        expect(response.body.email).toBe(email);
    });
});