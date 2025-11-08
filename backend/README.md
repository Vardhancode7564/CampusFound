# CampusFound Backend API

RESTful API for CampusFound - A Lost and Found Platform for College Campus

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Copy .env.example to .env
cp .env.example .env

# Update the values in .env
```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `https://campusfound.onrender.com`

## 📋 Environment Variables

Create a `.env` file with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/campusfound
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173

# Email Configuration (optional, for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (Protected)
- `PUT /profile` - Update user profile (Protected)

### Items (`/api/items`)
- `GET /` - Get all items (with filters)
- `GET /:id` - Get single item
- `POST /` - Create new item (Protected)
- `PUT /:id` - Update item (Protected)
- `DELETE /:id` - Delete item (Protected)
- `GET /my/posts` - Get user's items (Protected)

### Claims (`/api/claims`)
- `POST /` - Create new claim (Protected)
- `GET /my` - Get user's claims (Protected)
- `GET /item/:itemId` - Get claims for an item (Protected)
- `PUT /:id` - Update claim status (Protected)
- `DELETE /:id` - Delete claim (Protected)

### Upload (`/api/upload`)
- `POST /` - Upload image to Cloudinary (Protected)
- `DELETE /:publicId` - Delete image from Cloudinary (Protected)

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student/admin),
  studentId: String,
  phone: String,
  createdAt: Date
}
```

### Item
```javascript
{
  type: String (lost/found),
  title: String,
  description: String,
  category: String,
  imageURL: String,
  imagePublicId: String,
  location: String,
  date: Date,
  postedBy: ObjectId (User),
  status: String (active/claimed/resolved),
  contactInfo: { email, phone },
  createdAt: Date,
  updatedAt: Date
}
```

### Claim
```javascript
{
  itemId: ObjectId (Item),
  claimantId: ObjectId (User),
  message: String,
  status: String (pending/approved/rejected),
  verificationDetails: String,
  createdAt: Date,
  resolvedAt: Date
}
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## 🛡️ Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Helmet.js for security headers
- Rate limiting to prevent abuse
- CORS configuration
- Input validation

## 📧 Email Notifications

The system sends automated email notifications for:

### Claim Notifications
When a user submits a claim for an item:
- **Item owner** receives detailed claim information
- **Admin** (campusfoundrguktsklm@gmail.com) receives a BCC copy for oversight

### Contact Item Owner
When a user contacts an item owner:
- **Item owner** receives the contact message
- **Admin** (campusfoundrguktsklm@gmail.com) receives a BCC copy for oversight

**Admin Oversight**: All email communications are copied to the admin to monitor interactions and prevent any misleading claims or misuse of the platform.

### Email Setup
1. Use a Gmail account for sending emails
2. Enable 2-factor authentication
3. Generate an App Password (not your regular password)
4. Add credentials to `.env`:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ```

## 📝 Sample Requests

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "password123",
  "studentId": "STU001"
}
```

### Create Lost Item
```bash
POST /api/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "lost",
  "title": "Black Backpack",
  "description": "Lost near library, contains laptop",
  "category": "Bags",
  "location": "Central Library",
  "date": "2024-01-15",
  "imageURL": "https://..."
}
```

### Search Items
```bash
GET /api/items?type=lost&category=Electronics&search=laptop
```

## 🧪 Testing

Use Postman, Insomnia, or cURL to test the API endpoints. A Postman collection is recommended for comprehensive testing.

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cloudinary** - Image storage
- **nodemailer** - Email notifications
- **cors** - CORS middleware
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **dotenv** - Environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

ISC
