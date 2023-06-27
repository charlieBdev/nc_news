const { selectAllTopics } = require('../models/topics.model')

exports.getAllTopics = (_, res, next) => {
    selectAllTopics()
    .then((topics) => {
        res.status(200).send({ topics })
    })
    .catch(next)
}
