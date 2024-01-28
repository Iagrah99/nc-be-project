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
        expect(body.article).toMatchObject({
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
  test('status 200: responds with an article object containing the comment_count property', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty('comment_count');
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
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('created_at', {
          descending: true,
        });
        body.articles.forEach((article) => {
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
  test('status 200: responds with the updated article when given a negative number for inc_votes, without changing the other properties', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes: -10,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
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

  test('status 200: responds with the updated article when given a positive number for inc_votes, without changing the other properties', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes: 10,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 110,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });

  test('status 200: responds with the article with the votes property unchanged if inc_votes is missing from the request body', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({})
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(100);
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

  test('status 400: responds with a Bad request error when the inc_votes key is a string', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: '-10' })
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

describe('DELETE /api/comments/:comment_id', () => {
  test('status 204: responds with no content', () => {
    return request(app).delete('/api/comments/1').expect(204);
  });

  test('status 404: responds with a Not found error when given a valid but non-existent comment_id ', () => {
    return request(app)
      .delete('/api/comments/75')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });

  test('status 400: responds with a Bad request error when given an invalid comment_id ', () => {
    return request(app)
      .delete('/api/comments/never_an_id')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});

describe('GET /api/users', () => {
  test('status 200: responds with an array of all the users', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe('GET /api/articles?topic_query', () => {
  test('status 200: responds with the articles filtered by topic', () => {
    return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(12);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: 'mitch',
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });

  test('status 200: responds with an empty array if topic exists but has no articles', () => {
    return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });

  test('status 404: responds with a Not found error when given a valid but non-existent topic query ', () => {
    return request(app)
      .get('/api/articles?topic=invalid')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Topic not found');
      });
  });
});

describe('GET /api/articles (sorting queries)', () => {
  test('status 200: returns the articles sorted by the article_id and in ascending order when both are specified', () => {
    return request(app)
      .get('/api/articles?sort_by=article_id&order_by=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('article_id', {
          ascending: true,
        });
      });
  });

  test('status 200: returns the articles sorted by the article_id when specified, and in descending order by default', () => {
    return request(app)
      .get('/api/articles?sort_by=article_id')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('article_id', {
          descending: true,
        });
      });
  });

  test('status 200: returns the articles sorted by the title and in ascending order when both are specified', () => {
    return request(app)
      .get('/api/articles?sort_by=title&order_by=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('title', {
          ascending: true,
        });
      });
  });

  test('status 200: returns the articles sorted by the title when specified, and in descending order by default', () => {
    return request(app)
      .get('/api/articles?sort_by=title')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('title', {
          descending: true,
        });
      });
  });

  test('status 200: returns the articles sorted by the topic and in ascending order when both are specified', () => {
    return request(app)
      .get('/api/articles?sort_by=topic&order_by=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('topic', {
          ascending: true,
        });
      });
  });

  test('status 200: returns the articles sorted by the topic when specified, and in descending order by default', () => {
    return request(app)
      .get('/api/articles?sort_by=topic')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('topic', {
          descending: true,
        });
      });
  });

  test('status 200: returns the articles sorted by the author and in ascending order when both are specified', () => {
    return request(app)
      .get('/api/articles?sort_by=author&order_by=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('author', {
          ascending: true,
        });
      });
  });

  test('status 200: returns the articles sorted by the author when specified, and in descending order by default', () => {
    return request(app)
      .get('/api/articles?sort_by=author')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('author', {
          descending: true,
        });
      });
  });

  test('status 200: returns the articles sorted by the votes and in ascending order when both are specified', () => {
    return request(app)
      .get('/api/articles?sort_by=votes&order_by=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('votes', {
          ascending: true,
        });
      });
  });

  test('status 200: returns the articles sorted by the votes when specified, and in descending order by default', () => {
    return request(app)
      .get('/api/articles?sort_by=votes')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('votes', {
          descending: true,
        });
      });
  });

  test('status 200: returns the articles sorted by the article_img_url and in ascending order when both are specified', () => {
    return request(app)
      .get('/api/articles?sort_by=article_img_url&order_by=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('article_img_url', {
          ascending: true,
        });
      });
  });

  test('status 200: returns the articles sorted by the article_img_url when specified, and in descending order by default', () => {
    return request(app)
      .get('/api/articles?sort_by=article_img_url')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('article_img_url', {
          descending: true,
        });
      });
  });

  test('status 200: returns the articles sorted by the comment_count and in ascending order when both are specified', () => {
    return request(app)
      .get('/api/articles?sort_by=comment_count&order_by=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('comment_count', {
          ascending: true,
        });
      });
  });

  test('status 200: returns the articles sorted by the comment_count when specified, and in descending order by default', () => {
    return request(app)
      .get('/api/articles?sort_by=comment_count')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy('comment_count', {
          descending: true,
        });
      });
  });

  test('status 400: responds with an Invalid sort by query error when given an invalid sort_by query ', () => {
    return request(app)
      .get('/api/articles?sort_by=nonsense')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid sort by query');
      });
  });

  test('status 400: responds with an Invalid order by query error when given an invalid order_by query ', () => {
    return request(app)
      .get('/api/articles?order_by=nothing')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid order by query');
      });
  });
});
