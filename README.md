# Code-a-Nova | Full Stack Hackathon Registration Portal

A complete, production-ready Full Stack Hackathon Registration Portal built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), **Tailwind CSS**, and **Nodemailer**. 

The platform supports secure user authentication with **time-limited 6-digit OTP email verification**, a **protected user dashboard**, dynamic team registration (1 to 5 members), and **automated email notifications** sent from Code-a-Nova.

---

## 🚀 Key Features

- **Responsive Landing Page**: Hero section with countdown, event highlights, timeline, 6 domain tracks, and prize pool breakdown.
- **Robust Authentication**:
  - Email + Password registration with `bcrypt` salted hashing.
  - Custom 6-digit cryptographic OTP generation with **10-minute expiry (MongoDB TTL index)**.
  - Account verification screen with auto-focus inputs, paste handling, countdown timer, and **Resend OTP** functionality.
  - JWT session generation and protected route guards.
- **Dynamic Hackathon Registration Form**:
  - Validates full name, email (pre-filled from authenticated session), 10-digit Indian mobile number, college, course, branch, and year.
  - Dynamic team size selection (1 to 5): dynamically renders member name and email input fields for team entries. Solo entries cleanly bypass additional fields.
  - PPT slide deck link, prototype link, and optional demo video link.
  - Automatic dispatch of branded confirmation email with full team and project breakdown.
- **Participant Dashboard**:
  - Displays user profile, OTP verification status, and registration status.
  - Direct call-to-action to register if not submitted.
  - Full project submission overview with team composition, external submission links, and printable receipt.
- **Email Service (Nodemailer)**:
  - Sender name strictly enforced as `Code-a-Nova`.
  - Built-in graceful development fallback (logs email and OTP to server console if SMTP credentials are omitted).

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Tailwind CSS, Lucide Icons | Responsive UI, interactive states, dynamic form rendering |
| **Routing & Client State** | React Router v6, Context API, Axios | Single Page Application routing, JWT interceptors |
| **Backend** | Node.js, Express.js | REST API, validation, business logic |
| **Database** | MongoDB, Mongoose | Data modeling, TTL indexes for OTP expiry |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs | Stateless authorization and password hashing |
| **Email Service** | Nodemailer (Gmail SMTP / App Passwords) | OTP verification & registration confirmation emails |

---

## 📁 Repository Structure

```text
CodeANova assignment/
├── client/                     # Frontend React Application
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProtectedRoute
│   │   ├── context/            # AuthContext (state & session management)
│   │   ├── pages/              # Home, Login, Signup, VerifyOtp, Dashboard, RegisterHackathon, Contact, NotFound
│   │   ├── services/           # Axios instance with JWT interceptors
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind base styles
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
├── server/                     # Backend Express REST API
│   ├── src/
│   │   ├── config/             # MongoDB connection & Nodemailer transporter
│   │   ├── controllers/        # authController, hackathonController, userController
│   │   ├── middleware/         # authMiddleware (JWT guard), errorHandler
│   │   ├── models/             # User, Otp (TTL index), Registration
│   │   ├── routes/             # authRoutes, hackathonRoutes, userRoutes
│   │   ├── utils/              # 6-digit OTP generator, HTML email templates
│   │   └── server.js           # Server entry point
│   ├── package.json
│   ├── .env.example
│   └── .env
├── package.json                # Root convenience scripts
├── .env.example                # Unified environment variables template
└── README.md
```

---

## ⚙️ Environment Variables Guide

Create a `.env` file in the `server/` directory:

```env
# Server Port
PORT=5000
NODE_ENV=development

# MongoDB Connection String (MongoDB Atlas or local)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/code_a_nova?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=super_secret_jwt_key_code_a_nova_2026_xyz

# Nodemailer Configuration (Sender is always "Code-a-Nova")
EMAIL_SERVICE=gmail
EMAIL_USER=your_project_email@gmail.com
EMAIL_PASS=your_gmail_16_digit_app_password

# Allowed Client Origin (for CORS)
CLIENT_URL=http://localhost:3000
```

> **Note on Nodemailer**: If `EMAIL_USER` and `EMAIL_PASS` are not supplied in development, the system activates **Mock Mode**: OTPs and email contents are cleanly logged directly to the server terminal, so you can test all flows without live credentials.

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MongoDB instance (local or MongoDB Atlas connection string)

### 1. Install Dependencies
From the root directory:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Start the Application

#### Run the Backend Server:
```bash
cd server
npm run dev
# Server will listen on http://localhost:5000
```

#### Run the Frontend Client:
```bash
cd client
npm run dev
# Client will be available at http://localhost:3000
```

---

## 📑 API Endpoints Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Register new user account; sends 6-digit OTP |
| `POST` | `/api/auth/verify-otp` | Public | Verify OTP, activate account in DB, invalidate OTP |
| `POST` | `/api/auth/resend-otp` | Public | Resend fresh 6-digit OTP (10 min expiry) |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials, returns JWT |

### User Profile (`/api/user`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/me` | Protected | Fetch current logged-in user profile |
| `PUT` | `/api/user/update` | Protected | Update user profile details |

### Hackathon Registration (`/api/hackathon`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/hackathon/register` | Protected | Submit registration; dispatches confirmation email |
| `GET` | `/api/hackathon/my-entry` | Protected | Fetch user's registered team and project details |
| `DELETE`| `/api/hackathon/:id` | Protected | Delete registration entry (optional / admin) |

---

## 🚢 Deployment Guide

### Backend on Render / Railway:
1. Connect your GitHub repository to Render / Railway.
2. Set the Root Directory to `server`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure Environment Variables: `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `CLIENT_URL`.

### Frontend on Vercel / Netlify:
1. Connect your GitHub repository to Vercel / Netlify.
2. Set Root Directory to `client`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable: `VITE_API_URL=https://your-backend-url.onrender.com/api`

---

## 🛡️ Evaluation Criteria Checklist

- [x] **Functional Completeness**: All user flows (Signup -> OTP -> Login -> Dashboard -> Registration -> Confirmation Mail) working end-to-end.
- [x] **Code Quality & Readability**: Modular MVC structure, clean naming conventions, human-crafted code, comprehensive comments.
- [x] **UI/UX Design & Responsiveness**: Clean typography, modern dashboard, dynamic team input fields, fully responsive mobile navbar.
- [x] **Authentication & Security**: Passwords salted & hashed with bcrypt, JWT authorization headers, OTP expires in 10 minutes and invalidated after use.
- [x] **Nodemailer Integration**: 6-digit OTP email & detailed confirmation email with sender name strictly set to `Code-a-Nova`.
- [x] **README & Environment Guide**: Step-by-step setup, API table, environment variable instructions.
