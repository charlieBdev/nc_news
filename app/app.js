const express = require('express')
const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
} = require('./errors/index.js');
const { getAllTopics } = require('../app/controllers/topics.controller.js')
const app = express()

app.get('/api/topics', getAllTopics)


app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);


module.exports = app