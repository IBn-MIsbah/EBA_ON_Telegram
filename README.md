# EBA Smart Ordering System

EBA Smart Ordering is a **Telegram-first ordering platform** built for a local university-area shop.  
It allows students to browse products, place orders, submit payment confirmation, and request delivery via Telegram, while giving the shop owner a simple web dashboard to manage stock and orders.

This project was developed for a **local hackathon**, focusing on real-world usability, speed of delivery, and clean backend architecture.

---

## 🧩 Project Structure

```

eba-smart-ordering/
│
├── server/        # Node.js + Express + MongoDB backend
├── client/        # Vite + React admin dashboard
├── docs/          # API docs and Case study
└── README.md

```

---

## 🚀 Core Features

- Telegram bot for student ordering
- Product browsing and availability checks
- Order placement and delivery details collection
- Bank payment screenshot submission
- Admin web dashboard for stock and order management
- Shared API backend for all clients

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- Telegram Bot API

### Frontend
- React
- Vite
- REST API integration

---

## 🧠 System Design Overview

```

Telegram Bot ─────┐
├── Express API ── MongoDB
Admin Dashboard ──┘

````

- Stateless API
- Client-agnostic backend
- Centralized data model

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or cloud)
- Telegram Bot Token

### Setup
```bash
git clone https://github.com/IBn-MIsbah/EBA_ON_Telegram.git
cd EBA_ON_Telegram
````

See individual READMEs in `/server` and `/client` for setup instructions.

---

## 🔮 Future Improvements

* Multi-shop support
* Automated payment verification
* Order status notifications
* Analytics dashboard
* Role-based access control

---

## 👨‍💻 Author

Built as a hackathon project with a focus on backend architecture, real-world constraints, and rapid delivery.
