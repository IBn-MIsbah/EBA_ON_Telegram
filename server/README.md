# EBA Smart Ordering – Backend

This is the **backend API** for the EBA Smart Ordering system.  
It powers both the Telegram bot (student interface) and the web dashboard (admin interface).

---

## ⚙️ Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- node-telegram-bot-api
- Multer (file uploads)
- Zod (validation)

---

## 📁 Folder Structure

````

server/
├── src/
│   ├── bot/            # Telegram bot logic
│   ├── controllers/    # Request handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── middlewares/    # Validation & helpers
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env
├── package.json
└── README.md

````

---

## 🧠 Core Concepts

- **API-first design**: All business logic lives in the backend
- **Client-agnostic**: Telegram bot and web dashboard share the same APIs
- **Stateless architecture**: Easy to scale and extend
- **Schema validation** at request boundaries

---

## 📦 Key Models

- Product
- Order (with embedded customer info)
- Payment confirmation via screenshot

---

## 🔌 Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
TELEGRAM_BOT_TOKEN=your_bot_token
````

---

## ▶️ Running the Server

```bash
npm install
npm run dev
```

Server will start on:

```
http://localhost:5000
```

---

## 🔗 API Overview

* `GET /api/products` – Fetch available products
* `POST /api/orders` – Create a new order
* `POST /api/orders/:id/payment` – Upload payment screenshot
* `GET /api/orders` – Admin order list
* `PATCH /api/orders/:id/status` – Update order status

---

## 🧪 Notes

* Payment verification is manual by design
* Optimized for hackathon delivery speed
* Designed for easy future extension

---

