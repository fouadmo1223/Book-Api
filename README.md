# 📚 Book API

A RESTful API built with **Node.js**, **Express**, and **MongoDB** that manages **Users**, **Books**, and **Authors**, with secure authentication, input validation, pagination, and role-based access control.

---

## 🚀 Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB ODM
- **JWT (jsonwebtoken)** – Authentication via access tokens
- **bcryptjs** – Password hashing
- **Joi** – Data validation
- **dotenv** – Environment variable management
- **nodemon** – Dev server auto-reloading
- **express-async-handler** – Clean async error handling

---

## 📂 Project Structure

```
.
├── app.js
├── config/
│   └── connectDB.js
├── controllers/
├── middlewares/
│   └── verifyToken.js
├── models/
│   ├── User.js
│   ├── Book.js
│   └── Author.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── bookRoutes.js
│   └── authorRoutes.js
├── utils/
│   └── Schemas.js
├── .env
└── package.json
```

---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/book-api.git
cd book-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:

```env
PORT=5000
DB_URL=mongodb://localhost:27017/book-api
JWT_SECRET=your_secret_key
```

### 4. Start the server

```bash
npm start
```

---

## 🔐 Authentication

### Register

```http
POST /api/auth/register
```

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456"
}
```

### Login

```http
POST /api/auth/login
```

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

🔁 Returns a JWT token:

```json
{
  "id": "userId",
  "username": "john",
  "email": "john@example.com",
  "isAdmin": false,
  "token": "your_jwt_token"
}
```

---

## 📘 Book Routes

### Get All Books (paginated)

```http
GET /api/books?page=1
```

### Get Book by ID

```http
GET /api/books/:id
```

### Create Book *(Authenticated)*

```http
POST /api/books
Authorization: Bearer <token>
```

```json
{
  "title": "The Hobbit",
  "author": "authorId",
  "price": 25,
  "description": "Fantasy adventure",
  "cover": "https://image.url"
}
```

### Update Book *(Admin Only)*

```http
PUT /api/books/:id
Authorization: Bearer <admin-token>
```

### Delete Book *(Admin Only)*

```http
DELETE /api/books/:id
Authorization: Bearer <admin-token>
```

---

## ✍️ Author Routes

### Get All Authors

```http
GET /api/authors?page=1
```

### Get Author by ID

```http
GET /api/authors/:id
```

### Create Author *(Authenticated)*

```http
POST /api/authors
Authorization: Bearer <token>
```

```json
{
  "firstName": "J.R.R.",
  "lastName": "Tolkien",
  "nationality": "British",
  "image": "https://image.url"
}
```

---

## 👤 User Routes

### Get All Users *(Admin Only)*

```http
GET /api/users
Authorization: Bearer <admin-token>
```

### Get Single User *(Owner or Admin)*

```http
GET /api/users/:id
Authorization: Bearer <token>
```

### Update User *(Owner or Admin)*

```http
PUT /api/users/:id
Authorization: Bearer <token>
```

```json
{
  "username": "newname",
  "email": "new@example.com",
  "password": "newpassword"
}
```

### Delete User *(Owner or Admin)*

```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

### Block/Unblock User *(Admin Only)*

```http
PUT /api/users/block/:id
Authorization: Bearer <admin-token>
```

---

## 📦 Example `.env`

```env
PORT=5000
DB_URL=mongodb://localhost:27017/book-api
JWT_SECRET=supersecretkey123
```

---

## ✅ Future Improvements

- Swagger or Postman Docs
- Email verification
- Role-based permissions
- Unit & integration tests

---

