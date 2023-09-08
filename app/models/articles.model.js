const db = require("../../db/connection")

// exports.selectArticleById = (article_id) => {
//   const queryString = `
//   SELECT article_id(articles), author(articles), title(articles), topic(articles), body(articles), created_at(articles), votes(articles), article_img_url(articles), COUNT(article_id(articles)) AS comment_count
//   FROM articles LEFT JOIN comments ON article_id(articles) = article_id(comments)
//   WHERE article_id(articles) = $1
//   GROUP BY article_id(articles);
//   `
//   return db.query(queryString, [article_id]).then(({ rows }) => {
//     if (rows.length === 0) {
//       return Promise.reject({ status: 404, msg: "Article not found" })
//     }
//     return rows[0]
//   })
// }

exports.selectArticleById = (article_id) => {
  const queryString = `
    SELECT 
      article_id, author, title, topic, body, created_at, votes, article_img_url,
      COUNT(comments.article_id) AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1 
    GROUP BY articles.article_id;
  `
  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" })
    }
    return rows[0]
  })
}

// exports.selectAllArticles = (topic, sort_by = "created_at", order = "DESC") => {
//   const validSortColumns = [
//     "created_at",
//     "votes",
//     "topic",
//     "author",
//     "article_id",
//     "comment_count",
//   ]
//   const validOrderBy = ["ASC", "DESC"]
//   if (
//     !validSortColumns.includes(sort_by) ||
//     !validOrderBy.includes(order.toUpperCase())
//   ) {
//     return Promise.reject({ status: 400, msg: "Bad request" })
//   }

//   let queryValues = []
//   let queryStr = `
//     SELECT article_id(articles), author(articles), title(articles), topic(articles), created_at(articles), votes(articles), article_img_url(articles), COUNT(article_id(articles)) AS comment_count FROM articles LEFT JOIN comments ON article_id(articles) = article_id(comments)
//   `
//   if (topic) {
//     queryValues.push(topic)
//     queryStr += `WHERE topic(articles) = $1 `
//   }
//   if (sort_by) {
//     queryStr += `
//       GROUP BY article_id(articles) ORDER BY ${sort_by} ${order};
//     `
//   }
//   return db.query(queryStr, queryValues).then(({ rows }) => {
//     return rows
//   })
// }

exports.selectAllArticles = async (
  topic,
  sort_by = "created_at",
  order = "DESC"
) => {
  const validSortColumns = [
    "created_at",
    "votes",
    "topic",
    "author",
    "article_id",
    "comment_count",
  ]
  const validOrderBy = ["ASC", "DESC"]
  if (
    !validSortColumns.includes(sort_by) ||
    !validOrderBy.includes(order.toUpperCase())
  ) {
    throw { status: 400, msg: "Bad request" }
  }

  let queryValues = []
  let queryStr = `
    SELECT 
      articles.article_id,
      articles.author,
      articles.title,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `

  if (topic) {
    queryValues.push(topic)
    queryStr += `WHERE articles.topic = $1 `
  }

  queryStr += `
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order};
  `

  const { rows } = await db.query(queryStr, queryValues)
  return rows
}

exports.selectArticleComments = (article_id) => {
  const queryStr = `
    SELECT comment_id(comments), votes(comments), created_at(comments), author(comments), body(comments), article_id(comments) FROM comments JOIN articles ON article_id(comments) = article_id(articles) WHERE article_id(comments) = $1 ORDER BY created_at(comments) DESC; 
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
  return db.query(queryStr, [inc_votes, article_id]).then(({ rows }) => {
    return rows[0]
  })
}
