const format = require('pg-format');
const db = require('../connection');
const bcrypt = require('bcrypt');
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require('./utils');

const seed = async ({ topicData, userData, articleData, commentData }) => {
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);

  await db.query(`
      CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR
      );`);

  await db.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        avatar_url VARCHAR,
        is_logged_in BOOLEAN NOT NULL
      );`);

  await db.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR NOT NULL REFERENCES topics(slug),
        author VARCHAR NOT NULL REFERENCES users(username),
        body VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        votes INT DEFAULT 0 NOT NULL,
        article_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
      );`);

  await db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body VARCHAR NOT NULL,
        article_id INT REFERENCES articles(article_id) NOT NULL,
        author VARCHAR REFERENCES users(username) NOT NULL,
        votes INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );`);

  const insertTopicsQueryStr = format(
    'INSERT INTO topics (slug, description) VALUES %L;',
    topicData.map(({ slug, description }) => [slug, description])
  );

  const topicsPromise = db.query(insertTopicsQueryStr);

  const hashedUserData = await Promise.all(
    userData.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      return [
        user.username,
        user.name,
        hashedPassword,
        user.avatar_url,
        user.is_logged_in,
      ];
    })
  );

  const insertUsersQueryStr = format(
    'INSERT INTO users (username, name, password, avatar_url, is_logged_in) VALUES %L;',
    hashedUserData
  );
  const usersPromise = db.query(insertUsersQueryStr);

  await Promise.all([topicsPromise, usersPromise]);

  const formattedArticleData = articleData.map(convertTimestampToDate);

  const insertArticlesQueryStr = format(
    'INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;',
    formattedArticleData.map(
      ({
        title,
        topic,
        author,
        body,
        created_at,
        votes = 0,
        article_img_url,
      }) => [title, topic, author, body, created_at, votes, article_img_url]
    )
  );

  const { rows: articleRows } = await db.query(insertArticlesQueryStr);

  const articleIdLookup = createRef(articleRows, 'title', 'article_id');

  const formattedCommentData = formatComments(commentData, articleIdLookup);

  const insertCommentsQueryStr = format(
    'INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;',
    formattedCommentData.map(
      ({
        body: body_1,
        author: author_1,
        article_id,
        votes: votes_1 = 0,
        created_at: created_at_1,
      }) => [body_1, author_1, article_id, votes_1, created_at_1]
    )
  );

  return await db.query(insertCommentsQueryStr);
};

module.exports = seed;
