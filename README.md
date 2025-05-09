# 📱 Social Media Backend API

This is a RESTful backend for a Social Media platform, built using **Node.js**, **Express**, **MongoDB**, **JWT**, and **Zod**. It supports user authentication, post creation, liking, commenting, following, and searching users.

---

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Token)
- **Validation:** Zod
- **Security:** bcrypt for password hashing

---

## 📁 Project Structure

```
social-media-backend/
│
├── routes/
│   ├── authRoutes.ts
│   ├── postRoutes.ts
│   ├── userRoutes.ts
│   └── commentRoutes.ts
│
├── models/
│   ├── userModel.ts
│   ├── postModel.ts
│   ├── likeModel.ts
│   └── commentModel.ts
│
├── Middleware.ts
├── db.ts
├── index.ts
└── package.json
```

---

## 🧺s API Endpoints

### 🔐 Auth (`/auth`)
- `POST /auth/signup` – Register new user
- `POST /auth/signin` – Login and receive JWT token

### 📝 Posts (`/posts`)
- `GET /posts` – Get all posts of the logged-in user
- `POST /posts` – Create a new post
- `DELETE /posts/:postId` – Delete your own post

### 💬 Comments (`/comments`)
- `POST /comments` – Add a comment to a post
- `GET /comments` – Get all comments for a post

### 👤 Users (`/users`)
- `GET /users/search-users?query=username` – Search users by name
- `POST /users/follow` – Follow or unfollow another user

---

## 🔒 Protected Routes

All routes except `/auth/signup` and `/auth/signin` require a valid JWT in the `Authorization` header:

```
Authorization: Bearer <your_token_here>
```

---

## 🛠️ Setup & Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/social-media-backend.git
cd social-media-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas, and update the connection URI in `db.ts`.

### 4. Run the server
```bash
npm run dev
```

Server will start at:  
```
http://localhost:3006
```

---

## 📦 Sample `.env` (if you're using dotenv)
```
PORT=3006
JWT_SECRET=your_secret_key
MONGODB_URI=mongodb://localhost:27017/socialapp
```

---

## 📌 Features

- User registration & login with hashed passwords
- JWT-based route protection
- Create, delete, and fetch posts
- Like/unlike a post
- Comment on posts
- Search for users
- Follow/unfollow users

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Feel free to fork this project and submit PRs. Contributions are welcome!

