# House Rent Application

A complete House Rent application developed using a React (Vite) frontend and an Express (SQLite) backend. Features include secure authentication, property listings, bookings, and an Admin dashboard.

## Project Structure
- **`/client`**: React frontend running on Vite, styled with custom CSS and Lucide React icons. Interacts with the backend automatically via Axios on Port 5001.
- **`/server`**: Node.js/Express backend functioning on Port 5001 with robust SQLite database logic handled by Sequelize ORM.

## Prerequisites
- **Node.js**: v18+ is recommended
- **npm**: v8+ is recommended

## Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "house rent"
```

### 2. Install Dependencies
To prevent React and Vite peer-dependency conflicts, use the `--legacy-peer-deps` flag when installing the client and server.

**Install Root Dependencies:**
```bash
# In the root "house rent" folder
npm install
```

**Install Server Dependencies:**
```bash
cd server
npm install --legacy-peer-deps
cd ..
```

**Install Client Dependencies:**
```bash
cd client
npm install --legacy-peer-deps
cd ..
```

### 3. Environment Setup (Backend)
Navigate into the `server` directory and create a `.env` file to hold your sensitive local variables:
```bash
cd server
# Create a .env file with the following content:
PORT=5001
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 4. Running the Application
Go back to the root project folder (where this README is located) and start both the backend and frontend simultaneously using the concurrently script:
```bash
npm run dev
```

- The **Frontend** will be available at [http://localhost:5173](http://localhost:5173)
- The **Backend API** will be running at `http://localhost:5001`
*(Note: A local SQLite database file named `database.sqlite` will be automatically generated inside the `/server` folder upon the first successful run. This file is ignored from git commits so that your test data stays local).*

## Usage Guide (Admin & Regular Users)
The application handles two sets of user roles securely.

1. Open the frontend running at `http://localhost:5173/register`.
2. Fill out your details. To gain access to creating new property listings, be sure to select **"Admin"** from the "Register As" dropdown.
3. Log in to access the **Admin Panel** under the Dashboard route (`/dashboard`), where you can add new properties and inspect all platform bookings.
4. Regular users (selecting **"User"**) can browse properties, log in safely, and view only their personal reservations under their individual Accounts.
