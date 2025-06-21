# 📚 Book API

A full-featured RESTful API built with **Node.js**, **Express.js**, and **MongoDB** for managing users, posts, comments, books, authors, and profile images. This project demonstrates user authentication, CRUD operations, data relationships, and Cloudinary-based image uploads.

---

## 🚀 Tech Stack

| Technology                | Purpose                          |
| ------------------------- | -------------------------------- |
| **Node.js**               | JavaScript runtime environment   |
| **Express.js**            | Web framework for Node.js        |
| **MongoDB + Mongoose**    | NoSQL database + ODM             |
| **JWT**                   | Authentication (JSON Web Tokens) |
| **Joi**                   | Request validation               |
| **bcryptjs**              | Password hashing                 |
| **dotenv**                | Environment variable management  |
| **express-async-handler** | Simplified async error handling  |
| **nodemailer**            | Sending reset password emails    |
| **Cloudinary**            | Uploading profile images         |
| **multer**                | Handling multipart file uploads  |

---

## 📁 Project Structure

```
├── models/              # Mongoose models (User, Post, Comment, Book, Author)
├── routes/              # Express route handlers
├── middlewares/         # Authentication & authorization logic
├── utils/               # Joi validation schemas + mailer + Cloudinary
├── app.js               # App entry point
└── .env                 # Environment config
```

---

## 🔐 Authentication

JWT-based user authentication.

### ✅ Register

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### 🔑 Login

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Include token in protected requests:**

```
Authorization: Bearer <token>
```

---

## 🔄 Password Reset

### 📩 Request Password Reset Email

```http
POST /api/auth/forgot-password
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "redirectUrl": "https://yourapp.com/reset-password"
}
```

> The API sends a secure token to the user's email with the full reset URL.

### 🔁 Reset Password

```http
POST /api/auth/reset-password
```

**Request Body:**

```json
{
  "token": "abc123resetToken",
  "newPassword": "NewSecurePassword@123"
}
```

---

## 📤 Profile Image Upload (Cloudinary)

Authenticated users can upload a profile image. The image is stored on **Cloudinary**, and any previously uploaded image is automatically deleted.

### 🔐 Endpoint

```http
POST /api/users/:id/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**

| Key   | Type | Required | Description               |
| ----- | ---- | -------- | ------------------------- |
| image | File | Yes      | JPEG or PNG profile image |

> 🔒 Only the user themselves or an admin can upload an image.

### ✅ Response Example

```json
{
  "message": "Profile image uploaded to Cloudinary",
  "user": {
    "id": "665c94f99ab1c9e02a5e878d",
    "username": "johndoe",
    "email": "john@example.com",
    "profileImage": "https://res.cloudinary.com/your_cloud_name/image/upload/v.../profile.jpg"
  }
}
```

### 🛠 .env Requirements for Cloudinary

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🧑‍💼 User Endpoints

| Method | Endpoint               | Access     | Description    |
| ------ | ---------------------- | ---------- | -------------- |
| GET    | `/api/users`           | Admin      | Get all users  |
| GET    | `/api/users/:id`       | Admin/User | Get user by ID |
| PUT    | `/api/users/:id`       | Admin/User | Update user    |
| DELETE | `/api/users/:id`       | Admin/User | Delete user    |
| PUT    | `/api/users/block/:id` | Admin      | Block user     |

---

## ✍️ Post Endpoints

| Method | Endpoint         | Access        | Description                 |
| ------ | ---------------- | ------------- | --------------------------- |
| GET    | `/api/posts`     | Public        | Get all posts with comments |
| GET    | `/api/posts/:id` | Public        | Get a single post           |
| GET    | `/api/posts/me`  | Authenticated | Get posts by logged-in user |
| POST   | `/api/posts`     | Authenticated | Create a new post           |
| PUT    | `/api/posts/:id` | Owner/Admin   | Update a post               |
| DELETE | `/api/posts/:id` | Owner/Admin   | Delete a post               |

### 📌 Example: Create a Post

```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Hello World",
  "description": "This is my first post!"
}
```

---

## 💬 Comment Endpoints

| Method | Endpoint            | Access        | Description                   |
| ------ | ------------------- | ------------- | ----------------------------- |
| GET    | `/api/comments`     | Public        | Get all comments              |
| GET    | `/api/comments/:id` | Public        | Get a single comment          |
| GET    | `/api/comments/me`  | Authenticated | Get logged-in user's comments |
| POST   | `/api/comments`     | Authenticated | Add a comment                 |
| PUT    | `/api/comments/:id` | Owner/Admin   | Update a comment              |
| DELETE | `/api/comments/:id` | Owner/Admin   | Delete a comment              |

### 📝 Example: Add a Comment

```http
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "post": "664c8a59d2430cabc95c9f25",
  "comment": "Great post!"
}
```

---

## 📚 Books & Authors

| Method | Endpoint       | Description                       |
| ------ | -------------- | --------------------------------- |
| GET    | `/api/books`   | Get all books with author details |
| POST   | `/api/books`   | Create a new book                 |
| GET    | `/api/authors` | Get all authors                   |
| POST   | `/api/authors` | Add a new author                  |

### 🔍 Filtered & Paginated Books

```http
GET /api/books?page=1&price=20&comparison=eq
GET /api/books?page=2&comparison=between&price=10&maxPrice=30
```

**Optional Query Parameters:**

* `page`: Page number (default: 1)
* `price`: Price value to compare
* `comparison`: Can be `eq`, `neq`, `gt`, `lt`, or `between`
* `maxPrice`: Required only if `comparison=between`

**Response:**

```json
{
  "data": [
    {
      "_id": "...",
      "title": "Book Title",
      "price": 25,
      "author": {
        "_id": "...",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "total": 50
}
```

---

## 🔍 Example: Get Post With Comments

```http
GET /api/posts/664c8a59d2430cabc95c9f25
```

**Response:**

```json
{
  "_id": "664c8a59d2430cabc95c9f25",
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
      "user": {
        "_id": "...",
        "username": "jane"
      }
    }
  ]
}
```

---

## ⚙️ Running the Project

```bash
npm install
npm run start
```

### 🌱 .env Example

```env
MONGO_URI=mongodb://localhost:27017/demoDB
JWT_SECRET=yourSecretKey
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🧠 Author

Made with 💻 by \[Fouad Mohamed Abdelkader]

Feel free to contribute or fork the project!

---
