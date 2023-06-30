const db = require("../db/connection")

exports.checkColumnExists = (column) => {
    if (Number(column)) {
        return Promise.reject({ status: 400, msg: 'Bad request'})
    }
    const queryStr = `
    SELECT * FROM topics WHERE slug = $1;
    `
    return db.query(queryStr, [column])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Column not found" })
        }
        return rows[0]
    })
}
