# Portfolio

## Overview

A full-stack personal portfolio application built to showcase projects, technical skills, and development experience.

The project is designed as a production-style application rather than a static portfolio page. It includes a React frontend, an Express/TypeScript backend, PostgreSQL database integration through Prisma, API validation, centralized error handling, and project management functionality.

The application is being developed incrementally, with authentication, image uploads, testing, containerization, CI/CD, deployment, and UI refinement planned for later phases.

## Features

### Implemented

* Project listing
* Project detail pages
* Slug-based project URLs
* Project CRUD API
* Featured projects API
* API request validation
* Centralized API error handling
* Consistent API response format
* React Router navigation
* Frontend loading, error, and empty states
* PostgreSQL database integration
* Prisma ORM integration
* Layered backend architecture
* Frontend API abstraction

### Planned

* Authentication
* Admin/project management interface
* Image uploads
* Automated testing
* Security hardening
* Docker
* CI/CD
* Production deployment
* Responsive UI and visual refinement

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router

### Backend

* Node.js
* Express
* TypeScript
* Zod
* Prisma

### Database

* PostgreSQL

### Infrastructure

* Local development environment
* Docker — planned
* CI/CD — planned
* Production deployment — planned

## Architecture

The application follows a layered full-stack architecture:

```text
React
  ↓
HTTP / REST API
  ↓
Express Routes
  ↓
Middleware / Validation
  ↓
Controllers
  ↓
Services
  ↓
Prisma
  ↓
PostgreSQL
```

### Frontend

The frontend is separated into pages, reusable components, API functions, and shared types.

```text
Pages / Components
        ↓
     API Layer
        ↓
   Backend REST API
```

The API layer keeps HTTP communication separate from UI components. This allows pages and components to work with application-level functions such as `getProjects()` and `getProjectBySlug()` rather than directly handling API URLs and response envelopes.

### Backend

The backend separates HTTP handling from application logic and database access.

* **Routes** — define API endpoints.
* **Middleware** — handles cross-cutting request processing and validation.
* **Controllers** — handle HTTP requests and responses.
* **Services** — contain application and data-access operations.
* **Prisma** — handles database communication.
* **PostgreSQL** — stores application data.

This separation keeps individual responsibilities clear and makes the application easier to maintain, test, and extend.

## Project Structure

```text
Portfolio-01/
├── frontend/
│   └── src/
│       ├── api/
│       │   ├── client.ts
│       │   └── projects.ts
│       ├── components/
│       │   ├── layout/
│       │   │   ├── MainLayout.tsx
│       │   │   ├── Navbar.tsx
│       │   │   └── PageContainer.tsx
│       │   ├── ui/
│       │   │   ├── LoadingState.tsx
│       │   │   ├── ErrorState.tsx
│       │   │   └── EmptyState.tsx
│       │   └── projects/
│       │       └── ProjectCard.tsx
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── ProjectsPage.tsx
│       │   └── ProjectDetailPage.tsx
│       ├── types/
│       │   ├── api.ts
│       │   └── project.ts
│       ├── App.tsx
│       └── main.tsx
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   │   └── project.controller.ts
│   │   ├── generated/
│   │   │   └── prisma/
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   ├── middleware/
│   │   │   ├── validate.ts
│   │   │   └── error-handler.ts
│   │   ├── routes/
│   │   │   └── project.routes.ts
│   │   ├── services/
│   │   │   └── project.service.ts
│   │   ├── types/
│   │   │   └── api.ts
│   │   ├── utils/
│   │   │   └── response.ts
│   │   ├── validators/
│   │   │   └── project.validator.ts
│   │   └── server.ts
│   ├── .env
│   ├── prisma.config.ts
│   └── package.json
│
├── package.json
├── package-lock.json
└── README.md
```

## API Documentation

### Base URL

```text
http://localhost:3000
```

All API responses use a consistent response envelope.

Successful response:

```json
{
  "success": true,
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Error message"
}
```

Validation errors may additionally include an `errors` field containing validation details.

### Projects

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| GET    | `/api/projects`            | Get all projects           |
| GET    | `/api/projects/featured`   | Get featured projects      |
| GET    | `/api/projects/:id`        | Get a project by ID        |
| GET    | `/api/projects/slug/:slug` | Get a project by slug      |
| POST   | `/api/projects`            | Create a project           |
| PATCH  | `/api/projects/:id`        | Partially update a project |
| DELETE | `/api/projects/:id`        | Delete a project           |

### Get All Projects

```http
GET /api/projects
```

Returns all projects ordered by creation date.

