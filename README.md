# Bitflow API

## Tutorial: Setting Up and Running Your Project
- Node.js: Ensure you have Node.js installed (preferably the latest LTS version).
- Docker: Install Docker and Docker Compose if you plan to use the db:local script.
- TypeScript: The project uses TypeScript, so make sure it's set up correctly in your environment.

## Setup
Clone the Repository

```bash
git clone https://github.com/julianofirme/bitflow.git
cd bitflow
```

## Install Dependencies

Run the following command to install all necessary packages:

```bash
npm install
```

## Environment Variables

Copy the .env.sample to a .env file and set the variables.

## Running the Project
Start the Local Database

If you're using Docker for the local database, run:
```bash
npm run db:local
```
This command uses Docker Compose to start up the local Redis and PostgreSQL database.

## Push Database Schema

Push the database schema to the PostgreSQL database using Prisma:
```bash
npm run db:push
```

## Run Migrations

If you have migrations, apply them with:
``` bash
npm run db:migrate-dev
```
## Open Prisma Studio

To view and interact with your database, you can open Prisma Studio:
```bash
npm run db:studio
```

## Start the Development Server

For development, use:
```bash
npm run dev
```
This command will start the development server with hot reloading.

Build and Start for Production

To build and start the project for production, first compile the TypeScript code:
```bash
npm run start
```
This will compile the TypeScript code and start the server.

##Running Tests
Integration Tests

Run integration tests with:

```bash
npm run test:int
```
Make sure your .env.test file is correctly configured for testing.