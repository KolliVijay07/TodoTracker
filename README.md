# TodoTracker (Full-Stack MERN Project)

A full-stack task management application with a clean separation between **Frontend** and **Backend**.

---

## 📂 Project Architecture

```text
TodoList/
├── Backend/                   # Node.js + Express + MongoDB (MVC Layered Pattern)
│   ├── .env                   # PORT=3000, MONGODB_URI
│   ├── .env.example
│   ├── package.json
│   ├── server.js              # Server entry point (starts server & DB)
│   └── src/
│       ├── app.js             # Express app setup, middlewares, routes
│       ├── db/
│       │   └── db.js          # MongoDB connection module
│       ├── models/
│       │   └── todo.model.js  # Mongoose Todo schema
│       ├── controllers/
│       │   └── todo.controller.js # Request/Response handlers
│       ├── services/
│       │   └── todo.service.js    # Database business logic
│       ├── routes/
│       │   └── todo.routes.js     # API endpoints
│       └── middlewares/
│           └── error.middleware.js # Centralized error handler
│
├── Frontend/                  # Vite + React 19 + Tailwind CSS v4
│   ├── src/
│   │   ├── Components/
│   │   │   └── Navbar.jsx
│   │   ├── services/
│   │   │   └── todoService.js # Fetch client pointing to /api/todos
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js         # Proxy config: /api -> http://localhost:3000
│
├── package.json               # Root scripts to run both apps together
└── README.md
```

---

## ⚡ Running the Project

### Option 1: Run Both Together from Root (`TodoList/`)
```bash
npm run dev
```

### Option 2: Run Separately in Individual Terminals

**Terminal 1 (Backend):**
```bash
cd Backend
npm run dev
```
*Backend runs on: [http://localhost:3000](http://localhost:3000)*

**Terminal 2 (Frontend):**
```bash
cd Frontend
npm run dev
```
*Frontend runs on: [http://localhost:5173](http://localhost:5173)*

---

## 📡 API Endpoints (Port 3000)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/todos` | Retrieve all tasks |
| `POST` | `/api/todos` | Create a new task (`{ "todo": "Task text" }`) |
| `PUT` | `/api/todos/:id` | Update task text or `isCompleted` |
| `DELETE` | `/api/todos/:id` | Delete a single task |
| `DELETE` | `/api/todos?completed=true` | Clear all completed tasks |
| `GET` | `/api/health` | Health check (DB status) |
