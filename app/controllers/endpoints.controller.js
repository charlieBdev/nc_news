const fs = require('fs/promises')

exports.getEndpoints = (_, res, next) => {
    return fs.readFile('endpoints.json', 'utf8')
    .then((endpoints) => {
        const result = JSON.parse(endpoints)
        res.status(200).send(result)
    })
}
