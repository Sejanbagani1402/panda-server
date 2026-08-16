# User & Onboarding Module

This module provides comprehensive user profile management, onboarding workflows, and preference management.

## Features

- **User Profile Management**: CRUD operations for user profiles
- **Onboarding System**: Complete onboarding workflow with status tracking
- **Preferences Management**: Full CRUD operations for user preferences
- **Profile Image Support**: Profile picture management
- **Flexible Preferences**: JSON-based preference storage

## Database Schema

### User Model Updates
```prisma
model User {
  id            String    @id @default(cuid())
  firebaseUid   String?   @unique
  email         String    @unique
  password      String?
  name          String?
  profileImage  String?
  authProvider  AuthProvider @default(LOCAL)
  preferences   Json?     @default("{}")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  isOnboarded   Boolean?  @default(false)

  goals         Goal[]
  reflections   Reflection[]
}
```

## API Endpoints

### User Profile Endpoints

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "profileImage": "https://example.com/image.jpg",
  "isOnboarded": true,
  "preferences": { "theme": "dark", "notifications": true },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Updated Name",
  "profileImage": "https://example.com/new-image.jpg"
}
```

### Onboarding Endpoints

#### Get Onboarding Status
```http
GET /onboarding/status
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "isOnboarded": false,
  "canSkip": true
}
```

#### Complete Onboarding
```http
POST /onboarding/complete
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "John Doe",
  "profileImage": "https://example.com/image.jpg",
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "language": "en"
  }
}
```

#### Skip Onboarding
```http
POST /onboarding/skip
Authorization: Bearer <jwt-token>
```

### Preferences Endpoints

#### Get Preferences
```http
GET /users/preferences
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "theme": "dark",
  "notifications": true,
  "language": "en"
}
```

#### Update Preferences (Replace)
```http
PUT /users/preferences
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "preferences": {
    "theme": "light",
    "fontSize": 14
  }
}
```

#### Update Preferences (Merge)
```http
PATCH /users/preferences
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "preferences": {
    "fontSize": 16
  }
}
```

#### Reset Preferences
```http
DELETE /users/preferences
Authorization: Bearer <jwt-token>
```

## Usage Examples

### Complete Onboarding Flow

1. **Check onboarding status:**
```bash
curl -X GET http://localhost:3000/onboarding/status \
  -H "Authorization: Bearer <jwt-token>"
```

2. **Complete onboarding:**
```bash
curl -X POST http://localhost:3000/onboarding/complete \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "profileImage": "https://example.com/avatar.jpg",
    "preferences": {
      "theme": "dark",
      "notifications": true
    }
  }'
```

3. **Verify completion:**
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <jwt-token>"
```

### Preference Management

1. **Update specific preference:**
```bash
curl -X PATCH http://localhost:3000/users/preferences \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "theme": "light"
    }
  }'
```

2. **Replace all preferences:**
```bash
curl -X PUT http://localhost:3000/users/preferences \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "theme": "dark",
      "language": "es",
      "fontSize": 18
    }
  }'
```

3. **Reset to defaults:**
```bash
curl -X DELETE http://localhost:3000/users/preferences \
  -H "Authorization: Bearer <jwt-token>"
```

## Data Transfer Objects (DTOs)

### UpdateProfileDto
```typescript
{
  name?: string;
  profileImage?: string;
}
```

### CompleteOnboardingDto
```typescript
{
  name: string;
  profileImage?: string;
  preferences?: Record<string, any>;
}
```

### UpdatePreferencesDto
```typescript
{
  preferences?: Record<string, any>;
}
```

## Preference Structure

Preferences are stored as JSON in the database, allowing for flexible and extensible user settings:

### Common Preference Keys
- `theme`: "light" | "dark" | "auto"
- `language`: "en" | "es" | "fr" | etc.
- `notifications`: boolean
- `fontSize`: number
- `timezone`: string
- `dateFormat`: string

### Custom Preferences
You can add any custom preferences as needed:
```json
{
  "theme": "dark",
  "customSetting": "value",
  "arrayPreference": [1, 2, 3],
  "nestedObject": {
    "key": "value"
  }
}
```

## Security

- All endpoints are protected with JWT authentication
- User data is isolated by user ID
- Profile images are stored as URLs (not actual files)
- Preferences are validated as JSON objects

## Integration with Other Modules

- **Auth Module**: Provides JWT authentication for all endpoints
- **Goals Module**: Can access user preferences for goal recommendations
- **Reflections Module**: Can use user preferences for reflection prompts
- **AI Module**: Can leverage preferences for personalized AI responses

## Error Handling

Common error responses:

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "name must be a string"
    }
  ]
}
```

## Best Practices

1. **Onboarding Flow**: Always check onboarding status before forcing onboarding
2. **Preference Updates**: Use PATCH for partial updates, PUT for complete replacement
3. **Profile Images**: Store images in a CDN and save URLs in the database
4. **Preference Defaults**: Set sensible defaults in the frontend application
5. **User Experience**: Provide clear feedback during onboarding completion

## Development

Run the development server:
```bash
pnpm run start:dev
```

Test the endpoints using the examples above or tools like Postman/Insomnia.
