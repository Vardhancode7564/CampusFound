# CampusFound - Lost & Found Platform

![CampusFound](https://img.shields.io/badge/CampusFound-v1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)

A modern, full-stack web application designed to solve the everyday problem of lost and found items on college campuses. Students can report, track, and recover lost items through a centralized, user-friendly platform.

## 🎯 Features

### Core Functionality
- ✅ **User Authentication** - Secure JWT-based signup/login with bcrypt password hashing
- ✅ **Lost Item Reporting** - Create detailed reports with images, descriptions, and locations
- ✅ **Found Item Reporting** - Help others by posting found items with photos
- ✅ **Smart Search & Filters** - Browse items by category, date, location, or keyword
- ✅ **Item Claiming System** - Secure claim submission and verification process
- ✅ **Image Upload** - Cloudinary integration for fast, optimized image storage
- ✅ **User Dashboard** - Manage your posts and track claim status
- ✅ **Responsive Design** - Mobile-first UI that works on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage
- **Helmet** - Security headers
- **Express Rate Limit** - API rate limiting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary Account** (free tier available)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd project
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env and update values
cp .env.example .env
```

**Update `.env` file with your credentials:**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/campusfound
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

**Get Cloudinary Credentials:**
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

```bash
# Start the backend server
npm run dev

# Server will run on https://campusfound.onrender.com
```

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev

# Frontend will run on http://localhost:5173
```

### 4. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## 📱 Usage

1. **Register an Account**
   - Navigate to http://localhost:5173
   - Click "Sign Up" and create your account

2. **Report a Lost Item**
   - Click "Report Item" in the navigation
   - Select "I Lost Something"
   - Fill in details and upload image
   - Submit the report

3. **Report a Found Item**
   - Click "Report Item"
   - Select "I Found Something"
   - Add item details and photo
   - Post to help someone

4. **Browse Items**
   - Visit Dashboard to see all items
   - Use filters to narrow search
   - Search by keywords

5. **Claim an Item**
   - Click on any item to view details
   - Click "Claim This Item"
   - Provide verification details
   - Wait for owner to review

6. **Manage Your Posts**
   - Go to "My Posts" to see your items
   - Edit or delete posts
   - View claims from others

## 📁 Project Structure

```
project/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── itemController.js
│   │   ├── claimController.js
│   │   └── uploadController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   └── Claim.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── claimRoutes.js
│   │   └── uploadRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ItemCard.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ItemDetails.jsx
│   │   │   ├── ReportItem.jsx
│   │   │   ├── MyPosts.jsx
│   │   │   ├── MyClaims.jsx
│   │   │   └── Profile.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── constants.js
│   │   │   └── imageUpload.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Helmet.js for security headers
- Rate limiting to prevent abuse
- CORS configuration
- Input validation and sanitization

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Items
- `GET /api/items` - Get all items (with filters)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create item (Protected)
- `PUT /api/items/:id` - Update item (Protected)
- `DELETE /api/items/:id` - Delete item (Protected)
- `GET /api/items/my/posts` - Get user's items (Protected)

### Claims
- `POST /api/claims` - Create claim (Protected)
- `GET /api/claims/my` - Get user's claims (Protected)
- `GET /api/claims/item/:itemId` - Get item claims (Protected)
- `PUT /api/claims/:id` - Update claim status (Protected)
- `DELETE /api/claims/:id` - Delete claim (Protected)

### Upload
- `POST /api/upload` - Upload image (Protected)
- `DELETE /api/upload/:publicId` - Delete image (Protected)

## 🧪 Testing

```bash
# Test backend API
curl https://campusfound.onrender.com/api/health

# Expected response:
# {"success": true, "message": "CampusFound API is running"}
```

## 🚢 Deployment

### Backend Deployment (Render/Heroku)

1. Create account on [Render](https://render.com/) or [Heroku](https://heroku.com/)
2. Connect your repository
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Create account on [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/)
2. Connect your repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy

### Database (MongoDB Atlas)

1. Use MongoDB Atlas for production database
2. Update connection string in backend environment variables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern design practices
- Built with love for the student community

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Made with ❤️ for students, by students**
