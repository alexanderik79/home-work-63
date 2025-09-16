# 🛡️ Express + Passport Authentication

A simple project demonstrating **user authentication** with **Express.js** and **Passport** using session-based login.  
Users can **register, log in, log out**, and access a **protected route** `/protected`.

---

## 🚀 Installation & Run

```bash
npm install
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
- **express-session**  
- **cookie-parser**, **body-parser**  
- Plain **HTML forms**

---

## 🔐 Authentication Flow

- Uses `passport-local` strategy  
- Authenticates with **email + password**  
- Session stored in cookie (`connect.sid`)  
- Cookie options: `httpOnly`, `secure: false`, `maxAge: 1 day`

---

## 📁 Project Structure

```
express-passport-auth/
├── server.js
├── data/
│   └── users.js
├── middleware/
│   ├── passport-config.js
│   └── auth-check.js
├── public/
│   ├── login.html
│   └── register.html
```

---

## 🔗 Routes

| Route            | Method | Description                           |
|------------------|--------|---------------------------------------|
| `/register`      | POST   | Register a new user                   |
| `/login`         | POST   | Log in using Passport                 |
| `/logout`        | GET    | Log out and destroy session           |
| `/protected`     | GET    | Protected route (requires auth)       |
| `/login.html`    | GET    | Login form                            |
| `/register.html` | GET    | Registration form                     |
| `/login-failed`  | GET    | Login failure page                    |

---

## 🧪 Testing

### Register
```http
POST /register
Content-Type: application/x-www-form-urlencoded

email=alex@example.com&password=1234
```

### Login
```http
POST /login
Content-Type: application/x-www-form-urlencoded

email=alex@example.com&password=1234
```

### Access Protected Route
```http
GET /protected
Cookie: connect.sid=...
```

---

## 📤 License

Built for educational purposes. Free to use and modify.
