
---

# EBA Store API Documentation `v1.0.0`

### **Base URL**

* **Development:** `http://localhost:5000/api/v1`
* **Health Check:** `http://localhost:5000/health`

---

## 🟢 System Health

### `GET /health`

Verifies server status and database connectivity.

* **Success Response:** `200 OK`

```json
{
  "success": true,
  "message": "Health check passed",
  "timestamp": "2025-12-27T06:45:04.998Z"
}

```

---

## 🔐 Authentication

Handle user sessions, roles, and token rotations.

### **1. Login**

`POST /auth/login`

* **Content-Type:** `application/json`
* **Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}

```


* **Success Response:** `200 OK` (Sets HTTP-only cookie)
```json
{
  "success": true,
  "message": "Login successfully",
  "role": "ADMIN",
  "isActive": true
}

```


* **Error Response:** `401 Unauthorized`

### **2. Logout**

`POST /auth/logout`

* **Description:** Clears the session cookie.
* **Success Response:** `200 OK`

### **3. Get Profile**

`GET /auth/me`

* **Description:** Returns details of the currently authenticated user.
* **Success Response:** `200 OK`
```json
{
  "success": true,
  "data": { "_id": "...", "name": "Admin", "role": "ADMIN", "email": "..." }
}

```



### **4. Refresh Token**

`POST /auth/refresh-token`

* **Success Response:** `200 OK`
* **Error Response:** `401 Unauthorized` (No token provided)

---

## 📦 Products (Protected)

Manage store inventory. **Note:** Mutation routes (`POST`, `PATCH`, `DELETE`) require `ADMIN` privileges.

### **1. Create Product**

`POST /product`

* **Content-Type:** `multipart/form-data`

* **Body Fields:**

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | string | Yes | Product title |
| `price` | number | Yes | Unit price |
| `stock` | number | Yes | Inventory count |
| `image` | file | Yes | Product photo (Multipart) |
| `description`| string | No | Detailed description |
| `category` | string | No | Product grouping |
| `isAvailable`| boolean| No | Default: `true` |

### **2. List All Products**

`GET /product`

* **Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "List of all available Products",
  "data": [ { ... }, { ... } ]
}

```



### **3. Get Product by ID**

`GET /product/:id`

* **Success Response:** `200 OK`
* **Error (400):** Invalid ID format (Zod validation failed).
* **Error (404):** Product not found (Valid ID format, but missing in DB).

### **4. Update Product (Partial)**

`PATCH /product/:id`

* **Content-Type:** `multipart/form-data`
* **Description:** Send only the fields you wish to update. If a new `image` is sent, the previous file is deleted from the server.
* **Success Response:** `200 OK`

### **5. Delete Product**

`DELETE /product/:id`

* **Description:** Removes database record and deletes the associated image file from disk.
* **Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product and associated image deleted successfully!"
}

```



---

## 🚦 Error Handling Strategy

All endpoints return a consistent error structure:

| Status Code | Scenario |
| --- | --- |
| `400` | **Bad Request**: Validation error (e.g., malformed ID or missing fields). |
| `401` | **Unauthorized**: Missing or expired session token. |
| `403` | **Forbidden**: User is authenticated but lacks `ADMIN` role. |
| `404` | **Not Found**: Resource does not exist. |
| `500` | **Internal Error**: Server-side crash or file system failure. |

---
