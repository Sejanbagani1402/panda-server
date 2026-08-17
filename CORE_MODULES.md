# Core Modules Documentation

This documentation covers the Goals, Milestones, and Actions modules that form the core functionality of the Panda application.

## Table of Contents
- [Goals Module](#goals-module)
- [Milestones Module](#milestones-module)
- [Actions Module](#actions-module)
- [Common Features](#common-features)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)

---

## Goals Module

The Goals module provides comprehensive goal management with CRUD operations, status tracking, and statistics.

### Database Schema
```prisma
model Goal {
  id          String       @id @default(cuid())
  title       String
  description String?
  targetDate  DateTime?
  status      String       @default("active") // active, completed, paused
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  milestones  Milestone[]
  actions     Action[]
}
```

### API Endpoints

#### Create Goal
```http
POST /goals
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Learn TypeScript",
  "description": "Master TypeScript fundamentals",
  "targetDate": "2024-12-31T23:59:59Z",
  "status": "active"
}
```

#### Get All Goals
```http
GET /goals?status=active&search=learn&page=1&limit=10
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `status`: Filter by status (active, completed, paused)
- `search`: Search in title and description
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### Get Goal Statistics
```http
GET /goals/statistics
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "total": 15,
  "active": 8,
  "completed": 5,
  "paused": 2,
  "completionRate": 33
}
```

#### Get Single Goal
```http
GET /goals/:id
Authorization: Bearer <jwt-token>
```

#### Update Goal
```http
PUT /goals/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Goal Title",
  "status": "completed"
}
```

#### Update Goal Status
```http
PATCH /goals/:id/status
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Goal
```http
DELETE /goals/:id
Authorization: Bearer <jwt-token>
```

### Data Transfer Objects

#### CreateGoalDto
```typescript
{
  title: string;        // Required, 1-200 characters
  description?: string; // Optional, max 1000 characters
  targetDate?: string;  // Optional, ISO date string
  status?: GoalStatus;  // Optional, defaults to 'active'
}
```

#### UpdateGoalDto
```typescript
{
  title?: string;       // Optional, 1-200 characters
  description?: string; // Optional, max 1000 characters
  targetDate?: string;  // Optional, ISO date string
  status?: GoalStatus;  // Optional
}
```

#### GoalStatus Enum
```typescript
enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused'
}
```

---

## Milestones Module

The Milestones module provides milestone management for goals, allowing users to track progress through key achievements.

### Database Schema
```prisma
model Milestone {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  goalId      String
  goal        Goal     @relation(fields: [goalId], references: [id], onDelete: Cascade)
}
```

### API Endpoints

#### Create Milestone
```http
POST /goals/:goalId/milestones
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Complete Basic Tutorial",
  "description": "Finish the TypeScript basics tutorial",
  "dueDate": "2024-06-30T23:59:59Z",
  "completed": false
}
```

#### Get All Milestones for Goal
```http
GET /goals/:goalId/milestones
Authorization: Bearer <jwt-token>
```

#### Get Milestone Progress
```http
GET /goals/:goalId/milestones/progress
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "total": 5,
  "completed": 2,
  "remaining": 3,
  "progress": 40
}
```

#### Get Single Milestone
```http
GET /goals/:goalId/milestones/:id
Authorization: Bearer <jwt-token>
```

#### Update Milestone
```http
PUT /goals/:goalId/milestones/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Milestone",
  "completed": true
}
```

#### Toggle Milestone Completion
```http
PATCH /goals/:goalId/milestones/:id/toggle
Authorization: Bearer <jwt-token>
```

#### Delete Milestone
```http
DELETE /goals/:goalId/milestones/:id
Authorization: Bearer <jwt-token>
```

### Data Transfer Objects

#### CreateMilestoneDto
```typescript
{
  title: string;        // Required, 1-200 characters
  description?: string; // Optional, max 1000 characters
  dueDate?: string;     // Optional, ISO date string
  completed?: boolean; // Optional, defaults to false
}
```

#### UpdateMilestoneDto
```typescript
{
  title?: string;       // Optional, 1-200 characters
  description?: string; // Optional, max 1000 characters
  dueDate?: string;     // Optional, ISO date string
  completed?: boolean; // Optional
}
```

---

## Actions Module

The Actions module provides actionable items management for goals, allowing users to break down goals into specific tasks.

### Database Schema
```prisma
model Action {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  goalId      String
  goal        Goal     @relation(fields: [goalId], references: [id], onDelete: Cascade)
}
```

### API Endpoints

#### Create Action
```http
POST /goals/:goalId/actions
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Watch TypeScript Tutorial",
  "description": "Complete the 2-hour TypeScript basics course",
  "dueDate": "2024-06-15T23:59:59Z",
  "completed": false
}
```

#### Get All Actions for Goal
```http
GET /goals/:goalId/actions
Authorization: Bearer <jwt-token>
```

#### Get Action Progress
```http
GET /goals/:goalId/actions/progress
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "total": 10,
  "completed": 4,
  "remaining": 6,
  "progress": 40
}
```

#### Get Single Action
```http
GET /goals/:goalId/actions/:id
Authorization: Bearer <jwt-token>
```

#### Update Action
```http
PUT /goals/:goalId/actions/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Action",
  "completed": true
}
```

#### Toggle Action Completion
```http
PATCH /goals/:goalId/actions/:id/toggle
Authorization: Bearer <jwt-token>
```

#### Delete Action
```http
DELETE /goals/:goalId/actions/:id
Authorization: Bearer <jwt-token>
```

#### Get Due Actions
```http
GET /user/actions/due?days=7
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `days`: Number of days to look ahead (default: 7)

**Response:**
```json
[
  {
    "id": "action-id",
    "title": "Complete Tutorial",
    "completed": false,
    "dueDate": "2024-06-15T23:59:59Z",
    "goal": {
      "id": "goal-id",
      "title": "Learn TypeScript"
    }
  }
]
```

### Data Transfer Objects

#### CreateActionDto
```typescript
{
  title: string;        // Required, 1-200 characters
  description?: string; // Optional, max 1000 characters
  dueDate?: string;     // Optional, ISO date string
  completed?: boolean; // Optional, defaults to false
}
```

#### UpdateActionDto
```typescript
{
  title?: string;       // Optional, 1-200 characters
  description?: string; // Optional, max 1000 characters
  dueDate?: string;     // Optional, ISO date string
  completed?: boolean; // Optional
}
```

---

## Common Features

### Authentication
All endpoints require JWT authentication:
```bash
curl -X GET http://localhost:3000/goals \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Validation
All endpoints use class-validator for input validation:
- Title: 1-200 characters
- Description: max 1000 characters
- Dates: ISO 8601 format
- Status: Enum values only

### Pagination
Goals endpoint supports pagination:
```bash
curl -X GET "http://localhost:3000/goals?page=1&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Search
Goals endpoint supports full-text search:
```bash
curl -X GET "http://localhost:3000/goals?search=typescript" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Filtering
Goals can be filtered by status:
```bash
curl -X GET "http://localhost:3000/goals?status=active" \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## Error Handling

### Common Error Responses

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Access denied"
}
```

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Goal not found"
}
```

#### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Error Scenarios

1. **Authentication Failure**: Invalid or missing JWT token
2. **Authorization Failure**: Attempting to access another user's data
3. **Resource Not Found**: Invalid goal/milestone/action ID
4. **Validation Failure**: Invalid input data
5. **Database Error**: Database connection or query issues

---

## Usage Examples

### Complete Goal Workflow

#### 1. Create a Goal
```bash
curl -X POST http://localhost:3000/goals \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn TypeScript",
    "description": "Master TypeScript fundamentals",
    "targetDate": "2024-12-31T23:59:59Z"
  }'
