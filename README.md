# Todo

A simple full-stack Todo application built with Next.js to explore core App Router concepts, Server Actions, API Routes, and database integration.

## Tech Stack

* Next.js
* TypeScript
* Tailwind CSS
* Prisma
* PostgreSQL

## Features

* Create tasks
* Update tasks
* Mark tasks as completed
* Delete tasks
* Persistent database storage
* Server Actions
* REST API Routes

## Concepts Covered

* File Based Routing
* Layouts
* Dynamic Routes
* API Routes (GET, POST, PATCH, DELETE)
* Server Actions (`use server`)
* Database Integration with Prisma
* Error Handling
* SSR, SSG and ISR

## Environment Variables

```env
DATABASE_URL=
```

## Run Locally

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Learning Outcome

This project helped me understand how routing, rendering strategies, API design, Server Actions, and database operations work together in a modern Next.js full-stack application.
