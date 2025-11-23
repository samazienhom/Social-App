# Social App - Backend API

A comprehensive Node.js/Express-based social networking application with real-time chat, friend management, posts, comments, and advanced authentication features.

## 📋 Project Overview

This is a full-featured social media backend built with TypeScript, Express, and MongoDB. It supports user authentication, friend requests, posts with comments/replies, real-time messaging via WebSockets, and email notifications. The application follows a modular architecture with repository patterns for clean data access and separation of concerns.

## 🏗️ Architecture

```
src/
├── bootstrap.ts           # Application initialization
├── index.ts              # Entry point
├── DB/                   # Database layer
│   ├── config/          # MongoDB connection setup
│   │   └── connectDb.ts
│   ├── models/          # Mongoose schemas
│   │   ├── chat.model.ts
│   │   ├── comment.model.ts
│   │   ├── friend.request.ts
│   │   ├── post.model.ts
│   │   ├── reply.model.ts
│   │   └── user.model.ts
│   ├── Repos/           # Repository pattern implementations
│   │   ├── chat.repo.ts
│   │   ├── comment.repo.ts
│   │   ├── friend.request.repo.ts
│   │   ├── post.repo.ts
│   │   ├── reply.repo.ts
│   │   └── user.repo.ts
│   └── DBRepo.ts        # Base repository class
├── middleware/          # Express middleware
│   ├── auth.middleware.ts        # JWT authentication
│   └── validation.middleware.ts  # Zod schema validation
├── modules/             # Feature modules (MVC-like structure)
│   ├── authModule/      # Authentication & authorization
│   │   ├── auth.controller.ts
│   │   ├── auth.DTO.ts
│   │   ├── auth.services.ts
│   │   └── auth.validation.ts
│   ├── userModule/      # User management
│   │   ├── user.controller.ts
│   │   ├── user.services.ts
│   │   └── user.types.ts
│   ├── postModule/      # Posts functionality
│   │   ├── post.controller.ts
│   │   └── post.services.ts
│   ├── commentModule/   # Comments & replies
│   │   ├── comment.controller.ts
│   │   └── comment.services.ts
│   ├── chatModule/      # Real-time messaging
│   │   ├── chat.controller.ts
│   │   ├── chat.events.ts
│   │   ├── chat.gateway.ts
│   │   ├── chat.services.ts
│   │   └── chat.socket.services.ts
│   ├── gateway/         # WebSocket gateway management
│   │   └── gateway.ts
│   └── routes.ts        # Route aggregator
└── utils/               # Utility modules
    ├── successHandler.ts        # Success response formatter
    ├── security/                # Authentication utilities
    │   ├── hash.ts             # Bcrypt hashing
    │   └── token.ts            # JWT token management
    ├── multer/                 # File upload configuration
    │   ├── multer.ts
    │   ├── s3.cofig.ts
    │   └── s3.services.ts
    ├── email/                  # Email notification system
    │   ├── createOtp.ts
    │   ├── email.events.ts
    │   ├── otp.tamplate.ts
    │   ├── send.email.ts
    │   └── tag_tamplate.ts
    └── errors/                 # Error handling
        ├── error.types.ts
        └── errors.exceptions.ts
```

## 🛠️ Technologies & Dependencies

### Core Framework
- **Express.js** (v5.1.0) - Web framework for Node.js
- **TypeScript** - Type-safe JavaScript development
- **Node.js** - JavaScript runtime environment

### Database & ODM
- **MongoDB** - NoSQL document database
- **Mongoose** (v8.19.2) - MongoDB ODM (Object Data Modeling)

### Authentication & Security
- **JWT (jsonwebtoken)** (v9.0.2) - JSON Web Tokens for stateless authentication
- **bcrypt** (v6.0.0) - Password hashing with salt
- **CORS** (v2.8.5) - Cross-origin resource sharing middleware

### Real-time Communication
- **Socket.IO** (v4.8.1) - WebSocket library for real-time bidirectional communication
- **@types/socket.io** (v3.0.1) - TypeScript types for Socket.IO

### File Management
- **AWS SDK S3** (v3.920.0) - AWS S3 client for cloud storage
- **@aws-sdk/lib-storage** (v3.920.0) - AWS S3 upload utilities
- **Multer** (v2.0.2) - Middleware for file upload handling

### Email Services
- **Nodemailer** (v7.0.10) - Email sending library with SMTP support

### Data Validation
- **Zod** (v4.1.12) - TypeScript-first schema validation

### Utilities
- **nanoid** (v5.1.6) - Tiny, secure URL-friendly unique string ID generator
- **concurrently** (v9.2.1) - Run multiple commands concurrently (development)

## 📦 Key Features

### Authentication Module
- User registration with email verification
- Login with optional 2-step verification (OTP)
- JWT-based access & refresh tokens
- Password reset with OTP flow
- Email confirmation workflow
- Account deletion with data cleanup

