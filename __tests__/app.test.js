const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const data = require('../db/data/test-data/index');
const app = require('../app');
const request = require('supertest');
const endpoints = require('../endpoints.json');

afterAll(() => db.end());
beforeEach(() => seed(data));

describe('GET /api/topics', () => {
  test('status 200: responds with an array of all the topics', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(3);
        body.forEach((topic) => {
          expect(topic.description).toEqual(expect.any(String));
          expect(topic.slug).toEqual(expect.any(String));
        });
      });
  });
});

describe('GET /api', () => {
  test('status 200: returns the available endpoints of the api', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });

  test('status 404: returns invalid endpoint', () => {
    return request(app)
      .get('/apo')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual('endpoint not found');
      });
  });
});
