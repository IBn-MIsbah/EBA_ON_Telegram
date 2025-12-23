
# API Documentation

## Auth and related Routes

- ### POST /auht/login

### Expected body object

```
{
 "email":"abcd@abcd.com",
 "password":"123456789"
}
```
### On success

```
{
  "success": true,
  "message": "Login seccessfully",
  "role": "ADMIN",
  "isActive": true
}
```

### On error

```
{
  "success": false,
  "message": "Incorrect username or password"
}
```
- ### POST /auht/logout
```
{
  "success": true,
  "message": "Logged Out"
}
```

- ### GET /auth/me

```
{
  "success": true,
  "data": {
    "_id": "6949926c5a284962aad06acf",
    "name": "Admin",
    "phone": "0987654321",
    "email": "abcd@abcd.com",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2025-12-22T18:48:12.382Z",
    "updatedAt": "2025-12-22T19:13:36.642Z"
  }
}
```

- ### POST /auth/refresh-token

### On error
```
{
  "success": false,
  "message": "No token provided"
}
```
### On success
```
{
  "message": "Token refreshed successfully"
}
```

---