const apiRouter = require("express").Router()
const { getEndpoints } = require("../controllers/endpoints.controller")
const articlesRouter = require("./articles-router")
const topicsRouter = require("./topics-router")
const usersRouter = require("./users-router")
const commentsRouter = require("./comments-router")

apiRouter.get("/", getEndpoints)

apiRouter.use("/articles", articlesRouter)

apiRouter.use("/topics", topicsRouter)

apiRouter.use("/users", usersRouter)

apiRouter.use("/comments", commentsRouter)

module.exports = apiRouter
