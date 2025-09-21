# 🛡️ Express + Passport + MongoDB CRUD Tasks

A **Node.js web application** with:
- **User authentication** via Passport.js (session-based)
- **MongoDB Atlas** for storing users and tasks
- **Full CRUD interface** for managing tasks
- Each task is **bound to the logged-in user** and only visible/editable by its owner

---

## 🚀 Installation & Run

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
```

Create `.env` file:

```env
MONGO_URI=your-mongodb-atlas-uri
SESSION_SECRET=your-session-secret
PORT=3000
```

Start the server:

```bash
node server.js
```

Then open in browser:
- [http://localhost:3000/register.html](http://localhost:3000/register.html) — registration form  
- [http://localhost:3000/login.html](http://localhost:3000/login.html) — login form  
- [http://localhost:3000/protected](http://localhost:3000/protected) — protected page (requires login)

---

## 🔧 Technologies Used
- **Node.js + Express.js**
- **Passport.js** (`passport-local`)
- **express-session**, **cookie-parser**, **body-parser**
- **MongoDB + Mongoose**
- Plain **HTML forms** (login/register/add tasks)

---

## 🔐 Authentication Flow
- Uses `passport-local` strategy
- Authenticates with **email + password**
- Session stored in cookie (`connect.sid`)
- Cookie options: `httpOnly`, `secure: false`, `maxAge: 1 day`

---

## 📦 Models

### User
- `email: String`
- `password: String (hashed)`

### Task
- `title: String`
- `completed: Boolean`
- `owner: ObjectId (User)`
- `createdAt: Date`

---

## 🔗 Routes

### Auth Routes
| Route            | Method | Description                           |
|------------------|--------|---------------------------------------|
| `/register`      | POST   | Register a new user                   |
| `/login`         | POST   | Log in using Passport                 |
| `/logout`        | GET    | Log out and destroy session           |
| `/protected`     | GET    | Protected route (requires auth)       |

### Task Routes
| Route                   | Method | Description                                      |
|-------------------------|--------|--------------------------------------------------|
| `/tasks/add`            | POST   | Create a new task                                |
| `/tasks/insert-many`    | POST   | Bulk insert multiple tasks                       |
| `/tasks/update/:id`     | POST   | Update one task by ID                            |
| `/tasks/update-many`    | POST   | Bulk update tasks (e.g., mark all completed)     |
| `/tasks/replace/:id`    | POST   | Replace a task completely                        |
| `/tasks/delete/:id`     | POST   | Delete one task by ID                            |
| `/tasks/delete-many`    | POST   | Bulk delete tasks (e.g., remove completed ones)  |

---

## 🧪 Example Requests

### Register a new user
```http
POST /register
Content-Type: application/x-www-form-urlencoded

email=alex@example.com&password=1234
```

### Add a single task
```http
POST /tasks/add
Content-Type: application/x-www-form-urlencoded

title=Buy milk
```

### Insert multiple tasks
```http
POST /tasks/insert-many
Content-Type: application/json

{
  "tasks": [
    { "title": "Task A" },
    { "title": "Task B" }
  ]
}
```

### Replace a task
```http
POST /tasks/replace/123456
Content-Type: application/x-www-form-urlencoded

title=New Title&completed=true
```

### Access protected route
```http
GET /protected
Cookie: connect.sid=...
```

---

## 📁 Project Structure
```
project-root/
├── models/
│   ├── User.js
│   └── Task.js
├── middleware/
│   ├── passport-config.js
│   └── auth-check.js
├── db/
│   └── mongoose.js
├── public/
│   ├── login.html
│   ├── register.html
│   └── add-task.html
├── server.js
├── .env
└── README.md
```

---

## 🛡️ Data Protection
- All task routes require authentication (`ensureAuthenticated`)
- Tasks are filtered by `owner: req.user._id`
- Users can **only edit/delete their own tasks**

---

## 📤 License
Built for educational purposes. Free to use and modify.
