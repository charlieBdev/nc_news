const { selectAllTopics } = require('../models/topics.models')
const fs = require('fs/promises')

exports.getAllTopics = (_, res, next) => {
    selectAllTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch(next)
}

exports.getEndpoints = (_, res, next) => {

    return fs.readFile('endpoints.json', 'utf8')
    .then((endpoints) => {
        const result = JSON.parse(endpoints)
        res.status(200).send(result)
    })
}
