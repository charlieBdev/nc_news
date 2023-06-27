const { selectArticleById, selectAllArticles } = require("../models/articles.model")

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params

    selectArticleById(article_id)
    .then((article) => {
        article.created_at = article.created_at
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.getAllArticles = (_, res, next) => {
    selectAllArticles()
    .then((articles) => {
        res.status(200).send(articles)
    })
}