# Haram Travel — Project Documentation

> Fill in each section below. Keep this file as the single source of truth for requirements, architecture, and API usage.

---

## 1. Project Overview

**Project name:** Haram Travel

**Purpose:**



**Target users:**



**Live / hosted URL:**



**Repository:**



---

## 2. Requirements

### 2.1 Functional requirements



| ID | Requirement | Priority (Must / Should / Could) | Status (Todo / Done) | Notes |
|----|-------------|----------------------------------|----------------------|-------|
| FR-01 |  |  |  |  |
| FR-02 |  |  |  |  |
| FR-03 |  |  |  |  |
| FR-04 |  |  |  |  |
| FR-05 |  |  |  |  |
| FR-06 |  |  |  |  |
| FR-07 |  |  |  |  |
| FR-08 |  |  |  |  |
| FR-09 |  |  |  |  |
| FR-10 |  |  |  |  |

### 2.2 Non-functional requirements

| ID | Requirement | Notes |
|----|-------------|-------|
| NFR-01 | Performance |  |
| NFR-02 | Security |  |
| NFR-03 | SEO |  |
| NFR-04 | Accessibility |  |
| NFR-05 | Scalability |  |
| NFR-06 | Browser / device support |  |

### 2.3 Out of scope




---

## 3. Tech Stack

| Layer | Technology | Version / notes |
|-------|------------|-----------------|
| Framework |  |  |
| Language |  |  |
| UI |  |  |
| Database |  |  |
| ORM |  |  |
| Auth |  |  |
| Validation |  |  |
| Storage / uploads |  |  |
| Hosting (frontend + API) |  |  |
| Hosting (database) |  |  |
| Other |  |  |

---

## 4. System Architecture

### 4.1 High-level diagram

```
(Describe or paste architecture diagram here)

[ Browser ]
     |
     v
[ ________________ ]   ← public site / admin UI
     |
     v
[ ________________ ]   ← Next.js App Router (pages + API routes)
     |
     v
[ ________________ ]   ← Database
```

### 4.2 How the app is structured

**Public site (`app/(site)/`):**



**Admin panel (`app/admin/`):**



**API routes (`app/api/`):**



**Shared libraries (`lib/`):**



**UI components (`components/`):**



**Database (`prisma/`):**



---

## 5. Backend

### 5.1 How the backend was built

**Approach:**



**Runtime / hosting model:**



**Main backend responsibilities:**

- 
- 
- 

### 5.2 Database

**Provider:**



