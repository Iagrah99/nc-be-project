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
  test('status 200: responds with the available endpoints of the api', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });

  test('status 404: responds with an Endpoint not found error when the given endpoint does not exist', () => {
    return request(app)
      .get('/apo')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Endpoint not found');
      });
  });
});

describe('GET /api/articles/:article_id', () => {
  test('status 200: responds with an article object containing the correct properties', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 100,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });
  test('status 404: responds with a Not found error when given a valid article id which does not exist', () => {
    return request(app)
      .get('/api/articles/100')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });

  test('status 400: responds with a Bad request error when given an invalid article id', () => {
    return request(app)
      .get('/api/articles/not_an_id')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});
