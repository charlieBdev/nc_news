const db = require('../../db/connection')
const fs = require('fs/promises')

exports.selectAllTopics = () => {
    let queryStr = `
        SELECT * FROM topics 
    `
    return db.query(queryStr)
        .then(({ rows }) => {
            return rows
        })
}

exports.selectEndpoints = () => {
    return fs.readFile('endpoints.json', 'utf8')
    .then((endpoints) => {
        console.log(endpoints, '<<< endpoints')
        return endpoints
    })
}