**Connection env vars:**

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` |  |
| `DATABASE_URL_UNPOOLED` |  |
|  |  |

**Main models / tables:**

| Model | Purpose | Key fields |
|-------|---------|------------|
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

**Migrations:**

- How migrations are created:
- How migrations are applied locally:
- How migrations are applied in production:

**Seed data:**



### 5.3 Authentication & authorization

**Auth library:**



**Login flow:**



**Protected routes / middleware:**



**Roles:**



**Env vars:**

| Variable | Purpose |
|----------|---------|
| `AUTH_SECRET` |  |
| `AUTH_URL` |  |
|  |  |

### 5.4 Validation & business rules



### 5.5 File uploads / storage



### 5.6 Background scripts / imports

| Script | Command | Purpose |
|--------|---------|---------|
|  |  |  |
|  |  |  |
|  |  |  |

---

## 6. Frontend

### 6.1 How the frontend was built

**Approach:**



**Rendering strategy (SSR / SSG / Client):**



### 6.2 Public website pages

| Route | Page purpose | Key components |
|-------|--------------|----------------|
| `/` |  |  |
| `/umrah-packages` |  |  |
| `/hajj-packages` |  |  |
| `/categories/[slug]` |  |  |
| `/blogs` |  |  |
| `/blogs/[slug]` |  |  |
| `/pilgrim-reviews` |  |  |
| `/contact-us` |  |  |
| `/about-us` |  |  |
|  |  |  |

### 6.3 Admin panel pages

| Route | Page purpose | Key components |
|-------|--------------|----------------|
| `/admin/login` |  |  |
| `/admin` |  |  |
| `/admin/packages` |  |  |
| `/admin/hotels` |  |  |
| `/admin/categories` |  |  |
| `/admin/blogs` |  |  |
| `/admin/reviews` |  |  |
| `/admin/account` |  |  |
|  |  |  |

### 6.4 UI patterns

**Layout / navigation:**



**Forms:**



**Tables / lists:**



**Rich text editor:**



**Toasts / notifications:**



**Loading / empty / error states:**



### 6.5 Styling



---

## 7. API Calling

### 7.1 How APIs are called

**From admin client components:**

- Helper used (e.g. `adminFetch`):
- Base path:
- Auth / cookies:
- Error handling:
- Success feedback:

**From server components / server actions:**



**From public pages:**



### 7.2 API conventions

| Topic | Convention |
|-------|------------|
| Method usage (GET/POST/PATCH/DELETE) |  |
| Request body format |  |
| Response success shape |  |
| Response error shape |  |
| Auth required |  |
| Status codes |  |

### 7.3 Admin API endpoints

#### Auth

| Method | Endpoint | Purpose | Request body | Response |
|--------|----------|---------|--------------|----------|
|  | `/api/auth/[...nextauth]` |  |  |  |
|  | `/api/admin/logout` |  |  |  |

#### Dashboard

| Method | Endpoint | Purpose | Request body | Response |
|--------|----------|---------|--------------|----------|
|  | `/api/admin/dashboard` |  |  |  |

#### Packages

| Method | Endpoint | Purpose | Request body | Response |
|--------|----------|---------|--------------|----------|
|  | `/api/admin/packages` |  |  |  |
|  | `/api/admin/packages/[id]` |  |  |  |
|  | `/api/admin/packages/[id]/duplicate` |  |  |  |

#### Hotels

| Method | Endpoint | Purpose | Request body | Response |
|--------|----------|---------|--------------|----------|
|  | `/api/admin/hotels` |  |  |  |
|  | `/api/admin/hotels/[id]` |  |  |  |
|  | `/api/admin/hotels/[id]/duplicate` |  |  |  |

#### Categories

| Method | Endpoint | Purpose | Request body | Response |
|--------|----------|---------|--------------|----------|
|  | `/api/admin/categories` |  |  |  |
|  | `/api/admin/categories/[id]` |  |  |  |
|  | `/api/admin/categories/[id]/duplicate` |  |  |  |

#### Blogs

| Method | Endpoint | Purpose | Request body | Response |
|--------|----------|---------|--------------|----------|
|  | `/api/admin/blogs` |  |  |  |
|  | `/api/admin/blogs/[id]` |  |  |  |

#### Video reviews

| Method | Endpoint | Purpose | Request body | Response |
|--------|----------|---------|--------------|----------|
|  | `/api/admin/reviews` |  |  |  |
|  | `/api/admin/reviews/[id]` |  |  |  |

#### Account

| Method | Endpoint | Purpose | Request body | Response |
|--------|----------|---------|--------------|----------|
|  | `/api/admin/account` |  |  |  |
|  | `/api/admin/account/email` |  |  |  |
|  | `/api/admin/account/password` |  |  |  |

#### Uploads

| Method | Endpoint | Purpose | Request body | Response |
|--------|----------|---------|--------------|----------|
|  | `/api/admin/upload` |  |  |  |

### 7.4 Public API endpoints

| Method | Endpoint | Purpose | Request body | Response |
|--------|----------|---------|--------------|----------|
|  | `/api/hotels/[id]` |  |  |  |
|  |  |  |  |  |

### 7.5 Example API call flow

**Example: create / update a package**

1. User action on UI:
2. Client function called:
3. HTTP request:
4. API route handler:
5. Validation:
6. Database write:
7. Response back to UI:
8. UI feedback / redirect:

**Example: load admin list**

1. 
2. 
3. 
4. 

**Example: public page reading data**

1. 
2. 
3. 
4. 

---

## 8. Environment & deployment

### 8.1 Local development

**Prerequisites:**



**Setup steps:**

1. 
2. 
3. 
4. 

**Useful commands:**

| Command | Purpose |
|---------|---------|
| `npm run dev` |  |
| `npm run build` |  |
| `npm run db:migrate` |  |
| `npm run db:seed` |  |
|  |  |

### 8.2 Environment variables checklist

| Variable | Required locally | Required on Vercel | Notes |
|----------|------------------|--------------------|-------|
| `DATABASE_URL` |  |  |  |
| `DATABASE_URL_UNPOOLED` |  |  |  |
| `AUTH_SECRET` |  |  |  |
| `AUTH_URL` |  |  |  |
| `STORAGE_PROVIDER` |  |  |  |
| `ADMIN_SEED_EMAIL` |  |  |  |
| `ADMIN_SEED_PASSWORD` |  |  |  |
|  |  |  |  |

### 8.3 Production / Vercel deployment

**Hosting notes:**



**Database notes (Neon / Postgres):**



**Deploy checklist:**

- [ ] 
- [ ] 
- [ ] 
- [ ] 

---

## 9. Folder map (reference)

```
haram-travel/
├── app/
│   ├── (site)/          # public website pages
│   ├── admin/           # admin panel pages
│   └── api/             # API route handlers
├── components/
│   ├── admin/           # admin UI
│   ├── home/            # homepage sections
│   ├── packages/        # package listing UI
│   └── ...
├── lib/                 # shared server helpers, schemas, db
├── prisma/              # schema + migrations + seed
├── scripts/             # one-off import / utility scripts
├── public/              # static assets
└── ...
```

**Notes on important folders:**



---

## 10. Testing

| Area | How tested | Notes |
|------|------------|-------|
| Public pages |  |  |
| Admin CRUD |  |  |
| Auth |  |  |
| API errors |  |  |
| Build / deploy |  |  |

---

## 11. Known issues / limitations




---

## 12. Future work




---

## 13. Glossary

| Term | Meaning |
|------|---------|
| Package |  |
| Category |  |
| Hotel |  |
| Blog |  |
| Video review |  |
|  |  |

---

## 14. Change log (documentation)

| Date | Author | Change |
|------|--------|--------|
|  |  | Created empty documentation template |
|  |  |  |
