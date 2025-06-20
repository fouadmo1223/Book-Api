# 📚 Book API

# Node.js Demo API - Posts & Comments

A full-featured RESTful API built with **Node.js**, **Express**, and **MongoDB** (Mongoose) for managing users, posts, comments, books, and authors.

## 🚀 Technologies Used
| Technology          | Used For                         |
|---------------------|----------------------------------|
| Node.js             | JavaScript runtime               |
| Express.js          | Web framework for Node.js        |
| MongoDB + Mongoose  | Database and ODM                 |
| Joi                 | Request validation               |
| JWT (jsonwebtoken)  | Authentication                   |
| bcryptjs            | Password hashing                 |
| express-async-handler | Simplified async error handling |
| dotenv              | Environment variable management  |

## 📁 Project Structure
```
├── models/              # Mongoose models (User, Post, Comment, Book, Author)
├── routes/              # Express routers
├── utils/Schemas.js     # Joi validation schemas
├── middlewares/         # Authentication and authorization
├── app.js               # Main Express app
└── .env                 # Environment variables
```

## 🔐 Authentication
Use JWT for protected routes.
- Register: `POST /auth/register`
- Login: `POST /auth/login`

Include token in requests:
```
Authorization: Bearer <token>
```

## 📚 API Endpoints & Examples

### 🧑 Users
- `GET /users` — Admin only
- `GET /users/:id` — Admin or user himself
- `PUT /users/:id` — Admin or user himself
- `DELETE /users/:id` — Admin or user himself
- `PUT /users/block/:id` — Admin only

### ✍️ Posts
- `GET /posts` — Get all posts with comments
- `GET /posts/:id` — Get a single post with comments
- `GET /posts/me` — Get my posts with comments
- `POST /posts` — Create post
```http
POST /posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Post",
  "description": "This is my post."
}
```
- `PUT /posts/:id` — Update post (owner or admin)
```http
PUT /posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Post",
  "description": "Updated content."
}
```
- `DELETE /posts/:id` — Delete post
```http
DELETE /posts/:id
Authorization: Bearer <token>
```

### 💬 Comments
- `GET /comments` — Get all comments
- `GET /comments/:id` — Get a single comment
- `GET /comments/me` — Get my comments
- `POST /comments` — Add comment
```http
POST /comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "post": "<post_id>",
  "comment": "Great post!"
}
```
- `PUT /comments/:id` — Update comment (owner or admin)
```http
PUT /comments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "comment": "Updated comment."
}
```
- `DELETE /comments/:id` — Delete comment (owner or admin)
```http
DELETE /comments/:id
Authorization: Bearer <token>
```

## 🔍 Example: Get Single Post with Comments
```http
GET /posts/664c8a59d2430cabc95c9f25
```
```json
{
  "_id": "...",
  "title": "My First Post",
  "description": "This is the body of the post.",
  "user": {
    "_id": "...",
    "username": "johnDoe"
  },
  "comments": [
    {
      "_id": "...",
      "comment": "Nice post!",
      "user": { "_id": "...", "username": "jane" }
    }
  ]
}
```

## ✅ Running the Project
```bash
npm install
npm run start
```

### .env file example
```
MONGO_URI=mongodb://localhost:27017/demoDB
JWT_SECRET=yourSecretKey
```

---
Made with 💻 using Node.js + Express


