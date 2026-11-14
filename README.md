# 🛠️ BookNook Server — REST API & Database Service

[![Live API](https://img.shields.io/badge/Live_API-Vercel-1E293B?style=for-the-badge&logo=express&logoColor=white)](https://book-nook-server-swart.vercel.app/)
[![Client Website](https://img.shields.io/badge/Client_Website-Live-762F3D?style=for-the-badge&logo=vercel&logoColor=white)](https://booknook-frontend-gray.vercel.app/)
[![Client Repo](https://img.shields.io/badge/Client_Repo-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Rezanur2/book-nook-client)
[![Server Repo](https://img.shields.io/badge/Server_Repo-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Rezanur2/book-nook-server)

The backend REST API service for **BookNook**, an online library management system. Built with Express.js and MongoDB Native driver, featuring JWT token authentication and inventory synchronization.

---

## 🌐 Live Deployments & Repository Links

* **Live Server API:** [https://book-nook-server-swart.vercel.app](https://book-nook-server-swart.vercel.app/)
* **Live Client Website:** [https://booknook-frontend-gray.vercel.app](https://booknook-frontend-gray.vercel.app/)
* **Server GitHub Repository:** [https://github.com/Rezanur2/book-nook-server](https://github.com/Rezanur2/book-nook-server)
* **Client GitHub Repository:** [https://github.com/Rezanur2/book-nook-client](https://github.com/Rezanur2/book-nook-client)

---

## 📡 API Endpoints

### 📚 Books Collection (`/books`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/books` | Public | Retrieve all books or filter by `?email=` |
| `GET` | `/books/:id` | Private (`verifyToken`) | Retrieve detailed info for a single book |
| `POST` | `/books` | Private (`verifyToken`) | Add a new book to the catalog |
| `PATCH` | `/books/:id` | Private (`verifyToken`) | Update existing book metadata |
| `DELETE` | `/books/:id` | Private (`verifyToken`) | Delete a book from the library catalog |

### 🤝 Borrows Collection (`/borrows`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/borrows` | Private (`verifyToken`) | Retrieve borrowed books by `?email=` |
| `POST` | `/borrows` | Private (`verifyToken`) | Borrow a book, deduct copies, prevent double borrow |
| `DELETE` | `/borrows/:id` | Private (`verifyToken`) | Return a borrowed volume and increment available copies |

---

## 🛠️ Tech Stack & Packages

* **Runtime:** Node.js
* **Framework:** Express.js (v5)
* **Database Driver:** MongoDB Native (`mongodb`)
* **Security & Auth:** `jose` (JWT verification)
* **Middleware:** CORS (`cors`), Environment loader (`dotenv`)

---

## 🚀 Local Setup & Installation

### 1. Clone & Install
```bash
git clone https://github.com/Rezanur2/book-nook-server.git
cd book-nook-server
npm install
```

### 2. Environment Variables (`.env`)
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
BETTER_AUTH_SECRET=your_auth_secret_key
```

### 3. Start Server
```bash
node index.js
```
The server will start listening at `http://localhost:5000`.
