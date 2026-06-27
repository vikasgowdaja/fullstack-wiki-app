# Wiki Manager Backend

Professional REST API for the Wiki Management System. Built with Node.js, Express, and MongoDB.

## Features

- ✅ User authentication (JWT)
- ✅ Role-based access control (Admin, Editor, Viewer)
- ✅ Wiki page CRUD operations
- ✅ Version control and history
- ✅ Full-text search functionality
- ✅ Comments and collaboration
- ✅ Markdown support
- ✅ Error handling and validation

## Setup

### Prerequisites

- Node.js 16+
- MongoDB 5.0+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB** (if running locally)
```bash
mongod
```

5. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (requires auth) |

### Wiki Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wiki` | Get all pages (with filters) |
| GET | `/api/wiki/page/:slug` | Get page by slug |
| POST | `/api/wiki` | Create new page (requires auth) |
| PUT | `/api/wiki/:id` | Update page (requires auth) |
| DELETE | `/api/wiki/:id` | Delete page (requires auth) |
| GET | `/api/wiki/:id/versions` | Get version history |
| POST | `/api/wiki/:id/restore/:versionNumber` | Restore version (admin only) |
| POST | `/api/wiki/:id/comments` | Add comment to page |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=keyword` | Search wiki pages |
| GET | `/api/search/recent/pages` | Get recently updated pages |
| GET | `/api/search/category/:category` | Get pages by category |

### Users (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users (admin only) |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| POST | `/api/users/:id/deactivate` | Deactivate user (admin only) |

## Database Models

### User Schema

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin, editor, viewer),
  department: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### WikiPage Schema

```javascript
{
  title: String (unique),
  slug: String (auto-generated),
  content: String,
  category: String,
  author: ObjectId (ref: User),
  lastEditedBy: ObjectId (ref: User),
  tags: [String],
  version: Number,
  isPublished: Boolean,
  isPinned: Boolean,
  viewCount: Number,
  versions: [{
    versionNumber: Number,
    content: String,
    editedBy: ObjectId,
    editedAt: Date,
    changeDescription: String
  }],
  comments: [{
    author: ObjectId,
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

```bash
# Server
NODE_ENV=development|production
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/wiki-manager

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```bash
Authorization: Bearer [JWT_TOKEN]
```

### Example:

```bash
curl -H "Authorization: Bearer eyJhbGc..." http://localhost:3001/api/auth/me
```

## User Roles

- **Admin**: Full access, can manage users and delete any pages
- **Editor**: Can create and edit their own pages
- **Viewer**: Read-only access

## Error Handling

All errors return consistent JSON format:

```json
{
  "success": false,
  "status": 400,
  "message": "Error description",
  "details": []
}
```

## Development

### Running Tests

```bash
npm test
```

### Debugging

```bash
DEBUG=wiki-manager:* npm run dev
```

### Code Style

The project uses JavaScript ES6+ with support for async/await.

## Deployment

### Docker

```bash
docker build -t wiki-manager-backend .
docker run -p 3001:3001 -e MONGODB_URI=mongodb://mongo:27017/wiki-manager wiki-manager-backend
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Enable CORS for production frontend only
- [ ] Setup MongoDB with authentication
- [ ] Use environment-specific database URL
- [ ] Setup error logging/monitoring
- [ ] Enable HTTPS
- [ ] Setup rate limiting
- [ ] Run security audit

## Troubleshooting

### MongoDB Connection Error

```bash
# Ensure MongoDB is running
mongod

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/wiki-manager
```

### Port Already in Use

```bash
# Find process on port 3001
lsof -i :3001

# Kill process
kill -9 [PID]

# Or use different port
PORT=3002 npm run dev
```

### JWT Token Issues

- Check `JWT_SECRET` is set in .env
- Verify token hasn't expired
- Ensure Authorization header format is correct

## Contributing

1. Create feature branch (`git checkout -b feature/feature-name`)
2. Commit changes (`git commit -m 'Add feature'`)
3. Push to branch (`git push origin feature/feature-name`)
4. Open pull request

## License

MIT

## Support

For issues or questions:
1. Check documentation in [README.md](../README.md)
2. Review API examples in this file
3. Check backend logs for detailed errors

---

**Backend Version:** 1.0.0  
**Last Updated:** 2026-06-25
