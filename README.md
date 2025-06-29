# 📝 Note Web App — MERN Stack CRUD Application

A full-stack Note Taking Web App built with the **MERN** stack. Users can register, log in, and perform secure CRUD operations on notes with full authentication support.

---

## 🚀 Features

* ✅ User Authentication (Register/Login with JWT)
* 🔒 Forgot Password with Email OTP
* 🗃️ Create, Read, Update, and Delete notes
* 💾 Data stored in MongoDB
* 🧼 XSS protection using DOMPurify
* 🎨 Clean UI with Material UI
* ⚙️ Modular & optimized code structure
* 📦 Vite-powered React frontend
* 🔁 Redux Toolkit with Redux Persist

---

## 📁 Folder Structure

```
note-webapp/
├── client/     # React frontend (Vite)
├── server/     # Express backend
└── README.md   # Project docs and setup
```

---

## 🔧 Prerequisites

* Node.js >= 18.x
* MongoDB (local or Atlas)
* Git

---

## ⚙️ Backend Setup (server/)

```bash
cd server
npm install
```

### 🔥 Start the Server

```bash
npm run dev
```

---

## 🎨 Frontend Setup (client/)

```bash
cd client
npm install
```

### 📂 Environment Variables (`.env.local`)

```
VITE_API_BASE_URL=http://localhost:5000
```

### 🚀 Start the Frontend

```bash
npm run dev
```

---

## 📦 Tech Stack & Dependencies

### 🖥 Frontend

| Package                  | Purpose               |
| ------------------------ | --------------------- |
| `react`, `react-dom`     | UI framework          |
| `vite`                   | Fast dev/build tool   |
| `react-router-dom@v7`    | Routing               |
| `@mui/material`, `icons` | UI components         |
| `redux-toolkit`          | State management      |
| `redux-persist`          | Persist Redux store   |
| `react-hot-toast`        | Toast notifications   |
| `react-helmet-async`     | SEO and `<head>` tags |
| `dompurify`              | XSS protection        |
| `date-fns`               | Time formatting       |

### ⚙️ Backend

| Package              | Purpose                    |
| -------------------- | -------------------------- |
| `express`            | Web framework              |
| `mongoose`           | MongoDB ODM                |
| `jsonwebtoken`       | JWT authentication         |
| `bcrypt`             | Password hashing           |
| `dotenv-flow`        | Env management             |
| `nodemailer`         | Email services (OTP/reset) |
| `express-validator`  | Request validation         |
| `helmet`             | Secure HTTP headers        |
| `express-rate-limit` | Request limiting           |
| `morgan`             | HTTP logger                |
| `cors`               | Cross-origin access        |

### 🧪 Dev Dependencies

| Package                    | Used In      | Purpose                           |
| -------------------------- | ------------ | --------------------------------- |
| `nodemon`                  | Backend Dev  | Auto-restarts server on changes   |
| `cross-env`                | Backend Dev  | Env config for all OS             |
| `eslint`, plugins          | Frontend Dev | Code linting & quality checks     |
| `@vitejs/plugin-react-swc` | Frontend     | React with blazing-fast SWC build |

---

## 🧑‍💻 Available Scripts

### Frontend

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run lint      # Lint the code
```

### Backend

```bash
npm run dev       # Start backend with nodemon
npm start        # Start the backend in production mode
```

---

## 🛠 Features Roadmap

* [x] User Signup/Login/Forgot Password
* [x] Notes CRUD (Create, Read, Update, Delete)
* [x] JWT Auth with Protected Routes
* [x] SEO-ready with React Helmet
* [x] Responsive UI using MUI
* [ ] Dark Mode toggle 🌙
* [ ] Unit tests with Vitest or Jest

---


🛣️ API Endpoints

Auth Routes (/api/v1/auth)

Method	Endpoint	Description	   Auth Required
POST	/signup	Register a new user	No
POST	/verify-otp	Verify email OTP (signup)	No
POST	/login	Login user	No
POST	/forgot-password	Request password reset OTP	No
POST	/verify-password-otp	Verify OTP & reset password	No
PATCH	/update-profile	Update user profile	Yes

Note Routes (/api/v1/note)

Method	Endpoint	Description	    Auth Required
POST	/add-note	Create a new note	Yes
GET	    /get-all-notes	Get all notes for user	Yes
GET	    /get-note/:noteId	Get a single note by ID	Yes
PATCH	/update-note/:noteId	Update a note by ID	Yes
DELETE	/delete-note/:noteId	Delete a note by ID	Yes


## 📄 License

This project is licensed under the MIT License — feel free to fork and build your own version!

---

## ✨ Author

**Uttam Verma (UV)** — MERN Stack Developer 🚀
[GitHub](https://github.com/imuv21)
