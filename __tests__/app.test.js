const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const request = require('supertest')
const app = require('../app/app')
const db = require('../db/connection')
const endpoints = require('../endpoints.json')

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/topics', () => {
    test('200: should respond with an array of topic objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            const { topics } = body
            expect(topics).toHaveLength(3)
            expect(Array.isArray(topics)).toBe(true)
            topics.forEach((topic) => {
                expect(topic).toHaveProperty('description'), expect.any(String)
                expect(topic).toHaveProperty('slug'), expect.any(String)
            })
        })
    });
});
describe('GET /api', () => {
    test('should return an object of correct length with correct content', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            const endpointKeys = Object.keys(body)
            const endpointKeysLength = endpointKeys.length
            expect(typeof body).toBe('object')
            expect(Array.isArray(body)).toBe(false)
            for (let endpoint in body) {
                expect(body[endpoint]).toHaveProperty('description'), expect.any(String)
            }
            expect(body).toEqual(endpoints)
            expect(endpointKeysLength).toBe(Object.keys(endpoints).length)
        })
    });
});