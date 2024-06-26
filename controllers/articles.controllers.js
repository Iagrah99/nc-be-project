const {
  fetchArticleById,
  fetchArticlesData,
  patchArticleById,
  postArticle,
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
    const articles = await fetchArticlesData(req);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.updateArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const updatedArticle = await patchArticleById(article_id, inc_votes);
    res.status(200).send({ article: updatedArticle });
  } catch (err) {
    next(err);
  }
};

exports.addArticles = async (req, res, next) => {
  try {
    const { author, title, body, topic, article_img_url } = req.body;
    const addedArticle = await postArticle(author, title, body, topic, article_img_url);

    res.status(201).send({ article: addedArticle });
  } catch (err) {
    next(err);
  }
}
