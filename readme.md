# Portfolio

## Overview

A full-stack personal portfolio application built to showcase projects, technical skills, and development experience.

The project is designed as a production-style application using React, TypeScript, Express, PostgreSQL, and Prisma. It includes public project pages, an authenticated admin interface, project management, image uploads, request validation, centralized error handling, and automated backend tests.

Development follows an incremental roadmap focused on practical full-stack engineering, security, testing, and deployment.

## Features

### Implemented

- Public project listing and detail pages
- Slug-based project URLs
- Featured projects
- Project CRUD operations
- Authenticated admin login and logout
- Session-based authentication
- Role-based authorization
- Admin project management interface
- Project image uploads using Cloudinary
- Multiple images per project
- Main image selection and image deletion
- Request validation using Zod
- Centralized API error handling
- Consistent API response format
- PostgreSQL integration using Prisma ORM
- React Router navigation
- Frontend API abstraction
- Loading, error, and empty states
- Backend automated tests
- TypeScript compilation checks

### In Progress / Planned

- Security and production hardening
- Docker and containerization
- CI/CD pipeline
- Production deployment
- Final responsive UI and visual refinement
- Screenshots and final documentation improvements

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router

### Backend
- Node.js
- Express 5
- TypeScript
- Zod
- Prisma ORM
- Express Session

### Database and Storage
- PostgreSQL
- Cloudinary for image storage
- `connect-pg-simple` for PostgreSQL-backed sessions

### Testing and Development
- Vitest and Supertest for backend testing
- Postman for manual API testing
- npm
- Git and GitHub

## Architecture

The application follows a layered full-stack architecture:

```text
React Frontend
      |
      v
HTTP / REST API
      |
      v
Express Routes
      |
      v
Middleware and Validation
      |
      v
Controllers
      |
      v
Services
      |
      v
Prisma ORM
      |
      v
PostgreSQL
```

Cloudinary handles image storage, while PostgreSQL stores project metadata and image references.

### Frontend

The frontend separates pages, reusable components, API functions, and shared TypeScript types.

```text
Pages and Components
         |
         v
      API Layer
         |
         v
   Backend REST API
```

The API layer keeps HTTP communication separate from UI components, making the frontend easier to maintain and test.

### Backend

The backend separates responsibilities across several layers:

- **Routes:** Define API endpoints and middleware order.
- **Middleware:** Handles authentication, authorization, validation, uploads, and request processing.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Contain application logic and database operations.
- **Prisma:** Provides type-safe database access.
- **PostgreSQL:** Stores application data.
- **Cloudinary:** Stores uploaded project images.

## Project Structure

```text
Portfolio-01/
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       │   ├── auth/
│       │   ├── layout/
│       │   ├── projects/
│       │   └── ui/
│       ├── pages/
│       └── types/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── generated/
│       ├── lib/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── types/
│       ├── utils/
│       ├── validators/
│       ├── __tests__/
│       ├── app.ts
│       └── server.ts
├── package.json
├── package-lock.json
└── README.md
```

## API Documentation

### Base URL

```text
http://localhost:3000
```

### Response Format

Successful responses use a consistent response envelope.

```json
{
  "success": true,
  "data": {}
}
```

Error responses use the following structure:

```json
{
  "success": false,
  "message": "Error message"
}
```

Validation errors may also include an `errors` field.

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend availability |

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/auth/me` | Get the current authenticated user | Public/session-aware |
| POST | `/api/auth/login` | Authenticate the admin | Public |
| POST | `/api/auth/logout` | End the current session | Authenticated |

Authentication uses server-side sessions and HTTP cookies.

### Projects

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/projects` | Get all projects | Public |
| GET | `/api/projects/featured` | Get featured projects | Public |
| GET | `/api/projects/slug/:slug` | Get a project by slug | Public |
| GET | `/api/projects/:id` | Get a project by ID | Public |
| POST | `/api/projects` | Create a project | Admin |
| PATCH | `/api/projects/:id` | Partially update a project | Admin |
| DELETE | `/api/projects/:id` | Delete a project | Admin |

### Project Images

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/projects/:id/images` | List a project's images | Public |
| POST | `/api/uploads` | Upload an image to a project | Admin |
| DELETE | `/api/projects/:projectId/images/:imageId` | Delete a project image | Admin |
| PATCH | `/api/projects/:projectId/images/:imageId/main` | Set the main project image | Admin |

Admin-only endpoints require a valid authenticated session and appropriate authorization.

### Project Creation Example

```http
POST /api/projects
Content-Type: application/json
```

Request body:

```json
{
  "title": "Portfolio Application",
  "slug": "portfolio-application",
  "description": "A full-stack portfolio project.",
  "githubUrl": "https://github.com/example/portfolio",
  "liveUrl": "https://example.com",
  "featured": true
}
```

The endpoint returns `201 Created` when the project is successfully created.

### Partial Project Updates

The update endpoint uses `PATCH`, allowing individual fields to be modified without resending the entire project.

```http
PATCH /api/projects/1
Content-Type: application/json
```

```json
{
  "featured": true
}
```

### Image Uploads

Images are uploaded using `multipart/form-data`.

The upload endpoint accepts:

- `projectId` — the ID of an existing project.
- `image` — a JPEG, PNG, or WebP image.

Uploads are restricted to files no larger than 10 MB and are validated before being stored in Cloudinary.

## Validation and Error Handling

Incoming project data is validated using Zod before reaching application logic.

Validation covers project fields, URLs, slugs, and route parameters.

Project slugs must:

- Use lowercase letters, numbers, and hyphens.
- Not contain spaces or underscores.
- Not begin or end with a hyphen.
- Not contain consecutive hyphens.

Example of a valid slug:

```text
my-project-2026
```

Project IDs must be positive integers. Duplicate project slugs return `409 Conflict`, while missing resources return `404 Not Found`.

Centralized Express error-handling middleware converts known database errors into consistent API responses and prevents internal errors from being returned directly to clients.

## Authentication and Security

The application implements several security controls:

- Session-based authentication
- PostgreSQL-backed session storage
- Role-based authorization for administrative operations
- Origin validation for state-changing requests
- Login rate limiting
- Zod request validation
- Image MIME-type and content validation
- Upload size restrictions
- HTTP-only session cookies
- Environment-based configuration for secrets and credentials

Further production security hardening remains part of the development roadmap.

## Getting Started

### Prerequisites

Install the following:

- Node.js and npm
- PostgreSQL
- A Cloudinary account for image uploads

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd Portfolio-01
npm install
```

