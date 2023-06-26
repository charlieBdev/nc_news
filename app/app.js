const express = require('express')
const {
    handleCustomErrors,
    handleServerErrors,
} = require('./errors/index');
const {
    getAllTopics,
    getEndpoints,
} = require('../app/controllers/topics.controller.js')
const app = express()


app.get('/api/topics', getAllTopics)
app.get('/api', getEndpoints)


app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app