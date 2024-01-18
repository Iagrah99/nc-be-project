const {
  fetchArticleById,
  fetchArticlesData,
  patchArticleById,
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

exports.updateArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    console.log(article_id);
    const updatedArticle = await patchArticleById(article_id, inc_votes);
    res.status(201).send(updatedArticle);
  } catch (err) {
    next(err);
  }
};
