const { selectArticleById, selectAllArticles, selectArticleComments, insertArticleComment, changeArticleVotes } = require("../models/articles.model")
const { checkColumnExists } = require("../utils")

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params

    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.getAllArticles = (req, res, next) => {
    const { topic, sort_by, order } = req.query

    const promises = [selectAllArticles(topic, sort_by, order)]

    if (topic) {
        promises.push(checkColumnExists(topic))
    }

    Promise.all(promises)

    .then((resolvedPromises) => {
        const articles = resolvedPromises[0]
        if (articles.length === 0) {
            res.status(200).send([])
        } else {
            res.status(200).send({ articles })
        }
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

exports.addArticleComment = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body
    insertArticleComment(article_id, username, body)
        .then((commentAdded) => {
            res.status(201).send({ commentAdded })
        })
        .catch(next)
}

exports.incrementArticleVotes = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body

    const promises = [changeArticleVotes(article_id, inc_votes), selectArticleById(article_id)]

    Promise.all(promises)

    .then((resolvedPromises) => {
        const updatedArticleVotes = resolvedPromises[0]
        res.status(200).send({ updatedArticleVotes })
    })
    .catch(next)
}