Example response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Portfolio API",
      "slug": "portfolio-api",
      "description": "A full-stack portfolio application.",
      "imageUrl": null,
      "githubUrl": null,
      "liveUrl": null,
      "featured": true,
      "createdAt": "2026-09-19T00:00:00.000Z",
      "updatedAt": "2026-09-19T00:00:00.000Z"
    }
  ]
}
```

### Get Featured Projects

```http
GET /api/projects/featured
```

Returns only projects where `featured` is set to `true`.

Featured projects are used by the frontend to populate the featured projects section of the portfolio.

### Get Project by ID

```http
GET /api/projects/:id
```

Example:

```http
GET /api/projects/1
```

Returns a single project matching the provided ID.

Project IDs must be positive integers.

### Get Project by Slug

```http
GET /api/projects/slug/:slug
```

Example:

```http
GET /api/projects/slug/portfolio-api
```

Example response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Portfolio API",
    "slug": "portfolio-api",
    "description": "A full-stack portfolio application.",
    "imageUrl": null,
    "githubUrl": null,
    "liveUrl": null,
    "featured": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z"
  }
}
```

The frontend uses slug-based URLs for public project pages:

```text
/projects/portfolio-api
```

### Create Project

```http
POST /api/projects
Content-Type: application/json
```

Request body:

```json
{
  "title": "Portfolio API",
  "slug": "portfolio-api",
  "description": "A full-stack portfolio application.",
  "imageUrl": "https://example.com/image.png",
  "githubUrl": "https://github.com/example/portfolio",
  "liveUrl": "https://example.com",
  "featured": true
}
```

Required fields:

* `title`
* `slug`
* `description`

Optional fields:

* `imageUrl`
* `githubUrl`
* `liveUrl`
* `featured`

The endpoint returns `201 Created` when the project is successfully created.

### Update Project

```http
PATCH /api/projects/:id
Content-Type: application/json
```

Example:

```http
PATCH /api/projects/1
```

Request body:

```json
{
  "featured": true
}
```

Because this endpoint uses `PATCH`, only the fields that need to be changed have to be provided.

For example:

```json
{
  "title": "Updated Portfolio API",
  "description": "Updated project description."
}
```

The endpoint returns `200 OK` when the project is successfully updated.

### Delete Project

```http
DELETE /api/projects/:id
```

Example:

```http
DELETE /api/projects/1
```

Deletes the project matching the provided ID.

## Validation

Incoming API data is validated using Zod before reaching the application logic.

### Project Validation

Project titles and descriptions must not be empty.

Project URLs must contain valid URL formats when provided.

Project slugs must:

* contain lowercase letters, numbers, and hyphens
* not contain spaces
* not contain uppercase letters
* not begin or end with a hyphen
* not contain consecutive hyphens

Valid example:

```text
my-project-2026
```

Invalid examples:

```text
My Project
my_project
-my-project
my--project
```

Project IDs must be positive integers.

### Duplicate Resources

Project slugs are unique.

Attempting to create or update a project using an existing slug results in a `409 Conflict` response.

## Error Handling

The backend uses centralized Express error-handling middleware.

Known Prisma errors are converted into appropriate API responses.

For example:

```json
{
  "success": false,
  "message": "Project not found"
}
```

Validation failures return additional validation details:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

This keeps error handling consistent across API endpoints and prevents individual controllers from having to duplicate database error handling logic.

## HTTP Status Codes

| Status | Meaning                               |
| ------ | ------------------------------------- |
| `200`  | Successful request                    |
| `201`  | Resource created                      |
| `400`  | Invalid request or validation failure |
| `404`  | Resource not found                    |
| `409`  | Resource conflict                     |
| `500`  | Internal server error                 |

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* PostgreSQL

### Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd Portfolio-01

npm install

cd frontend
npm install

cd ../backend
npm install

cd ..
```

### Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/portfolio"
```

Replace `USER` and `PASSWORD` with the credentials for your local PostgreSQL installation.

Do not commit `.env` files or database credentials to source control.

The frontend requires the following environment variable:

```env
VITE_API_BASE_URL=http://localhost:3000
```

This should be placed in:

```text
frontend/.env
```

### Database Setup

Make sure PostgreSQL is running and the `portfolio` database exists.

Run the Prisma migrations:

```bash
cd backend
npx prisma migrate dev
```

Generate the Prisma client if necessary:

```bash
npx prisma generate
```

Return to the project root:

```bash
cd ..
```

### Running Locally

From the project root:

```bash
npm run dev
```

This starts both the frontend and backend development servers.

The frontend is available at:

```text
http://localhost:5173
```

The backend is available at:

```text
http://localhost:3000
```

## Testing

Automated testing is planned for a later phase.