### User Management
- Profile image upload to AWS S3
- Friend request system (send, accept, reject, cancel)
- Unfriend functionality
- User blocking system
- Profile viewing
- User discovery

### Posts & Content
- Create, update, delete posts
- Like/unlike posts functionality
- Comments on posts
- Nested replies to comments
- Post freezing (moderation feature)
- Tag users in posts with email notifications
- Share posts

### Real-time Chat
- Direct messaging between users
- Group chat creation and management
- Real-time message delivery via WebSockets
- Socket.IO connection management
- Online status tracking
- Message history retrieval

### Email Notification System
- Event-driven email architecture
- OTP email templates
- Password reset emails
- User tagging notifications
- 2-step verification emails
- Customizable email templates

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas cloud)
- **AWS S3** account with credentials
- **Gmail account** (for email notifications via SMTP)

### Step 1: Clone & Install Dependencies

```bash
# Navigate to project directory
cd "e:\sama\Node js\Social App"

# Install all dependencies
npm install
```

### Step 2: Environment Variables

Create a `.env` file in the root directory with the following configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
LOCAL_DB_URI=
# For MongoDB Atlas cloud:
# LOCAL_DB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-app?retryWrites=true&w=majority

# JWT Authentication Secrets
ACCESS_SECRET=your_super_secret_access_token_key_min_32_chars
REFRESH_SECRET=your_super_secret_refresh_token_key_min_32_chars
BEARER=Bearer

# AWS S3 Configuration
REGION=us-east-1
ACCESS_KEY_ID=your_aws_access_key_id
SECRET_ACCESS_KEY=your_aws_secret_access_key
BUCKET=your-s3-bucket-name
APPLICATION_NAME=social-app

# Email Configuration (Gmail SMTP)
HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
# Generate app password at: https://myaccount.google.com/apppasswords
```

### Step 3: Build TypeScript

```bash
# Compile TypeScript to JavaScript
npx tsc
```

### Step 4: Run the Application

**Development Mode** (with auto-reload):
```bash
npm start
```

This runs TypeScript compiler in watch mode and automatically restarts the server on file changes.

**Manual Development**:
```bash
# Terminal 1: Watch TypeScript compilation
npx tsc --watch

# Terminal 2: Run with auto-reload
node --env-file=.env --watch ./dist/index.js
```

**Production Mode**:
```bash
# Compile once
npx tsc

# Run compiled code
node --env-file=.env ./dist/index.js
```

The server will start on the configured PORT (default: 5000).

## 📡 API Endpoints

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user account |
| PATCH | `/confirm-email` | Verify email with OTP |
| PATCH | `/resend-otp` | Resend verification OTP |
| POST | `/login` | User login (returns access token) |
| PATCH | `/confirm-login` | Confirm login with 2FA code |
| POST | `/refresh-token` | Get new access token using refresh token |
| GET | `/me` | Get authenticated user profile |
| PATCH | `/two-step-verification` | Enable 2FA on account |
| PATCH | `/confirm-two-step-verification` | Verify and confirm 2FA setup |
| PATCH | `/forget-pass` | Initiate password reset (sends OTP) |
| PATCH | `/reset-pass` | Complete password reset with new password |

### User Routes (`/api/v1/user`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/profile-image` | Upload/update profile picture (multipart/form-data) |
| PATCH | `/send-friend-request` | Send friend request to another user |
| PATCH | `/accept-friend-request/:id` | Accept incoming friend request |
| PATCH | `/unfriend` | Remove friend from connections |
| PATCH | `/block` | Block a user |
| DELETE | `/delete-account/:userId` | Permanently delete user account |
| DELETE | `/delete-friend-request/:id` | Cancel outgoing friend request |

### Post Routes (`/api/v1/post`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-post` | Create new post |
| PATCH | `/freeze-post/:id` | Freeze post (prevent comments) |
| DELETE | `/delete-post/:id` | Delete post permanently |
| PATCH | `/update-post/:id` | Update post content |
| GET | `/get-post-by-id/:id` | Retrieve single post |
| PATCH | `/like-unlike-post/:id` | Toggle like on post |
| PATCH | `/like-post/:id` | Like a post |
| PATCH | `/unlike-post/:id` | Unlike a post |
| POST | `/tag` | Tag user in post (sends email notification) |

### Comment Routes (`/api/v1/comment`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-comment` | Add comment to post |
| PATCH | `/freeze-comment/:id` | Freeze comment (prevent replies) |
| DELETE | `/delete-comment/:id` | Delete comment |
| PATCH | `/update-comment/:id` | Update comment content |
| GET | `/get-comment-by-id/:id` | Get single comment details |
| POST | `/create-reply` | Reply to a comment |
| GET | `/comment-with-replies/:id` | Get comment with all nested replies |

