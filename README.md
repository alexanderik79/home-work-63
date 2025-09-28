# 🛡️ Express + Passport + MongoDB CRUD Tasks (Advanced)

A **Node.js web application** with:
- **User authentication** via Passport.js (session-based)
- **MongoDB Atlas** for storing users and tasks
- **Full CRUD interface** for managing tasks
- **Advanced data handling** using Cursors and Aggregation Pipelines

---

## 🚀 Installation & Run

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
```

Create a `.env` file:

```
MONGO_URI=your-mongodb-atlas-uri
SESSION_SECRET=your-session-secret
PORT=3000
```

Start the server:

```bash
node server.js
```

Then open in browser:

- http://localhost:3000/register.html — registration form  
- http://localhost:3000/login.html — login form  
- http://localhost:3000/protected — protected page (requires login)

---

## ✨ New Advanced Features (HW63)

### 1. Data Streaming with Cursors
A dedicated route (`/tasks/stream`) uses **Mongoose cursors** to iterate over all user tasks.  
This prevents memory overflow when dealing with large collections by processing documents one-by-one or chunk by chunk.

### 2. Aggregation for Statistics
The route (`/tasks/stats`) uses a **MongoDB Aggregation Pipeline** to calculate statistics for the logged-in user, including:
- Total tasks
- Completed tasks
- Pending tasks
- Earliest and latest task dates

---

## 🔧 Technologies Used

- Node.js + Express.js  
- Passport.js (`passport-local`)  
- express-session, cookie-parser, body-parser  
- MongoDB + Mongoose  
- Plain HTML forms (login/register/add tasks)  

---

## 🔗 Routes

### Auth Routes

| Route       | Method | Description                  |
|-------------|--------|------------------------------|
| /register   | POST   | Register a new user          |
| /login      | POST   | Log in using Passport        |
| /logout     | GET    | Log out and destroy session  |
| /protected  | GET    | Protected route (auth only)  |

### Task Routes

| Route              | Method | Description                              |
|--------------------|--------|------------------------------------------|
| /tasks/add         | POST   | Create a new task                        |
| /tasks/insert-many | POST   | Bulk insert multiple tasks               |
| /tasks/update/:id  | POST   | Update one task by ID                    |
| /tasks/update-many | POST   | Bulk update tasks (e.g., mark completed) |
| /tasks/replace/:id | POST   | Replace a task completely                |
| /tasks/delete/:id  | POST   | Delete one task by ID                    |
| /tasks/delete-many | POST   | Bulk delete tasks (e.g., remove done)    |
| /tasks/stream      | GET    | Stream all tasks via MongoDB cursors     |
| /tasks/stats       | GET    | Get complex task statistics (aggregation)|

---

## 📦 Models

### User
- `email`: String  
- `password`: String (hashed)  

### Task
- `title`: String  
- `completed`: Boolean  
- `owner`: ObjectId (User) (Indexed for performance)  
- `createdAt`: Date  

---

## 🧪 Example Requests

### Get Task Statistics (JSON)
```http
GET /tasks/stats
Cookie: connect.sid=...
Accept: application/json
```

### Stream All Tasks
```http
GET /tasks/stream
Cookie: connect.sid=...
```

### Insert Multiple Tasks
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
- Tasks are filtered by owner: `req.user._id` in all read/write operations  
- Users can only edit/delete their own tasks  

---

## 📤 License

Built for educational purposes. Free to use and modify.