Current development testing is performed by manually testing API endpoints and frontend flows.

The current manual test coverage includes:

* Project CRUD operations
* Project creation
* Project updates
* Project deletion
* Featured project retrieval
* Project retrieval by ID
* Project retrieval by slug
* Invalid project IDs
* Invalid slugs
* Duplicate project slugs
* Invalid request data
* API error handling
* Project list loading
* Loading states
* Error states
* Empty states
* Project detail navigation
* Slug-based project retrieval
* Frontend/backend API integration

Automated unit, integration, and end-to-end testing will be introduced in a later development phase.

## Docker

Docker configuration is planned.

The eventual Docker setup will containerize the application and provide a consistent environment for development and deployment.

Planned containerization may include:

* Frontend application
* Backend API
* PostgreSQL database
* Environment configuration
* Database migrations

## CI/CD

CI/CD is planned for a later phase.

The planned pipeline will eventually automate tasks such as:

* Installing dependencies
* Running linting
* Running automated tests
* Building the frontend
* Building the backend
* Validating the application before deployment

## Deployment

Production deployment is planned.

The production environment will eventually include:

* Frontend hosting
* Backend hosting
* Production PostgreSQL database
* Environment variable configuration
* Database migrations
* HTTPS
* CI/CD

## Screenshots

Screenshots will be added after the frontend UI and visual design have been finalized.

## Lessons / Technical Decisions

### Layered Backend Architecture

The backend separates routes, controllers, services, and database access.

This keeps HTTP-specific logic out of the service layer and makes individual parts of the application easier to maintain and test.

### Prisma

Prisma provides a type-safe interface for interacting with PostgreSQL and allows the database schema to be represented directly in the application.

Database migrations are managed through Prisma.

### Zod Validation

Zod is used to validate incoming API data before it reaches the application logic.

This prevents invalid request data from being passed directly into database operations.

Validation is also applied to route parameters such as project IDs and slugs.

### Centralized Error Handling

Express error-handling middleware provides a single location for handling unexpected errors and known Prisma errors.

This keeps controllers focused on request handling rather than repeating error-response logic.

### Consistent API Responses

API responses follow a consistent structure.

Successful responses:

```json
{
  "success": true,
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message"
}
```

This makes the frontend API layer predictable and reduces the amount of response-format handling required by individual pages.

### Slug-Based Project URLs

Project detail pages use slugs in public URLs:

```text
/projects/my-project
```

rather than exposing database IDs in the frontend URL.

The database ID remains useful for internal CRUD operations, while the slug provides a more readable public URL.

### Frontend API Layer

Frontend API calls are kept separate from page and component code.

For example:

```ts
getProjects()
getFeaturedProjects()
getProjectBySlug(slug)
```

These functions hide the underlying HTTP implementation from the UI.

This allows components and pages to focus on presentation, state, and user interaction rather than API URLs and response envelopes.

### PATCH for Partial Updates

The project update endpoint uses `PATCH` rather than `PUT` because project updates are designed to be partial.

For example, changing only the `featured` status does not require sending the entire project object:

```json
{
  "featured": true
}
```

This matches the behavior of the backend update schema, which makes every project field optional for update operations.

### Explicit API Routes

The API uses explicit routes for common project operations:

```text
/api/projects
/api/projects/featured
/api/projects/:id
/api/projects/slug/:slug
```

Rather than adding query parameters for functionality that is not currently required, the API keeps frequently used operations clear and easy to understand.

More advanced filtering or querying can be introduced later if the application requires it.

## Development Roadmap

### Completed

* [x] Project foundation
* [x] Backend API
* [x] PostgreSQL integration
* [x] Prisma integration
* [x] Frontend API integration
* [x] React Router integration
* [x] Project list page
* [x] Project detail page
* [x] Slug-based project routing
* [x] Frontend application structure
* [x] Loading, error, and empty states
* [x] Project CRUD operations
* [x] Featured projects endpoint
* [x] API validation
* [x] Centralized error handling
* [x] API response standardization
* [x] API documentation

### Planned

* [ ] Authentication
* [ ] Admin/project management interface
* [ ] Image uploads
* [ ] Automated testing
* [ ] Security hardening
* [ ] Docker
* [ ] CI/CD
* [ ] Production deployment
* [ ] Full documentation refinement
* [ ] Final UI beautification

## Future Goals

The long-term goal of this project is to evolve the portfolio from a simple project showcase into a production-style full-stack application.

Future development will focus on authentication, administrative project management, media handling, automated testing, security, containerization, CI/CD, and production deployment.

The project will continue to be developed incrementally so that each feature introduces a practical engineering concept rather than being added only for complexity.
