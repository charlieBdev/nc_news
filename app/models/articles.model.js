const db = require("../../db/connection")

exports.selectArticleById = (article_id) => {
  const queryString = `
    SELECT * FROM articles WHERE article_id = $1;
  `
  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" })
    }
    return rows[0]
  })
}

exports.selectAllArticles = (topic, sort_by='created_at', order='DESC') => {
  const validSortColumns = ['created_at', 'votes', 'topic', 'author', 'article_id']
  const validOrderBy = ['ASC', 'DESC']
  if (!validSortColumns.includes(sort_by) || !validOrderBy.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: 'Bad request'})
  }
  
  let queryValues = []
  let queryStr = `
    SELECT article_id(articles), author(articles), title(articles), topic(articles), created_at(articles), votes(articles), article_img_url(articles), COUNT(article_id(articles)) AS comment_count FROM articles LEFT JOIN comments ON article_id(articles) = article_id(comments) 
  `
  if (topic) {
    queryValues.push(topic)
    queryStr += `WHERE topic(articles) = $1 `
  }
  if (sort_by) {
    queryStr += `
      GROUP BY article_id(articles) ORDER BY ${sort_by}(articles) ${order};
    `
  }
  
  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows
  })
}

exports.selectArticleComments = (article_id) => {
  const queryStr = `
    SELECT * FROM comments JOIN articles ON article_id(comments) = article_id(articles) WHERE article_id(comments) = $1 ORDER BY created_at(comments) ASC; 
  `
  return db.query(queryStr, [article_id]).then(({ rows }) => {
    return rows
  })
}

exports.insertArticleComment = (article_id, username, body) => {
  const queryStr = `
    INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3) RETURNING *;
  `
  return db.query(queryStr, [body, article_id, username]).then(({ rows }) => {
    return rows[0]
  })
}

exports.changeArticleVotes = (article_id, inc_votes) => {
  const queryStr = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
  `
  return db.query(queryStr, [inc_votes, article_id])
  .then(({ rows }) => {
    return rows[0]
  })
}