```

#### 2. Add Milestones
```bash
curl -X POST http://localhost:3000/goals/{goalId}/milestones \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Basic Tutorial",
    "dueDate": "2024-06-30T23:59:59Z"
  }'
```

#### 3. Add Actions
```bash
curl -X POST http://localhost:3000/goals/{goalId}/actions \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Watch TypeScript Tutorial",
    "dueDate": "2024-06-15T23:59:59Z"
  }'
```

#### 4. Track Progress
```bash
# Get milestone progress
curl -X GET http://localhost:3000/goals/{goalId}/milestones/progress \
  -H "Authorization: Bearer <jwt-token>"

# Get action progress
curl -X GET http://localhost:3000/goals/{goalId}/actions/progress \
  -H "Authorization: Bearer <jwt-token>"
```

#### 5. Complete Items
```bash
# Toggle milestone completion
curl -X PATCH http://localhost:3000/goals/{goalId}/milestones/{milestoneId}/toggle \
  -H "Authorization: Bearer <jwt-token>"

# Toggle action completion
curl -X PATCH http://localhost:3000/goals/{goalId}/actions/{actionId}/toggle \
  -H "Authorization: Bearer <jwt-token>"
```

#### 6. Update Goal Status
```bash
curl -X PATCH http://localhost:3000/goals/{goalId}/status \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

### Statistics and Reporting

#### Get Goal Statistics
```bash
curl -X GET http://localhost:3000/goals/statistics \
  -H "Authorization: Bearer <jwt-token>"
```

#### Get Due Actions
```bash
# Get actions due in next 7 days
curl -X GET "http://localhost:3000/user/actions/due?days=7" \
  -H "Authorization: Bearer <jwt-token>"

# Get actions due in next 30 days
curl -X GET "http://localhost:3000/user/actions/due?days=30" \
  -H "Authorization: Bearer <jwt-token>"
```

### Advanced Filtering

#### Filter by Status
```bash
# Get active goals
curl -X GET "http://localhost:3000/goals?status=active" \
  -H "Authorization: Bearer <jwt-token>"

# Get completed goals
curl -X GET "http://localhost:3000/goals?status=completed" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Search Goals
```bash
# Search for goals containing "typescript"
curl -X GET "http://localhost:3000/goals?search=typescript" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Pagination
```bash
# Get first page with 5 items
curl -X GET "http://localhost:3000/goals?page=1&limit=5" \
  -H "Authorization: Bearer <jwt-token>"

# Get second page with 10 items
curl -X GET "http://localhost:3000/goals?page=2&limit=10" \
  -H "Authorization: Bearer <jwt-token>"
```

