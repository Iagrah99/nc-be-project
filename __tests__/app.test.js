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
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
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

describe('GET /api/articles', () => {
  test('status 200: responds with an array of all the articles sorted by date in descending order, with an added comment_count property', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        expect(body).toBeSortedBy('created_at', {
          descending: true,
        });
        body.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test('status 200: responds with an array of comments for the given article id', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(11);
        expect(body).toBeSortedBy('created_at', {
          descending: true,
        });
        body.forEach((article) => {
          expect(article).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });

  test('status 200: responds with an empty array if passed an article id that exists, but has no comments associated with it', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual([]);
      });
  });

  test('status 404: responds with a Not found error when given a valid article id which does not exist', () => {
    return request(app)
      .get('/api/articles/100/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });

  test('status 400: responds with a Bad request error when given an invalid article id', () => {
    return request(app)
      .get('/api/articles/not_an_id/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('status 201: responds with the newly added article', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        username: 'icellusedkars',
        body: "I can't think of a good comment",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toMatchObject({
          author: 'icellusedkars',
          body: "I can't think of a good comment",
          article_id: 1,
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });

  test('status 404: responds with a Not found error when given a non-existent username', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        username: 'unknown_user',
        body: 'This is my comment',
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });

  test('status 404: responds with a Not found error when given a non-existent article id', () => {
    return request(app)
      .post('/api/articles/100/comments')
      .send({
        username: 'icellusedkars',
        body: 'This is a my comment',
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });

  test('status 400: responds with a Bad request error when the comment does not have a body key', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        username: 'icellusedkars',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });

  test('status 400: responds with a Bad request error when given an invalid article id', () => {
    return request(app)
      .post('/api/articles/never_an_id/comments')
      .send({
        username: 'icellusedkars',
        body: 'This is my comment',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('status 201: responds with the updated article', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes: -10,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toMatchObject({
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 90,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });

  test('status 404: responds with a Not found error when given a valid but non-existent article id', () => {
    return request(app)
      .patch('/api/articles/50')
      .send({
        inc_votes: -10,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });

  test('status 400: responds with a Bad request error when the request body is missing the inc_votes key', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });

  test('status 400: responds with a Bad request error when given an invalid article id', () => {
    return request(app)
      .patch('/api/articles/never_an_id')
      .send({
        inc_votes: -10,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});
