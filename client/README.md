# Frontend README (`client/README.md`)

# EBA Smart Ordering – Admin Dashboard

This is the **admin web dashboard** for managing products and orders in the EBA Smart Ordering system.

Built with **Vite + React**, it communicates with the backend via REST APIs.

---

## ⚙️ Tech Stack

- React
- Vite
- Fetch / Axios for API calls
- Basic component-based UI

---

## 📁 Folder Structure

````
    client/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/      # API calls
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── README.md
````

---

## 🎯 Features

- View available products
- Add / update product stock and price
- View incoming orders
- Review payment screenshots
- Update order status manually

---

## ▶️ Running the Client

```bash
npm install
npm run dev
````

App will be available at:

```
http://localhost:5173
```

---

## 🔗 Backend Connection

Update API base URL if needed:

```js
const API_BASE_URL = "http://localhost:5000/api";
```

---

## 🧠 Design Philosophy

* Simple UI for non-technical shop owners
* No authentication for hackathon MVP
* Focus on clarity over visual complexity

---

## 🔮 Future Improvements

* Authentication & roles
* Better UI/UX
* Analytics & reporting
* Mobile-friendly layout

---
