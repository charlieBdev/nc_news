const db = require("../../db/connection")
const { convertTimestampToDate } = require("../../db/seeds/utils")

exports.selectArticleById = (article_id) => {
  
  if(!Number(article_id)) {
    return Promise.reject({ status: 400, msg: 'Bad request' })
  }
  
  const queryString = `
        SELECT * FROM articles WHERE article_id = $1;
    `
  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" })
    } else {
      return rows[0]
    }
  })
}
