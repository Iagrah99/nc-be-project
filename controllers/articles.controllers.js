const {
  fetchArticleById,
  fetchArticlesData,
  patchArticleById,
  postArticle,
  removeArticleById,
} = require('../models/articles.models');

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await fetchArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const { articles, total_count } = await fetchArticlesData(req);
    res.status(200).send({ articles, total_count });
  } catch (err) {
    next(err);
  }
};

exports.updateArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { inc_votes, article_img_url, article_body, title, topic } = req.body;

    const updatedArticle = await patchArticleById(
      article_id,
      inc_votes,
      article_img_url,
      article_body,
      title,
      topic
    );
    res.status(200).send({ article: updatedArticle });
  } catch (err) {
    next(err);
  }
};

exports.addArticles = async (req, res, next) => {
  try {
    const { author, title, body, topic, article_img_url } = req.body;
    const addedArticle = await postArticle(
      author,
      title,
      body,
      topic,
      article_img_url
    );

    res.status(201).send({ article: addedArticle });
  } catch (err) {
    next(err);
  }
};

exports.deleteArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    await removeArticleById(article_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
