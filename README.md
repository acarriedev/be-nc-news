# AC's Northcoders News API

Welcome to AC's Northcoders News. This is a resource of articles about all things Northcoders and something things that aren't.

This project requires a basic understanding of `node-postgres`, `express`, `knex` and `sql`.

Check out the hosted API [here](https://ac-nc-news.herokuapp.com/api)

---

## Step 1 - Setting up your own repository

Fork this repo

Clone this repo:

```bash
git clone https://github.com/scrymgeourg/be-nc-news

cd be-nc-news
```

---

## Step 2 - Install dependencies

```bash
npm install jest -D

npm install supertest

npm install express

npm install pg

npm install knex

```

---

## Step 3 - Set up databases

```bash
npm run setup-dbs

npm run seed
```

---

## Tests

The tests for this api have been designed with `jest` and `jest sorted`. Jest has been set to watch mode. To escape watch mode enter this in the terminal

```bash
^c
```

### App

Tests are found in the `__tests__` folder. These tests are designed to ensure endpoints and errors and working and running as they should. To run tests on the app use the `app.test.js` file and run this in the terminal.

```bash
npm test app
```

### Utils

Utility functions have been used in some of the seeding for this project. These functions are for use on small sections of logic used in the project to help the process run more smoothly. The tests are also in the `__tests__` folder in `utils.test.js`. To test these run this in the terminal

```bash
npm test utils
```

---

## Endpoints

```http
GET /api/topics

GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

GET /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api
```

---

## Author

- Alex Carrie - [github](https://github.com/scrymgeourg/)

---

### Acknowledgments

- Built using the Northcoders template by [Northcoders](https://northcoders.com/)
