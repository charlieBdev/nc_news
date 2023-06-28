const { selectArticleById, selectAllArticles, selectArticleComments } = require("../models/articles.model")

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params

    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.getAllArticles = (_, res, next) => {
    selectAllArticles()
    .then((articles) => {
        res.status(200).send({ articles })
    })
    .catch(next)
}

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params

    const promises = [selectArticleComments(article_id), selectArticleById(article_id)]

    Promise.all(promises)

    .then((resolvedPromises) => {
        const comments = resolvedPromises[0]
        if (!comments) {
            res.status(200).send([])
        }
        res.status(200).send({ comments })
    })
    .catch(next)
}