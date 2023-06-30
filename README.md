# Northcoders News API

## Hi and welcome!

This API mimics a real world backend service like Reddit.
The database is PSQL and it is interacted with using node-postgres.

The API is hosted on [Render](https://render.com/) and the DB with [ElephantSQL](https://www.elephantsql.com/).

You will need:

1. [Node.js](https://nodejs.org/en/download) v19.8.1 or above
2. [Postgres](https://postgresapp.com/downloads.html) 14.7 or above

See the live [API](https://nc-news-qvv1.onrender.com/api) 🚀🚀🚀

### Project Setup

#### Making a public repo

1. Clone the repo from GitHub

2. Create a new public GitHub repo. **Do not** initialise with readme, .gitignore, or license!

3. From your cloned local version of the project, push your code to your new repo using...

```shell
git remote set-url origin YOUR_NEW_REPO_URL_HERE
git branch -M main
git push -u origin main
```

#### Creating the databases

There are two databases - one for real-looking dev data and one for simpler test data.

4. Create two **.env** files

- `.env.test`
- `.env.development`

5. Add `PGDATABASE=\<database_name>` to each .env file. See **/db/setup.sql** for the correct names.

6. `.gitignore` the two .env files.

### Install dependencies

`npm install`

### Set up and seed the local database

`npm run setup-dbs`

`npm run seed`

### Testing

`npm run test`

### Endpoints

GET /api/topics
- responds with a list of topics

GET /api
- responds with a list of available endpoints

GET /api/articles/:article_id
- responds with a single article by article_id

GET /api/articles
- responds with a list of articles

GET /api/articles/:article_id/comments
- responds with a list of comments by article_id

POST /api/articles/:article_id/comments
- add a comment by article_id

PATCH /api/articles/:article_id
- updates an article by article_id

DELETE /api/comments/:comment_id
- deletes a comment by comment_id

GET /api/users
- responds with a list of users

GET /api/articles (queries)
- allows articles to be filtered and sorted

GET /api/articles/:article_id (comment count)
- adds a comment count to the response when retrieving a single article

## Thanks and enjoy! 🌶️🌶️🌶️