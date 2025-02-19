# API Documentation

## Authentication Endpoints

### POST /api/admin/signup
Create a new admin account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string",
  "fullName": "string",
  "signupCode": "string"
}
```

**Response:**
```json
{
  "message": "Admin account created successfully"
}
```

### POST /api/admin/login
Login to admin account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "string"
  }
}
```

## Admin Dashboard Endpoints

### GET /api/admin/stats
Get dashboard statistics. Requires authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalUsers": "number",
  "totalProducts": "number",
  "recentOrders": [
    {
      "id": "number",
      "customer": "string",
      "amount": "number",
      "status": "string"
    }
  ]
}
```

## Public Endpoints

### POST /api/contact
Submit a contact form message.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

**Response:**
```json
{
  "message": "Message sent successfully"
}
```

### GET /api/products
Get list of products.

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "price": "number",
    "stock": "number"
  }
]
```

### GET /api/products/:id
Get a single product by ID.

**Parameters:**
- id: Product ID (number)

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "message": "Too many requests, please try again later"
}
```

### 500 Internal Server Error
```json
{
  "message": "Something went wrong"
}
```

## Rate Limiting

- General API endpoints: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per hour per IP

## Security Features

1. JWT Authentication
2. Password Hashing (bcrypt)
3. XSS Protection
4. CSRF Protection
5. HTTP Security Headers
6. Rate Limiting
7. Input Validation
8. SQL Injection Protection
9. Parameter Pollution Protection
