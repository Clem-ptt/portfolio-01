# Portfolio

A full-stack personal portfolio application built to showcase projects, technical skills, and development experience.

The application uses React, TypeScript, Express, PostgreSQL, and Prisma. It includes public project pages, an authenticated admin interface, project and technology management, image uploads, session-based authentication, request validation, automated tests, Docker containerization, and production deployment.

**Live application:** [Portfolio Frontend](https://portfolio-01-frontend.onrender.com)  
**Backend API:** [Portfolio API](https://portfolio-01-api.onrender.com)

## Features

### Public Portfolio
- Public project listing and detail pages
- Slug-based project URLs
- Featured projects
- Dynamic technology showcase
- Project technology stacks with icons
- Multiple images per project
- Main project image selection
- Responsive navigation and page states
- Loading, error, and empty states

### Project Management
- Project creation, retrieval, updating, and deletion
- Featured project management
- Technology associations for projects
- Project image uploads and management
- Cloudinary image storage
- Main image selection and image deletion

### Technology Management
- Technology creation, retrieval, updating, and deletion
- Technology categories: Frontend, Backend, Database, DevOps, Tools, and Other
- Technology icons using external Devicon SVG URLs
- Many-to-many relationships between projects and technologies
- Dynamic technology display on the homepage and project detail pages
- Admin interface for managing technologies

### Authentication and Security
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
- Centralized API error handling

### Engineering and Deployment
- Layered backend architecture
- Type-safe database access using Prisma
- Automated backend tests using Vitest and Supertest
- TypeScript compilation checks
- Docker and Docker Compose
- GitHub Actions CI workflow
- Production deployment using Render
- PostgreSQL hosting using Neon
- Cloudinary for image storage

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, React Router |
| Backend | Node.js 22, Express 5, TypeScript |
| Validation | Zod |
| ORM | Prisma 7 |
| Database | PostgreSQL 18 locally, Neon PostgreSQL in production |
| Authentication | Express Session, `connect-pg-simple` |
| Image Storage | Cloudinary |
| Technology Icons | Devicon SVGs |
| Testing | Vitest, Supertest |
| API Testing | Postman |
| Containerization | Docker, Docker Compose, Nginx |
| CI | GitHub Actions |
| Deployment | Render |
| Version Control | Git, GitHub |

## Architecture

The application uses a layered full-stack architecture that separates presentation, HTTP handling, business logic, and database access.

### System Overview

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

Cloudinary stores uploaded project images. The database stores project metadata, image references, technology records, relationships, users, and sessions.

### Frontend Architecture

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

The API layer handles HTTP communication independently of UI components. This separation improves maintainability and keeps data-fetching logic out of the presentation layer.

### Backend Architecture

- **Routes:** Define API endpoints and middleware order.
- **Middleware:** Handle authentication, authorization, validation, uploads, and request processing.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Contain application logic and database operations.
- **Prisma:** Provides type-safe database access.
- **PostgreSQL:** Stores application data and session records.
- **Cloudinary:** Stores uploaded project images.

## Project Structure

```text
Portfolio-01/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── __tests__/
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
│       ├── app.ts
│       └── server.ts
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
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

This is a high-level overview; individual files may vary as the application evolves.

## API Documentation

### Base URLs

**Local development**

```text
http://localhost:3000
```

**Production**

```text
https://portfolio-01-api.onrender.com
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

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/health` | Check backend availability | Public |

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/auth/me` | Get the current authenticated user | Session-aware |
| POST | `/api/auth/login` | Authenticate the admin | Public |
| POST | `/api/auth/logout` | End the current session | Authenticated |

Authentication uses server-side sessions and HTTP cookies. The frontend sends requests with credentials enabled so the browser can include the session cookie.

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

### Technologies

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/technologies` | Get all technologies | Public |
| GET | `/api/technologies/:id` | Get a technology by ID | Public |
| POST | `/api/technologies` | Create a technology | Admin |
| PATCH | `/api/technologies/:id` | Partially update a technology | Admin |
| DELETE | `/api/technologies/:id` | Delete a technology | Admin |

Admin-only endpoints require a valid authenticated session and the appropriate authorization.

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
  "featured": true,
  "technologyIds": [1, 2, 3]
}
```

The optional `technologyIds` array associates existing technologies with the project. The endpoint returns `201 Created` when the project is successfully created.

### Partial Project Updates

The update endpoint uses `PATCH`, allowing individual fields to be modified without resending the entire project.

```http
PATCH /api/projects/1
Content-Type: application/json
```

```json
{
  "featured": true,
  "technologyIds": [1, 3]
}
```

When supplied, `technologyIds` replaces the project's existing technology associations. An empty array clears all associations.

### Technology Creation Example

```http
POST /api/technologies
Content-Type: application/json
```

```json
{
  "name": "React",
  "iconUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  "category": "FRONTEND"
}
```

Supported categories:

- `FRONTEND`
- `BACKEND`
- `DATABASE`
- `DEVOPS`
- `TOOLS`
- `OTHER`

Technology icons use external Devicon SVG URLs rather than being uploaded to Cloudinary.

### Image Uploads

Images are uploaded using `multipart/form-data`.

The upload endpoint accepts:

- `projectId` — the ID of an existing project.
- `image` — a supported image file.

Uploads are restricted to JPEG, PNG, or WebP images no larger than 10 MB and are validated before being stored in Cloudinary.

## Validation and Error Handling

Incoming request data is validated using Zod before reaching application logic.

Validation covers project fields, technology fields, URLs, slugs, IDs, and route parameters.

Project slugs must:

- Use lowercase letters, numbers, and hyphens.
- Not contain spaces or underscores.
- Not begin or end with a hyphen.
- Not contain consecutive hyphens.

Example of a valid slug:

```text
my-project-2026
```

Project and technology IDs must be positive integers. Duplicate project slugs return `409 Conflict`, while missing resources return `404 Not Found`.

Centralized Express error-handling middleware converts known database errors into consistent API responses and prevents internal errors from being returned directly to clients.

## Authentication and Security

The application implements the following security controls:

- Session-based authentication
- PostgreSQL-backed session storage
- Role-based authorization for administrative operations
- Origin validation for state-changing requests
- Login rate limiting
- Zod request validation
- Image MIME-type and content validation
- Upload size restrictions
- HTTP-only session cookies
- Production-aware cookie configuration
- Environment-based configuration for secrets and credentials

Production configuration uses secure cookies and cross-origin cookie settings where required by the separately hosted frontend and backend.

## Getting Started

### Prerequisites

Install or configure the following:

- Node.js and npm
- PostgreSQL for local development
- A Cloudinary account for image uploads
- Docker Desktop with Docker Compose for containerized development

### Installation

Clone the repository and install dependencies from the project root:

```bash
git clone <repository-url>
cd Portfolio-01
npm install
```

Install the dependencies for each application:

```bash
cd frontend
npm install
cd ../backend
npm install
cd ..
```

Replace `<repository-url>` with the actual Git repository URL.

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

If required by the frontend API client, configure `frontend/.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

### Database Setup

Make sure PostgreSQL is running and the configured database exists.

From the backend directory, apply the existing migrations and generate the Prisma client:

```bash
npx prisma migrate deploy
npx prisma generate
```

### Admin Account Setup

Configure `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`, then run the project's seed script from the backend directory:

```bash
npx prisma db seed
```

The seed script creates or updates the configured admin account.

### Running Locally

From the project root:

```bash
npm run dev
```

The root npm scripts start the frontend and backend according to the project configuration.

Default local URLs:

| Service | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:3000` |
| Health check | `http://localhost:3000/api/health` |

## Testing

Automated backend tests use Vitest and Supertest.

From the backend directory:

```bash
npm test
```

Check TypeScript compilation without generating build files:

```bash
npx tsc --noEmit
```

Postman is used for manual API testing, while frontend workflows are verified in the browser.

The test suite covers project operations, validation, error handling, authentication, and project image management. Technology-related tests cover technology endpoints and authorization, while project technology association tests verify the relationship between projects and technologies.

## Docker

The application runs using Docker Compose with three services:

- **Frontend:** React, TypeScript, Vite, and Nginx
- **Backend:** Node.js, Express, TypeScript, and Prisma
- **Database:** PostgreSQL 18

### Prerequisites

- Docker Desktop with Docker Compose

### Environment Configuration

Create a root `.env` file using `.env.example` as a reference. Configure the required database credentials, session secret, and Cloudinary credentials.

Never commit `.env` or expose application secrets.

### Start the Application

From the project root:

```bash
docker compose up -d --build
```

### Access the Services

| Service | Local address |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:3000` |
| PostgreSQL | `localhost:5433` |

### Apply Database Migrations

```bash
docker compose exec backend npx prisma migrate deploy
```

### Check Container Status

```bash
docker compose ps
```

### View Logs

```bash
docker compose logs --tail=50 backend
```

Replace `backend` with `frontend` or `db` to inspect another service.

### Stop the Application

```bash
docker compose down
```

The PostgreSQL database uses a named Docker volume to persist data when containers are stopped. Stopping the services does not normally delete that volume.

## CI

The project uses GitHub Actions to automate continuous integration checks through `.github/workflows/ci.yml`.

The workflow validates the application through the checks configured in the pipeline, including automated tests, TypeScript checks, and build validation where applicable.

The CI workflow has been verified on GitHub.

## Deployment

The application is deployed using Render, with Neon providing the production PostgreSQL database and Cloudinary handling image storage.

| Component | Provider |
|---|---|
| Frontend | Render Static Site |
| Backend API | Render Web Service |
| PostgreSQL | Neon |
| Image Storage | Cloudinary |
| CI | GitHub Actions |

### Production URLs

- **Portfolio:** [https://dev-clement.onrender.com](https://dev-clement.onrender.com)
- **Backend API:** [https://portfolio-01-api.onrender.com](https://portfolio-01-api.onrender.com)

### Production Configuration

Production deployment requires the correct environment variables, database connection, session configuration, frontend API URL, and Cloudinary credentials.

Database migrations must be applied to the production database when schema changes are introduced.

The backend is configured to support secure session cookies and cross-origin requests from the deployed frontend.

## Technical Decisions

### Layered Backend Architecture

Routes, controllers, services, and database access are separated to keep responsibilities clear and improve maintainability and testability.

### Prisma and PostgreSQL

Prisma provides type-safe database access, while PostgreSQL stores project data, user records, technology records, relationships, and sessions.

### Many-to-Many Technology Relationships

Projects and technologies use a many-to-many relationship. A project can reference multiple technologies, and a technology can be reused across multiple projects.

This avoids duplicating technology information across projects and allows the admin interface to manage associations independently.

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

The project and technology update endpoints support partial updates, so clients only need to send fields that have changed.

### Slug-Based Project URLs

Public project pages use readable URLs such as `/projects/my-project`, while numeric IDs remain available for internal resource management.

### Docker Containerization

Docker Compose provides a repeatable local environment for the frontend, backend, and PostgreSQL database.

### Automated CI

GitHub Actions provides automated checks so code changes can be validated before they are merged or deployed.

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
- [x] Technology CRUD and admin management
- [x] Project technology associations
- [x] Dynamic technology showcase
- [x] Backend automated testing
- [x] API and frontend manual verification
- [x] Security and production hardening
- [x] Docker and containerization
- [x] GitHub Actions CI
- [x] Production deployment

### Remaining Improvements

- [ ] Final UI refinement
- [ ] Add final application screenshots
- [ ] Review and expand documentation as needed

## Future Goals

The goal is to maintain a practical, production-style full-stack application that demonstrates frontend development, backend API design, relational database modeling, authentication, automated testing, containerization, and deployment.

Future improvements will focus on user experience, maintainability, and additional features while preserving the existing architecture and engineering practices.