Install dependencies in each application:

```bash
cd frontend
npm install

cd ../backend
npm install

cd ..
```

### Environment Configuration

Create `backend/.env` and configure the required values:

```dotenv
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/portfolio"
FRONTEND_URL="http://localhost:5173"
SESSION_SECRET="replace-with-a-long-random-secret"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-with-a-strong-password"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Replace the placeholders with your local configuration. Use strong, unique credentials and never commit real secrets to source control.

The frontend may also require `VITE_API_BASE_URL` in `frontend/.env`, depending on the API client configuration:

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

### Database Setup

Make sure PostgreSQL is running and the configured database exists.

Apply the existing Prisma migrations:

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

Return to the repository root:

```bash
cd ..
```

For a fresh local development database, use the database setup workflow appropriate to your environment.

### Admin Account Setup

Configure `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`, then run the project's seed script from the backend directory:

```bash
npx prisma db seed
```

The seed script creates or updates the configured admin account.

### Running Locally

From the repository root:

```bash
npm run dev
```

The development setup starts the frontend and backend according to the root npm scripts.

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Health check: `http://localhost:3000/api/health`

## Testing

Automated backend tests are implemented using Vitest and Supertest.

From the backend directory:

```bash
npm test
```

Check TypeScript compilation without generating build files:

```bash
npx tsc --noEmit
```

Postman is used for manual API testing, while frontend flows are verified in the browser.

Testing covers project operations, validation, error handling, authentication, and project image management.

## Docker

Docker configuration is planned for a later development phase.

The intended setup will provide consistent application environments and may include the frontend, backend, PostgreSQL, environment configuration, and database migrations.

## CI/CD

A CI/CD pipeline is planned to automate dependency installation, code checks, automated tests, builds, and deployment validation.

## Deployment

Production deployment remains planned.

The deployment process will include frontend and backend hosting, production database configuration, environment secrets, database migrations, HTTPS, and CI/CD integration.

## Screenshots

Screenshots will be added after the final UI and visual design have been completed.

## Technical Decisions

### Layered Backend Architecture

Routes, controllers, services, and database access are separated to keep responsibilities clear and improve maintainability and testability.

### Prisma and PostgreSQL

Prisma provides type-safe database access, while PostgreSQL stores project data, user records, and session information.

### Zod Validation

Zod validates incoming request data before application logic processes it, reducing the risk of invalid data reaching database operations.

### Centralized Error Handling

A shared error handler provides consistent API error responses and prevents controllers from duplicating error-handling logic.

### Session-Based Authentication

Server-side sessions support authenticated administrative operations without requiring authentication tokens to be manually managed by frontend components.

### Cloudinary Image Storage

Cloudinary stores uploaded image files, while the database maintains their URLs, identifiers, and project associations.

### Frontend API Layer

API functions are separated from page and component code, keeping HTTP details out of the presentation layer.

### PATCH for Partial Updates

The project update endpoint supports partial updates, so clients only need to send fields that have changed.

### Slug-Based Project URLs

Public project pages use readable URLs such as `/projects/my-project`, while numeric IDs remain available for internal resource management.

## Development Roadmap

### Completed

- [x] Project foundation
- [x] Backend REST API
- [x] PostgreSQL and Prisma integration
- [x] Frontend API integration
- [x] React Router integration
- [x] Public project pages
- [x] Loading, error, and empty states
- [x] Project CRUD operations
- [x] Featured projects
- [x] API validation and centralized error handling
- [x] Admin authentication and session management
- [x] Admin project management
- [x] Cloudinary image uploads and project image management
- [x] Backend automated testing
- [x] API and frontend manual verification

### Planned

- [ ] Security and production hardening
- [ ] Docker and containerization
- [ ] CI/CD
- [ ] Production deployment
- [ ] Final UI refinement
- [ ] Screenshots
- [ ] Final documentation improvements

## Future Goals

The goal is to evolve this portfolio into a maintainable, production-style full-stack application.

Future work will focus on security, containerization, continuous integration and deployment, production hosting, and final UI refinement while preserving the existing architecture and engineering practices.