const articlesRouter = require("express").Router()

const {
  getAllArticles,
  getArticleById,
  incrementArticleVotes,
  getArticleComments,
  addArticleComment,
} = require("../controllers/articles.controller")

articlesRouter.route("/").get(getAllArticles)

articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(incrementArticleVotes)

articlesRouter
.route("/:article_id/comments")
.get(getArticleComments)
.post(addArticleComment)


module.exports = articlesRouter
