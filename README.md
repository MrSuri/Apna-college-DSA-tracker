## DSA Sheet Web Application (Microservices MERN)

This project is a microservices-based DSA Sheet web application built with **React** and **Node.js/Express** on **MongoDB**.  
It is designed to run on a single **AWS EC2** instance with separate frontend and backend ports, while keeping the backend split into small services.

### Services

- **API Gateway** (`backend/api-gateway`) – Single entry point for the frontend.  
  Routes requests to internal services and handles **JWT verification** and **basic rate limiting**.
- **Auth Service** (`backend/auth-service`) – Email/password signup and login, **JWT** issuance.
- **Content Service** (`backend/content-service`) – DSA topics/chapters and problems with links and difficulty levels.
- **Progress Service** (`backend/progress-service`) – Per-user **problem completion tracking**.
- **Frontend** (`frontend`) – React SPA (Vite) for login and DSA sheet UI.

### Implemented Features

- **Login Page**
  - Email/password signup and login for students.
  - JWT-based authentication (token stored in `localStorage` on the client).
- **Topic-wise DSA Sheet**
  - Topics/chapters (e.g., Arrays, Linked Lists) with ordered problems.
  - Subtopics / problems under each topic, e.g., Problem 1, Problem 2, etc.
- **Per-Problem Details**
  - YouTube tutorial link.
  - LeetCode / Codeforces practice link.
  - Article link for theory.
  - Difficulty indicator: **Easy / Medium / Tough**.
- **Progress Tracker**
  - Checkbox for each problem.
  - Progress saved per user in MongoDB via the progress service.
  - On the next login, user resumes from where they left off.

### Environment Variables

For a simple setup you can use the same MongoDB URI and JWT secret across services.
Create a `.env` file in each backend service directory (`backend/api-gateway`, `backend/auth-service`, `backend/content-service`, `backend/progress-service`) with values like:

#### Common example values

- In `backend/api-gateway/.env`:
  - `PORT=5000`
  - `JWT_SECRET=change_this_in_production`
  - `AUTH_SERVICE_URL=http://localhost:5001`
  - `CONTENT_SERVICE_URL=http://localhost:5002`
  - `PROGRESS_SERVICE_URL=http://localhost:5003`

- In `backend/auth-service/.env`:
  - `AUTH_PORT=5001`
  - `MONGO_URI=mongodb://localhost:27017/dsa_sheet_auth`
  - `JWT_SECRET=change_this_in_production`

- In `backend/content-service/.env`:
  - `CONTENT_PORT=5002`
  - `MONGO_URI=mongodb://localhost:27017/dsa_sheet_content`

- In `backend/progress-service/.env`:
  - `PROGRESS_PORT=5003`
  - `MONGO_URI=mongodb://localhost:27017/dsa_sheet_progress`

- In `frontend/.env` (optional, for non-default backend URL):
  - `VITE_API_BASE_URL=http://localhost:5000/api`

For AWS/Atlas, replace `mongodb://localhost:...` with your MongoDB connection string.

### Running Locally

1. **Prerequisites**
   - Node.js LTS installed.
   - MongoDB running locally, or a MongoDB Atlas URI.

2. **Install root tool dependency**
   - From the project root:
     - `npm install`

3. **Install backend service dependencies**
   - `cd backend/api-gateway && npm install`
   - `cd ../auth-service && npm install`
   - `cd ../content-service && npm install`
   - `cd ../progress-service && npm install`

4. **Install frontend dependencies**
   - `cd ../../frontend && npm install`

5. **Seed sample DSA content (optional but recommended)**
   - `cd ../backend/content-service`
   - `npm run seed`

6. **Start the backend (all services)**
   - From the project root:
     - `npm run start:backend`
   - This starts:
     - API gateway on `http://localhost:5000`
     - Auth service on `http://localhost:5001`
     - Content service on `http://localhost:5002`
     - Progress service on `http://localhost:5003`

7. **Start the frontend**
   - From the project root:
     - `npm run start:frontend`
   - The React app (Vite dev server) runs on `http://localhost:5173`.

8. **Use the app**
   - Open `http://localhost:5173` in a browser.
   - Register a new account, log in, and access the DSA sheet.
   - Mark problems as completed; your progress will persist across logins.

### Deploying on AWS EC2 (High-Level)

1. **Provision an EC2 instance**
   - Use an Ubuntu or Amazon Linux AMI.
   - Open security group ports for:
     - Backend gateway port (e.g., 5000).
     - Frontend port (e.g., 80 via Nginx, or 5173 for direct Vite/Node).

2. **Install runtime dependencies on EC2**
   - Install Node.js LTS.
   - Install MongoDB (if self-hosting) or use MongoDB Atlas and allow EC2’s IP.

3. **Clone the repository and build**
   - `git clone <your-repo-url>`
   - `cd apna-college-task`
   - Follow the same **install** steps as local.
   - For the frontend, build static assets:
     - `cd frontend && npm run build`

4. **Serve frontend**
   - Option A (simple): run Vite preview or `npm start` and expose that port.
   - Option B (recommended): serve `frontend/dist` via Nginx or Apache on port 80.

5. **Run backend services as daemons**
   - Use a process manager such as **pm2** or systemd units:
     - `pm2 start backend/api-gateway/index.js`
     - `pm2 start backend/auth-service/index.js`
     - `pm2 start backend/content-service/index.js`
     - `pm2 start backend/progress-service/index.js`
   - Ensure your `.env` files are present on the EC2 instance with production values.

6. **Point frontend to API gateway**
   - In production, set `VITE_API_BASE_URL` (or equivalent) to your EC2 public DNS or domain, e.g.:
     - `VITE_API_BASE_URL=https://your-domain.com/api`
   - Rebuild the frontend (`npm run build`) after changing this.

This setup keeps the codebase **microservice-oriented** while still being straightforward to run on a single EC2 instance with separate frontend and backend ports.



