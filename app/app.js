const express = require("express")

const { handleCustomErrors, handleServerErrors } = require("./errors/index")

const { getAllTopics } = require("../app/controllers/topics.controller")
const { getEndpoints } = require("./controllers/endpoints.controller")
const { getArticleById, getAllArticles } = require("./controllers/articles.controller")

const app = express()

app.get("/api/topics", getAllTopics)
app.get("/api", getEndpoints)
app.get("/api/articles/:article_id", getArticleById)
app.get('/api/articles', getAllArticles)


app.get("*", (_, res) => {
  res.status(404).send({ msg: "Not found" })
})

app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app
