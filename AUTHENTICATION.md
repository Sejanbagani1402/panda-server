# Authentication System

This application implements a comprehensive authentication system with both JWT-based authentication and Firebase OAuth integration.

## Features

- **JWT Authentication**: Secure token-based authentication with refresh capabilities
- **Password Hashing**: Bcrypt for secure password storage
- **Firebase OAuth**: Google authentication via Firebase
- **Protected Routes**: Guards for securing endpoints
- **Public Routes**: Decorator for marking public endpoints

## Setup

### Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# JWT Configuration
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"

# Firebase Configuration
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="your-firebase-service-account@your-project-id.iam.gserviceaccount.com"

# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN="*"
```

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Google Authentication in Firebase Console
3. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file and extract the required fields
4. Add the Firebase configuration to your `.env` file

## API Endpoints

### Public Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Firebase OAuth
```http
POST /auth/firebase
Content-Type: application/json

{
  "idToken": "firebase-id-token-here"
}
```

### Protected Endpoints

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <jwt-token>
```

#### User Profile
```http
GET /users/profile
Authorization: Bearer <jwt-token>
```

## Usage Examples

### JWT Authentication

1. **Register a new user**:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

2. **Login**:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

3. **Access protected route**:
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Firebase OAuth

1. **Client-side**: Use Firebase SDK to get ID token
```javascript
const result = await signInWithPopup(auth, googleProvider);
const idToken = await result.user.getIdToken();
```

2. **Server-side**: Exchange ID token for JWT
```bash
curl -X POST http://localhost:3000/auth/firebase \
  -H "Content-Type: application/json" \
  -d '{"idToken":"<firebase-id-token>"}'
```

## Guards and Decorators

### @Public() Decorator
Mark endpoints as public (no authentication required):
```typescript
@Public()
@Post('register')
async register(@Body() registerDto: RegisterDto) {
  return this.authService.register(registerDto);
}
```

### JwtAuthGuard
Protect endpoints with JWT authentication:
```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@Request() req) {
  return this.authService.validateUser(req.user.userId);
}
```

### FirebaseAuthGuard
Protect endpoints with Firebase authentication:
```typescript
@Public()
@UseGuards(FirebaseAuthGuard)
@Post('firebase')
async firebaseAuth(@Request() req) {
  // req.user contains userId and email
}
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt (10 rounds)
- **JWT Validation**: Tokens are validated using JWT strategy
- **Firebase Token Verification**: Firebase ID tokens are verified server-side
- **CORS Configuration**: Configurable CORS for frontend integration
- **Input Validation**: DTOs with class-validator for request validation

## Database Schema

The authentication system uses the following database models:

- **User**: Stores user credentials and profile information
- **Relations**: User has relationships with Goals, Reflections, etc.

## Development

Run the development server:
```bash
pnpm run start:dev
```

## Testing

Test the authentication endpoints using the provided examples or tools like Postman/Insomnia.
