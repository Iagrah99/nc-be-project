const {
  fetchArticleById,
  fetchArticlesData,
} = require('../models/articles.models');

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await fetchArticleById(article_id);
    res.status(200).send(article);
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  const articles = await fetchArticlesData();
  res.status(200).send(articles);
};
