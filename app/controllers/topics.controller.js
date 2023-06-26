const { selectAllTopics, selectEndpoints } = require('../models/topics.models')

exports.getAllTopics = (_, res, next) => {
    selectAllTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch(next)
}

exports.getEndpoints = (_, res, next) => {
    selectEndpoints()
    .then((endpoints) => {
        const result = JSON.parse(endpoints)
        res.status(200).send(result)
    })
}