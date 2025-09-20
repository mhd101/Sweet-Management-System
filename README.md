# Sweet Management System

A full-stack web application for managing sweet inventory with separate user and admin functionalities. Users can browse and purchase sweets, while administrators can manage inventory and products.

## Demo
- [Sweet Shop Application Demo](https://drive.google.com/file/d/1EyWxSxAtq6OCjnaLTBPkubboWpDVU5La/view?usp=sharing)
- **Frontend (Shop):** [https://sweet-shop-vfd7.onrender.com](https://sweet-shop-vfd7.onrender.com)  
- **Backend (Start First):** [https://sweet-management-system.onrender.com](https://sweet-management-system.onrender.com)  
  > ⚠️ Run this first to wake up the server since Render spins it down when inactive.

## Features

### User Features
- User registration and login
- Browse all available sweets on the dashboard
- Search and filter sweets by name, category, or price range
- Purchase sweets (disabled when quantity is zero)

### Admin Features
- Separate admin dashboard with administrative controls
- Add new sweets to inventory
- Update existing sweet details
- Restock sweet quantities
- Delete sweets from inventory

### Security Features
- Rate limiting on API endpoints for security

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB database

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mhd101/Sweet-Management-System.git
cd Sweet-Management-System
```

2. **Install dependencies**
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend/sweets-app
npm install
```

3. **Configure environment variables**

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=3000

# MongoDB Configuration
MONGO_URI=your-mongodb-connection-string

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# Admin user credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-admin-password
```

Create a `.env` file in the `frontend/sweets-app` directory:
```env
VITE_API_URL=http://localhost:3000/api
```

4. **Set up the database and admin user**
```bash
# Navigate to backend directory
cd backend

# Create admin user
npm run create-admin
```

5. **Run the application**
```bash
# Start the backend server (from backend directory)
npm start

# In a new terminal, start the frontend (from frontend/sweets-app directory)
cd frontend/sweets-app
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing, express-rate-limit
- **Validation**: express-validator
- **Environment**: dotenv
- **CORS**: cors middleware

### Frontend
- **Framework**: React.js
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **Build Tool**: Vite

### Database
- **Database**: MongoDB Atlas (NoSQL)

## Project Structure

```
Sweet-Management-System/                    # Root project directory
├── backend/                                # Server-side application
│   ├── scripts/                            # Utility and setup scripts
│   │   └── createAdmin.js                  # Admin user creation script
│   ├── src/                                # Backend source code
│   │   ├── config/                         # Database and app configuration
│   │   ├── middlewares/                    # Express middleware functions
│   │   ├── models/                         # Database models and schemas
│   │   ├── routes/                         # API route definitions
│   │   └── server.js                       # Main server entry point
│   ├── tests/                              # Backend test files
│   ├── .env                                # Environment variables (DB, secrets)
│   ├── .gitignore                          # Git ignore rules for Node.js
│   ├── babel.config.js                     # Babel transpiler configuration
│   ├── package-lock.json                   # Locked dependency versions
│   └── package.json                        # Backend dependencies and scripts
│
├── frontend/                               # Client-side application
│   └── sweets-app/                         # React application directory
│       ├── src/                            # React source code
│       │   ├── api/                        # API service functions
│       │   ├── components/                 # Reusable React components
│       │   ├── context/                    # React Context providers
│       │   ├── pages/                      # Page-level components
│       │   ├── App.jsx                     # Main React application component
│       │   ├── index.css                   # Global CSS styles
│       │   └── main.jsx                    # React DOM entry point
│       ├── .env                            # Frontend environment variables
│       ├── .gitignore                      # Git ignore rules for React
│       ├── eslint.config.js                # Code linting configuration
│       ├── index.html                      # HTML template file
│       ├── package-lock.json               # Frontend locked dependencies
│       ├── package.json                    # Frontend dependencies and scripts
│       └── vite.config.js                  # Vite build tool configuration
│
└── README.md                               # Main project documentation
```

## Usage

### Admin Panel
1. Login with admin credentials at `/login`
2. Access admin features to:
   - Add new sweets with details (name, category, price, quantity, description)
   - Edit existing sweet information
   - Restock quantities for existing sweets
   - Remove sweets from inventory

### User Interface
1. Register a new account or login at `/login`
2. Browse the main dashboard to:
   - View all available sweets
   - Search sweets by name, category, or price range
   - Purchase sweets (button disabled when out of stock)

## Testing

Run the backend test suite:
```bash
# Navigate to backend directory
cd backend/tests/

# Run all tests
npm test

# Run specific test file
npm test -- testfile.test.js
```

## API Documentation

### Authentication Endpoints
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User and admin login
```

### Sweet Management Endpoints
```http
GET    /api/sweets              # Get all available sweets
GET    /api/sweets/search       # Search sweets with filters (name, category, price range)
POST   /api/sweets              # Add a new sweet (admin only)
PUT    /api/sweets/:id          # Update sweet details (admin only)
DELETE /api/sweets/:id          # Delete sweet (admin only)
```

### Inventory Management Endpoints
```http
POST /api/sweets/:id/purchase   # Purchase a sweet (decrements quantity)
POST /api/sweets/:id/restock    # Restock a sweet quantity (admin only)
```

## My AI Usage

### AI Tools Used
While building the Sweet Management System, I used these AI tools to speed up development and improve quality:

- **ChatGPT (GPT-4)** – Main assistant for coding help and solving problems  
- **GitHub Copilot** – Auto-complete and code suggestion tool in VS Code  
- **Claude** – Extra help for code review and documentation  

### How I Used Them

#### ChatGPT
- Helped plan the backend structure and best practices for Node.js/Express  
- Suggested MongoDB schema designs for Sweets and Users  
- Gave tips and strategies for debugging issues  

#### GitHub Copilot
- Completed repetitive code, like:
  - Express routes  
  - Mongoose queries  
  - React components  
  - Form validation  
- Suggested test templates for APIs and React  
- Helped create React components with Tailwind CSS  
- Wrote utility functions for data formatting, validation, and API calls  

#### Claude
- Reviewed code for improvements and security issues  
- Helped rewrite comments and improve documentation  

### Reflection on AI Impact

AI tools speed up my work by generating boilerplate code, improving quality, and helping me learn new patterns. The main challenge was that they sometimes misunderstood context, so I had to adjust code and avoid over-relying on them.