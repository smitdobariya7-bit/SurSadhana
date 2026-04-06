# SurSadhana - Full Stack Music Learning Platform

A comprehensive platform for learning Hindustani classical music with AI-powered guidance, practice tracking, and community features.

## Features

- **User Authentication & Profiles**: Secure user registration and login with JWT
- **Practice Tracking**: Log and analyze your riyaz sessions
- **AI Music Guru**: Get personalized guidance from AI
- **Raag Library**: Explore and learn different raags
- **Progress Analytics**: Track your musical journey
- **Subscription Management**: Premium features with Stripe integration
- **Audio Recording**: Record and analyze your practice sessions

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Radix UI components

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd sursadhana
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/sursadhana

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI API Key (for AI Guru features)
OPENAI_API_KEY=your-openai-api-key
VITE_OPENAI_API_KEY=your-openai-api-key

# Stripe (for payments - optional)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Email Configuration (for notifications - optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### 3. Database Setup

#### Option A: MongoDB Atlas (Recommended for Development)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new project and cluster (free tier is sufficient)
3. Set up database access:
   - Go to "Database Access" → "Add New Database User"
   - Create a user with read/write permissions
4. Set up network access:
   - Go to "Network Access" → "Add IP Address"
   - Add `0.0.0.0/0` for development (restrict in production)
5. Get your connection string:
   - Go to "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string
6. Update your `.env` file:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/sursadhana?retryWrites=true&w=majority
   ```

#### Option B: Local MongoDB
1. Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - Windows: `net start MongoDB`
   - macOS: `brew services start mongodb/brew/mongodb-community`
   - Linux: `sudo systemctl start mongod`
3. The app will connect using `mongodb://localhost:27017/sursadhana`

**Note**: If you don't set up a database initially, the app will still run but authentication features won't work until you connect to a database.

### 4. Running the Application

#### Development Mode (Frontend + Backend)
```bash
npm run dev:full
```
This runs both the backend server (port 5000) and frontend (port 3000) concurrently.

#### Production Mode
```bash
# Build frontend
npm run build

# Start backend server
npm run server
```

#### Individual Services
```bash
# Frontend only
npm run dev

# Backend only
npm run server
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update user preferences
- `GET /api/users/stats` - Get user statistics

### Practice Sessions
- `GET /api/practice/sessions` - Get practice sessions
- `POST /api/practice/sessions` - Create practice session
- `GET /api/practice/sessions/:id` - Get specific session
- `PUT /api/practice/sessions/:id` - Update session
- `DELETE /api/practice/sessions/:id` - Delete session
- `GET /api/practice/stats` - Get practice statistics

### Subscription
- `GET /api/subscription/status` - Get subscription status
- `POST /api/subscription/upgrade` - Upgrade subscription
- `POST /api/subscription/cancel` - Cancel subscription
- `GET /api/subscription/plans` - Get available plans

## Project Structure

```
sursadhana/
├── server/                 # Backend code
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── server.js          # Express server
├── src/                   # Frontend code
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── ...
├── public/               # Static assets
├── package.json          # Dependencies
├── .env                  # Environment variables
└── README.md            # This file
```

## Features in Detail

### User Management
- Secure registration and login
- Profile management with preferences
- Practice statistics tracking
- Subscription management

### Practice Tracking
- Log practice sessions with duration and notes
- Categorize by type (riyaz, raag practice, etc.)
- Track progress and streaks
- View detailed statistics

### AI Integration
- OpenAI-powered music guru for guidance
- Personalized practice recommendations
- Music theory explanations

### Subscription System
- Free, Premium, and Pro tiers
- Stripe payment integration (ready for implementation)
- Feature access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub or contact the development team.
