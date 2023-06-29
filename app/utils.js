const db = require("../db/connection")

exports.checkTopicExists = (topic) => {
    if (Number(topic)) {
        return Promise.reject({ status: 400, msg: 'Bad request'})
    }
    const queryStr = `
    SELECT * FROM topics WHERE slug = $1;
    `
    return db.query(queryStr, [topic])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Topic not found" })
        }
        return rows
    })
}