---

## Best Practices

### Goal Management
1. **Set Realistic Target Dates**: Use target dates to create urgency without stress
2. **Clear Descriptions**: Provide context for goals to maintain motivation
3. **Regular Status Updates**: Keep goal status current for accurate statistics
4. **Break Down Large Goals**: Use milestones to make large goals manageable

### Milestone Planning
1. **Sequential Milestones**: Order milestones logically for progress tracking
2. **Measurable Milestones**: Make milestones quantifiable for completion tracking
3. **Realistic Timelines**: Set achievable due dates for milestones
4. **Progressive Difficulty**: Structure milestones from easy to challenging

### Action Management
1. **Specific Actions**: Create clear, actionable items
2. **Time-Bound Actions**: Set due dates for accountability
3. **Small Tasks**: Break actions into manageable pieces
4. **Regular Review**: Update action status frequently

### API Usage
1. **Handle Errors**: Implement proper error handling for all API calls
2. **Validate Input**: Use provided DTOs for type safety
3. **Cache Responses**: Cache non-sensitive data when appropriate
4. **Rate Limiting**: Implement client-side rate limiting for bulk operations

---

## Integration Examples

### Frontend Integration (React)
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

// Create goal
const createGoal = async (goalData) => {
  const response = await api.post('/goals', goalData);
  return response.data;
};

// Get goals with filtering
const getGoals = async (filters) => {
  const response = await api.get('/goals', { params: filters });
  return response.data;
};

// Update milestone completion
const toggleMilestone = async (goalId, milestoneId) => {
  const response = await api.patch(`/goals/${goalId}/milestones/${milestoneId}/toggle`);
  return response.data;
};
```

### Mobile Integration (TypeScript)
```typescript
class GoalService {
  private baseUrl = 'http://localhost:3000';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  async createGoal(goalData: CreateGoalDto): Promise<Goal> {
    const response = await fetch(`${this.baseUrl}/goals`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(goalData)
    });
    return response.json();
  }

  async getGoalStatistics(): Promise<GoalStatistics> {
    const response = await fetch(`${this.baseUrl}/goals/statistics`, {
      headers: this.headers
    });
    return response.json();
  }
}
```

---

## Testing

### Testing Goals Module
```bash
# Test goal creation
curl -X POST http://localhost:3000/goals \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Goal"}'

# Test goal retrieval
curl -X GET http://localhost:3000/goals \
  -H "Authorization: Bearer <token>"

# Test goal statistics
curl -X GET http://localhost:3000/goals/statistics \
  -H "Authorization: Bearer <token>"
```

### Testing Milestones Module
```bash
# Test milestone creation
curl -X POST http://localhost:3000/goals/{goalId}/milestones \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Milestone"}'

# Test milestone progress
curl -X GET http://localhost:3000/goals/{goalId}/milestones/progress \
  -H "Authorization: Bearer <token>"
```

### Testing Actions Module
```bash
# Test action creation
curl -X POST http://localhost:3000/goals/{goalId}/actions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Action"}'

# Test due actions
curl -X GET "http://localhost:3000/user/actions/due?days=7" \
  -H "Authorization: Bearer <token>"
```

---

## Performance Considerations

### Database Optimization
- Goals are indexed by user ID for fast retrieval
- Milestones and actions are indexed by goal ID
- Pagination prevents large result sets
- Search uses database indexing for performance

### API Performance
- Include relationships only when needed
- Use pagination for large datasets
- Cache frequently accessed data
- Implement request debouncing for UI updates

### Caching Strategy
- Cache goal statistics for 5 minutes
- Cache user preferences for 30 minutes
- Don't cache sensitive data
- Implement cache invalidation on updates

---

## Security Considerations

### Data Access Control
- All endpoints require JWT authentication
- Users can only access their own data
- Goal ownership is verified on every operation
- Cascade deletes ensure data consistency

### Input Validation
- All inputs are validated using class-validator
- String length limits prevent DoS attacks
- Date validation prevents injection attacks
- Enum validation ensures valid status values

### Error Handling
- Sensitive information is not exposed in errors
- Generic error messages for security
- Proper HTTP status codes
- Rate limiting for API protection

---

## Future Enhancements

### Planned Features
- Goal templates and presets
- Milestone dependencies
- Action recurrence patterns
- Goal categories and tags
- Progress visualization
- Reminder notifications
- Goal sharing and collaboration
- Export/import functionality
- Advanced filtering and sorting
- Bulk operations

### API Enhancements
- GraphQL support
- WebSocket for real-time updates
- Webhook notifications
- Advanced search with filters
- Batch operations endpoint
- Data export endpoints
- Analytics and reporting

---

## Support and Contributing

For issues, questions, or contributions:
- Check existing documentation
- Review API examples
- Test with provided examples
- Report bugs with detailed information
- Suggest features with use cases

This documentation provides a comprehensive guide to the core modules. For additional information, refer to the API documentation or contact the development team.
