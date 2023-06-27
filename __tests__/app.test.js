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
describe('All bad paths', () => {
    test('404: should return a custom error for a bad path', () => {
        return request(app)
        .get('/api/notAPath')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Not found')
        })
    });
});
describe('GET /api/articles/:article_id', () => {
    test('200: should return an article object', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
            const { article } = body
            expect(article.article_id).toBe(1)
            expect(article).toHaveProperty('author'), expect.any(String)
            expect(article).toHaveProperty('title'), expect.any(String)
            expect(article).toHaveProperty('body'), expect.any(String)
            expect(article).toHaveProperty('topic'), expect.any(String)
            expect(article).toHaveProperty('created_at'), expect.any(Date)
            expect(article).toHaveProperty('votes'), expect.any(Number)
            expect(article).toHaveProperty('article_img_url'), expect.any(String)
        })  
    });
    test('404: should handle an ID that does not exist', () => {
        return request(app)
        .get('/api/articles/99999999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Not found')
        })
    });
    test('400: should handle invalid ID', () => {
        return request(app)
        .get('/api/articles/notAnId')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    });
});
// describe('200: should get all comments for an article', () => {
//     return request(app)
//     .get('/api/articles/:article_id/comments')
//     .expect(200)
//     .then(({ body }) => {
//         expect(body.length).toBe(articles.length)
//         expect(body).toBeSortedBy('created_at', { descending: true })
//         body.forEach((article) => {
//             expect(article).toHaveProperty('comment_id'), expect.any(String)
//             expect(article).toHaveProperty('votes'), expect.any(Number)
//             expect(article).toHaveProperty('created_at'), expect.any(String)
//             expect(article).toHaveProperty('votes'), expect.any(Number)
//             expect(article).toHaveProperty('author'), expect.any(String)
//             expect(article).toHaveProperty('article_id'), expect.any(Number)
//         })
//     })
// });