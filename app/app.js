const express = require("express")

const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors/index")

const { getAllTopics } = require("../app/controllers/topics.controller")
const { getEndpoints } = require("./controllers/endpoints.controller")
const { getArticleById, getAllArticles, getArticleComments, addArticleComment } = require("./controllers/articles.controller")

const app = express()

app.use(express.json())

app.get("/api", getEndpoints)
app.get("/api/topics", getAllTopics)
app.get('/api/articles/:article_id/comments', getArticleComments)
app.get("/api/articles/:article_id", getArticleById)
app.get('/api/articles', getAllArticles)

app.post('/api/articles/:article_id/comments', addArticleComment)


app.all("*", (_, res) => {
  res.status(404).send({ msg: 'Not found' })
})

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)

module.exports = app
