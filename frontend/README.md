# Wiki Manager - Frontend

A modern React-based frontend for collaborative wiki documentation system with role-based access control, rich text editing, and full-text search capabilities.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based login and registration
  - Role-based access control (admin, editor, viewer)
  - Automatic token persistence and refresh

- 📝 **Wiki Management**
  - Create, read, update, delete wiki pages
  - Rich text editor with Quill
  - Markdown support
  - Version history and rollback
  - Comments and collaboration

- 🔍 **Search & Discovery**
  - Full-text search across wiki content
  - Filter by categories
  - View count tracking

- 👥 **Admin Dashboard**
  - User management (create, update, deactivate)
  - Role assignment
  - System statistics

## Tech Stack

- **Framework**: React 18.2
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios with interceptors
- **Editor**: React Quill (rich text)
- **Markdown**: React Markdown
- **Styling**: Tailwind CSS
- **UI Icons**: React Icons
- **Date Formatting**: date-fns

## Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── Layout.js           # Main layout wrapper
│   │   ├── Navbar.js           # Navigation bar
│   │   ├── Sidebar.js          # Left sidebar navigation
│   │   └── ProtectedRoute.js   # Route protection
│   ├── pages/
│   │   ├── HomePage.js         # Dashboard/homepage
│   │   ├── LoginPage.js        # Login form
│   │   ├── RegisterPage.js     # Registration form
│   │   ├── WikiViewPage.js     # Read-only wiki page
│   │   ├── WikiEditorPage.js   # Rich text editor
│   │   ├── SearchPage.js       # Search interface
│   │   └── AdminPage.js        # Admin dashboard
│   ├── store/
│   │   └── authStore.js        # Zustand auth state
│   ├── utils/
│   │   └── api.js              # Axios HTTP client
│   ├── styles/
│   │   └── index.css           # Global styles
│   ├── App.js                  # Main app component
│   └── index.js                # React entry point
├── .env.local                  # Environment variables
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
└── README.md                   # This file
```

## Installation

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` with backend API URL:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

3. Start development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

### `npm start`
Runs the app in development mode with Webpack hot reload.

### `npm build`
Builds the app for production to the `build/` folder.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:3001/api` |

## Authentication Flow

1. **Registration**: New users register with name, email, password, and department
2. **Login**: Users login with email and password
3. **Token Storage**: JWT tokens are stored in localStorage
4. **Token Attachment**: Axios interceptor automatically adds Bearer token to requests
5. **Token Refresh**: On 401 error, app clears token and redirects to login

## Component Details

### Layout
Main wrapper component providing:
- Sidebar navigation
- Navbar with search and user menu
- Main content area with Outlet
- Footer

### Navbar
- Search bar with real-time search
- User dropdown menu
- Admin/Editor action buttons based on role
- Login/Register links for anonymous users

### Sidebar
- Navigation categories
- Wiki categories for filtering
- Quick links to resources
- Collapsible on mobile

### ProtectedRoute
- Checks authentication status
- Validates user role against allowed roles
- Redirects to login if not authenticated
- Redirects to home if role not allowed

### Pages

**HomePage**
- Dashboard showing recent pages
- Statistics (total pages, edits, collaborators)
- Categories browse section
- Getting started guide

**LoginPage**
- Email/password login form
- Error handling and validation
- Link to registration
- Demo credentials display

**RegisterPage**
- Full name, email, password registration
- Department field (optional)
- Password confirmation validation
- Link to login

**WikiViewPage**
- Markdown content display
- Author and metadata
- View count
- Edit/Delete buttons (role-based)
- Version history tab
- Comments section

**WikiEditorPage**
- Rich text editor (Quill)
- Title and category selection
- Tags input (comma-separated)
- Change description for updates
- Save/Cancel buttons

**SearchPage**
- Full-text search bar
- Category filter dropdown
- Search results display
- Pagination-ready

**AdminPage**
- User management table
- Role assignment dropdown
- User activation/deactivation
- System statistics
- Security and system info

## State Management (Zustand)

### authStore
```javascript
{
  user: { _id, name, email, role, department, isActive },
  token: 'jwt-token',
  loading: boolean,
  error: string,
  
  actions: {
    setUser(),
    setToken(),
    loadFromStorage(),
    register(),
    login(),
    logout(),
    getCurrentUser()
  }
}
```

## API Integration

### Endpoints Used

**Auth**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

**Wiki**
- `GET /wiki` - List pages
- `GET /wiki/page/:slug` - Get page by slug
- `POST /wiki` - Create page
- `PUT /wiki/:id` - Update page
- `DELETE /wiki/:id` - Delete page
- `GET /wiki/:id/versions` - Get version history

**Search**
- `GET /search?q=query` - Full-text search
- `GET /search/category/:category` - Filter by category

**Users**
- `GET /users` - List all users (admin only)
- `PUT /users/:id` - Update user
- `POST /users/:id/deactivate` - Deactivate user (admin only)

## Styling with Tailwind CSS

The project uses Tailwind CSS for utility-first styling with:
- Custom color palette
- Typography system (via @tailwindcss/typography plugin)
- Line clamping (via @tailwindcss/line-clamp plugin)
- Custom utility classes in `src/styles/index.css`

## Error Handling

- **Global Error Boundary**: (Optional - can be added)
- **API Errors**: Caught and displayed in form messages
- **Auth Errors**: Automatically redirected to login on 401
- **Validation**: Client-side form validation before submission

## Performance Optimizations

- Code splitting with React Router lazy loading (can be added)
- Image optimization (placeholder for future implementation)
- Axios request deduplication via interceptors
- Component memoization where needed

## Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deploy to Hostinger/VPS

1. Build the app:
```bash
npm run build
```

2. Upload `build/` folder to server

3. Serve with Nginx:
```nginx
server {
    listen 3000;
    server_name your-domain.com;

    location / {
        root /path/to/build;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
    }
}
```

## Troubleshooting

### API Connection Issues
- Ensure backend is running on correct port
- Check REACT_APP_API_URL in .env.local
- Verify CORS is enabled on backend

### Login Issues
- Clear browser localStorage: `localStorage.clear()`
- Check token expiration (default 7 days)
- Verify credentials on backend

### Build Issues
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`
- Check Node.js version: `node --version`

## Security Considerations

- ✅ Passwords never sent to frontend
- ✅ JWT tokens stored securely (can use httpOnly cookies)
- ✅ Automatic token refresh on 401
- ✅ Role-based route protection
- ✅ XSS protection with React sanitization
- ⚠️ TODO: Add CSRF protection
- ⚠️ TODO: Implement refresh token rotation

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check existing issues on GitHub
2. Create new issue with detailed description
3. Include browser console errors and network logs

## Next Steps

- [ ] Add email verification for registration
- [ ] Implement refresh token mechanism
- [ ] Add offline support with Service Workers
- [ ] Create mobile-responsive design improvements
- [ ] Add dark mode theme toggle
- [ ] Implement real-time collaboration with WebSockets
- [ ] Add export to PDF/Word functionality
- [ ] Implement user notifications
- [ ] Add two-factor authentication
- [ ] Create comprehensive test suite