### Chat Routes (`/api/v1/chat`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get or create direct chat session |
| POST | `/create-group` | Create new group chat |
| GET | `/get-group-chat/:groupId` | Retrieve group chat messages |

### WebSocket Events (Socket.IO)

**Client → Server Events:**
- `sendMessage` - Send direct message
- `sendGroupMessage` - Send message to group chat
- `join_room` - Join group chat room
- `disconnect` - Clean disconnect

**Server → Client Events:**
- `newMessage` - Receive new direct message
- `newGroupMessage` - Receive new group message
- `successMessage` - Message delivery confirmation
- `connectedSockets` - Update of connected users

## 🔐 Security Features

- **JWT Authentication** - Stateless token-based authentication with access/refresh token rotation
- **Password Hashing** - bcrypt with configurable salt rounds (10 rounds default)
- **Email Verification** - Multi-step email confirmation before account activation
- **OTP System** - 6-digit One-Time Passwords with 30-60 second expiry
- **2-Step Login Verification** - Optional second factor for enhanced security
- **Input Validation** - Zod schema validation for all API inputs
- **CORS Protection** - Configured CORS middleware for safe cross-origin requests
- **Secure File Storage** - AWS S3 with ACL controls and secure upload
- **JWT Secret Rotation** - Support for access and refresh token refresh

## 🗄️ Database Models

### User Model
```
- Email, password (hashed)
- Profile (name, age, phone number, bio)
- Profile image URL (S3)
- Friends list (array of user IDs)
- Posts (array of post IDs)
- Blocked users list
- OTP verification (token, expiry)
- 2FA settings (enabled, secret)
- Timestamps (createdAt, updatedAt)
```

### Post Model
```
- Creator (user ID)
- Content (text)
- Likes (array of user IDs)
- Comments (array of comment IDs)
- Shared count
- Frozen status (moderation)
- Timestamps (createdAt, updatedAt)
```

### Comment Model
```
- Creator (user ID)
- Content (text)
- Associated post
- Replies (array of reply IDs)
- Likes (array of user IDs)
- Frozen status
- Timestamps (createdAt, updatedAt)
```

### Reply Model
```
- Creator (user ID)
- Content (text)
- Associated comment
- Likes (array of user IDs)
- Timestamps (createdAt, updatedAt)
```

### Chat Model
```
- Participants (user IDs)
- Messages (array with creator, content, timestamp)
- Is Group (boolean)
- Group metadata (name, image, roomId)
- Last message info
- Timestamps (createdAt, updatedAt)
```

### Friend Request Model
```
- From user (sender)
- To user (receiver)
- Status (pending, accepted, rejected)
- Timestamps (createdAt, acceptedAt)
```

## 📧 Email System

The application uses an event-driven email architecture with Nodemailer:

**Email Events:**
- `VERIFY_EMAIL` - Account verification on signup
- `RESET_PASSWORD` - Password reset request
- `TWO_STEP_VERIFICATION` - 2FA OTP code
- `TAG` - User mention in posts/comments

**Email Features:**
- HTML templates for formatted emails
- Customizable OTP templates
- Tag notification templates
- Automatic retry logic
- Gmail SMTP integration

## 🔄 Authentication Flow

### Registration
1. User signs up with email and password
2. OTP sent to email
3. User verifies OTP
4. Account activated
5. JWT tokens issued

### Login
1. User enters credentials
2. If 2FA enabled, OTP sent to email
3. User confirms 2FA code
4. Access and refresh tokens issued

### Token Refresh
1. Client sends refresh token
2. Server validates refresh token
3. New access token issued
4. Refresh token rotated (optional)

## 💾 Data Persistence

- **MongoDB** for document storage
- Connection via Mongoose ODM
- Support for both local MongoDB and MongoDB Atlas
- Automatic indexing for frequently queried fields
- Cascading deletes for data integrity

## 🚢 Deployment Considerations

- Set `NODE_ENV=production` for production builds
- Use strong, randomly generated JWT secrets
- Configure MongoDB Atlas for cloud deployment
- Set up AWS S3 bucket policies for file access
- Use environment-specific SMTP credentials
- Enable HTTPS in production
- Configure CORS with specific allowed origins
- Set up proper error logging and monitoring

## 📝 Development Guidelines

- Follow the modular architecture pattern
- Use the Repository pattern for data access
- Validate all inputs with Zod schemas
- Implement proper error handling
- Add TypeScript types for all function parameters
- Use middleware for cross-cutting concerns
- Document complex business logic

## 🤝 Contributing

When contributing to this project:
1. Follow TypeScript strict mode guidelines
2. Maintain the repository pattern for data access
3. Add input validation for new endpoints
4. Update this README with new features
5. Test authentication flows thoroughly

## 📄 License

ISC

---

**Project Repository:** [Social-App](https://github.com/samazienhom/Social-App)  
**Last Updated:** November 2025
