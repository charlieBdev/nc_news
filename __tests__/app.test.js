const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data")
const request = require("supertest")
const app = require("../app/app")
const db = require("../db/connection")
const endpoints = require("../endpoints.json")
const articlesData = require("../db/data/test-data/articles")
const commentsData = require("../db/data/test-data/comments")
const usersData = require("../db/data/test-data/users")

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe("ANY bad paths", () => {
  test("404: should return a custom error for a bad path", () => {
    return request(app)
      .get("/api/notAPath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found")
      })
  })
})
describe("GET /api", () => {
  test("200: should return an object of correct length with correct content", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endpointKeys = Object.keys(body)
        const endpointKeysLength = endpointKeys.length
        expect(typeof body).toBe("object")
        expect(Array.isArray(body)).toBe(false)
        for (let endpoint in body) {
          expect(body[endpoint]).toHaveProperty("description"),
            expect.any(String)
        }
        expect(body).toEqual(endpoints)
        expect(endpointKeysLength).toBe(Object.keys(endpoints).length)
      })
  })
})
describe("GET /api/topics", () => {
  test("200: should respond with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body
        expect(topics).toHaveLength(3)
        expect(Array.isArray(topics)).toBe(true)
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("description"), expect.any(String)
          expect(topic).toHaveProperty("slug"), expect.any(String)
        })
      })
  })
})
describe("GET /api/articles", () => {
  test("200: should return all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles).toBeSortedBy("created_at", { descending: true })
        expect(articles.length).toBe(articlesData.length)
        articles.forEach((article) => {
          expect(article).toHaveProperty("author"), expect.any(String)
          expect(article).toHaveProperty("title"), expect.any(String)
          expect(article).toHaveProperty("article_id"), expect.any(Number)
          expect(article).toHaveProperty("topic"), expect.any(String)
          expect(article).toHaveProperty("created_at"), expect.any(String)
          expect(article).toHaveProperty("votes"), expect.any(Number)
          expect(article).toHaveProperty("article_img_url"), expect.any(String)
          expect(article).toHaveProperty("comment_count"), expect.any(Number)
          expect(article).not.toHaveProperty("body")
        })
      })
  })
})
describe("GET /api/articles/:article_id", () => {
  test("200: should return an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body
        expect(article.article_id).toBe(1)
        expect(article).toHaveProperty("title"), expect.any(String)
        expect(article).toHaveProperty("topic"), expect.any(String)
        expect(article).toHaveProperty("author"), expect.any(String)
        expect(article).toHaveProperty("body"), expect.any(String)
        expect(article).toHaveProperty("created_at"), expect.any(String)
        expect(article).toHaveProperty("votes"), expect.any(Number)
        expect(article).toHaveProperty("article_img_url"), expect.any(String)
      })
  })
  test("400: should handle invalid article_id", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input")
      })
  })
  test("404: should handle an article_id that does not exist", () => {
    return request(app)
      .get("/api/articles/99999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found")
      })
  })
})
describe("GET /api/articles/:article_id/comments", () => {
  test("200: should return an array of comments for a given article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body
        expect(comments.length).toBeGreaterThan(0)
        const resultsArr = commentsData.filter((comment) => {
          return comment.article_id === 1
        })
        expect(comments.length).toBe(resultsArr.length)
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id"), expect.any(Number)
          expect(comment).toHaveProperty("votes"), expect.any(Number)
          expect(comment).toHaveProperty("created_at"), expect.any(String)
          expect(comment).toHaveProperty("author"), expect.any(String)
          expect(comment).toHaveProperty("body"), expect.any(String)
          expect(comment.article_id).toBe(1)
        })
        expect(comments).toBeSortedBy("created_at", { descending: true })
      })
  })
  test("200: should respond correctly for an article with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([])
      })
  })
  test("400: should handle an invalid article_id", () => {
    return request(app)
      .get("/api/articles/dogs/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input")
      })
  })
  test("404: should return an error if no records found", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found")
      })
  })
})
describe("POST /api/articles/:article_id/comments", () => {
  test("201: should add a comment for an article and respond with the posted comment", () => {
    const commentToPost = {
      username: "lurker",
      body: "The human brain is an incredible pattern-matching machine.",
    }
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentToPost)
      .expect(201)
      .then(({ body }) => {
        const { commentAdded } = body
        expect(Object.keys(commentAdded).length).toBe(6)
        expect(commentAdded.article_id).toBe(1)
        expect(commentAdded.author).toBe("lurker")
        expect(commentAdded.body).toBe(
          "The human brain is an incredible pattern-matching machine."
        )
        expect(commentAdded).toHaveProperty("comment_id"), expect.any(Number)
        expect(commentAdded).toHaveProperty("created_at"), expect.any(String)
        expect(commentAdded).toHaveProperty("votes"), expect.any(Number)
      })
  })
  test("201: should ignore extra properties", () => {
    const commentToPost = {
      username: "lurker",
      body: "The sheep brain is not an incredible pattern-matching machine.",
      votes: 5000,
      notACol: "whassup",
    }
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentToPost)
      .expect(201)
      .then(({ body }) => {
        const { commentAdded } = body
        expect(Object.keys(commentAdded).length).toBe(6)
        expect(commentAdded.article_id).toBe(1)
        expect(commentAdded.author).toBe("lurker")
        expect(commentAdded.body).toBe(
          "The sheep brain is not an incredible pattern-matching machine."
        )
        expect(commentAdded).toHaveProperty("comment_id"), expect.any(Number)
        expect(commentAdded).toHaveProperty("created_at"), expect.any(String)
        expect(commentAdded).toHaveProperty("votes"), expect.any(Number)
      })
  })
  test("400: should handle invalid article_id", () => {
    const commentToPost = {
      username: "lurker",
      body: "The human brain is an incredible pattern-matching machine.",
    }
    return request(app)
      .post("/api/articles/NaN/comments")
      .send(commentToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input")
      })
  })
  test("400: should handle input with NULL for required columns", () => {
    const commentToPost = {
      username: "",
      body: "The human brain is an incredible pattern-matching machine.",
    }
    return request(app)
      .post("/api/articles/NaN/comments")
      .send(commentToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input")
      })
  })
  test("400: should handle input with NULL for required columns", () => {
    const commentToPost = {
      username: "lurker",
      body: "",
    }
    return request(app)
      .post("/api/articles/NaN/comments")
      .send(commentToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input")
      })
  })
  test("404: should handle error for unfound article_id", () => {
    const commentToPost = {
      username: "lurker",
      body: "The human brain is an incredible pattern-matching machine.",
    }
    return request(app)
      .post("/api/articles/99999/comments")
      .send(commentToPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found")
      })
  })
  test("404: should handle error for unfound username", () => {
    const commentToPost = {
      username: "jeltonohn",
      body: "The human brain is an incredible pattern-matching machine.",
    }
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentToPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found")
      })
  })
})
describe("PATCH /api/articles/:article_id", () => {
  test("200: should update votes by increment value for an article", () => {
    const toSend = { inc_votes: 1 }
    return request(app)
      .patch("/api/articles/1")
      .send(toSend)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticleVotes } = body
        expect(updatedArticleVotes.votes).toBe(101)
      })
  })
  test("200: should update votes by increment value for an article", () => {
    const toSend = { inc_votes: -1 }
    return request(app)
      .patch("/api/articles/1")
      .send(toSend)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticleVotes } = body
        expect(updatedArticleVotes.votes).toBe(99)
      })
  })
  test("200: should ignore extra values", () => {
    const toSend = { inc_votes: -10, bananas: 5, body: "oof" }
    return request(app)
      .patch("/api/articles/1")
      .send(toSend)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticleVotes } = body
        expect(updatedArticleVotes.votes).toBe(90)
        expect(Object.keys(updatedArticleVotes).length).toBe(8)
      })
  })
})
describe("DELETE /api/comments/:comment_id", () => {
    test("204: should delete a comment by comment_id", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({})
        })
    })
    test("400: should handle if no value passed", () => {
      const toSend = { bananas: 5, body: "oof" }
      return request(app)
        .patch("/api/articles/1")
        .send(toSend)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input")
        })
    })
    test("400: should handle if NaN", () => {
      const toSend = { inc_votes: "NaN" }
      return request(app)
        .patch("/api/articles/1")
        .send(toSend)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input")
        })
    })
    test("400: should handle if article_id is invalid", () => {
      const toSend = { inc_votes: 1 }
      return request(app)
        .patch("/api/articles/NaN")
        .send(toSend)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input")
        })
    })
    test("400: should handle error for invalid comment_id", () => {
      return request(app)
        .delete("/api/comments/NaN")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input")
        })
    })
    test("404: should handle if article_id does not exist", () => {
      const toSend = { inc_votes: 1 }
      return request(app)
        .patch("/api/articles/99999999")
        .send(toSend)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found")
        })
    })
    test("404: should handle error when comment_id not found", () => {
        return request(app)
        .delete("/api/comments/999999999")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Comment not found")
        })
    })
})
describe("POST /api/articles/:article_id/comments", () => {
  test("201: should add a comment for an article and respond with the posted comment", () => {
    const commentToPost = {
      username: "lurker",
      body: "The human brain is an incredible pattern-matching machine.",
    }
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentToPost)
      .expect(201)
      .then(({ body }) => {
        const { commentAdded } = body
        expect(Object.keys(commentAdded).length).toBe(6)
        expect(commentAdded.article_id).toBe(1)
        expect(commentAdded.author).toBe("lurker")
        expect(commentAdded.body).toBe(
          "The human brain is an incredible pattern-matching machine."
        )
        expect(commentAdded).toHaveProperty("comment_id"), expect.any(Number)
        expect(commentAdded).toHaveProperty("created_at"), expect.any(String)
        expect(commentAdded).toHaveProperty("votes"), expect.any(Number)
      })
  })
  test("201: should ignore extra properties", () => {
    const commentToPost = {
      username: "lurker",
      body: "The sheep brain is not an incredible pattern-matching machine.",
      votes: 5000,
      notACol: "whassup",
    }
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentToPost)
      .expect(201)
      .then(({ body }) => {
        const { commentAdded } = body
        expect(Object.keys(commentAdded).length).toBe(6)
        expect(commentAdded.article_id).toBe(1)
        expect(commentAdded.author).toBe("lurker")
        expect(commentAdded.body).toBe(
          "The sheep brain is not an incredible pattern-matching machine."
        )
        expect(commentAdded).toHaveProperty("comment_id"), expect.any(Number)
        expect(commentAdded).toHaveProperty("created_at"), expect.any(String)
        expect(commentAdded).toHaveProperty("votes"), expect.any(Number)
      })
  })
  test("400: should handle invalid article_id", () => {
    const commentToPost = {
      username: "lurker",
      body: "The human brain is an incredible pattern-matching machine.",
    }
    return request(app)
      .post("/api/articles/NaN/comments")
      .send(commentToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input")
      })
  })
  test("400: should handle input with NULL for required columns", () => {
    const commentToPost = {
      username: "",
      body: "The human brain is an incredible pattern-matching machine.",
    }
    return request(app)
      .post("/api/articles/NaN/comments")
      .send(commentToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input")
      })
  })
  test("400: should handle input with NULL for required columns", () => {
    const commentToPost = {
      username: "lurker",
      body: "",
    }
    return request(app)
      .post("/api/articles/NaN/comments")
      .send(commentToPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input")
      })
  })
  test("404: should handle error for unfound article_id", () => {
    const commentToPost = {
      username: "lurker",
      body: "The human brain is an incredible pattern-matching machine.",
    }
    return request(app)
      .post("/api/articles/99999/comments")
      .send(commentToPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found")
      })
  })
  test("404: should handle error for unfound username", () => {
    const commentToPost = {
      username: "jeltonohn",
      body: "The human brain is an incredible pattern-matching machine.",
    }
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentToPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found")
      })
  })
})
describe("PATCH /api/articles/:article_id", () => {
  test("200: should update votes by increment value for an article", () => {
    const toSend = { inc_votes: 1 }
    return request(app)
      .patch("/api/articles/1")
      .send(toSend)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticleVotes } = body
        expect(updatedArticleVotes.votes).toBe(101)
      })
  })
  test("200: should update votes by increment value for an article", () => {
    const toSend = { inc_votes: -1 }
    return request(app)
      .patch("/api/articles/1")
      .send(toSend)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticleVotes } = body
        expect(updatedArticleVotes.votes).toBe(99)
      })
  })
  test("200: should ignore extra values", () => {
    const toSend = { inc_votes: -10, bananas: 5, body: "oof" }
    return request(app)
      .patch("/api/articles/1")
      .send(toSend)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticleVotes } = body
        expect(updatedArticleVotes.votes).toBe(90)
        expect(Object.keys(updatedArticleVotes).length).toBe(8)
      })
  })
  test("400: should handle if no value passed", () => {
    const toSend = { bananas: 5, body: "oof" }
    return request(app)
      .patch("/api/articles/1")
      .send(toSend)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input")
      })
  })
  test("400: should handle if NaN", () => {
    const toSend = { inc_votes: "NaN" }
    return request(app)
      .patch("/api/articles/1")
      .send(toSend)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input")
      })
  })
  test("400: should handle if article_id is invalid", () => {
    const toSend = { inc_votes: 1 }
    return request(app)
      .patch("/api/articles/NaN")
      .send(toSend)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input")
      })
  })
  test("404: should handle if article_id does not exist", () => {
    const toSend = { inc_votes: 1 }
    return request(app)
      .patch("/api/articles/99999999")
      .send(toSend)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found")
      })
  })
})
describe("GET /api/users", () => {
  test("200: should get all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body
        expect(users.length).toBe(usersData.length)
        expect(users).toEqual(usersData)
        users.forEach((user) => {
          expect(user).toHaveProperty("username"), expect.any(String)
          expect(user).toHaveProperty("name"), expect.any(String)
          expect(user).toHaveProperty("avatar_url"), expect.any(String)
        })
      })
  })
})
describe("GET /api/articles?topic", () => {
  test("200: should allow articles to be filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch")
          expect(article).toHaveProperty("article_id"), expect.any(Number)
          expect(article).toHaveProperty("author"), expect.any(String)
          expect(article).toHaveProperty("title"), expect.any(String)
          expect(article).toHaveProperty("created_at"), expect.any(String)
          expect(article).toHaveProperty("votes"), expect.any(Number)
          expect(article).toHaveProperty("article_img_url"), expect.any(String)
        })
      })
  })
  test("200: should return an empty array for a topic that exists but does not feature in any articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual([])
      })
  })
  test("400: should handle error if topic is invalid type", () => {
    return request(app)
      .get("/api/articles?topic=99999999")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("404: should handle error if topic does not exist in DB", () => {
    return request(app)
      .get("/api/articles?topic=pizza")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found")
      })
  })
})
