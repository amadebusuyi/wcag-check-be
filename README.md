# Express API Starter with Typescript

How to use this template:

```sh
npx create-express-api --typescript --directory my-api-name
```

Includes API Server utilities:

- [morgan](https://www.npmjs.com/package/morgan)
  - HTTP request logger middleware for node.js
- [helmet](https://www.npmjs.com/package/helmet)
  - Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
- [dotenv](https://www.npmjs.com/package/dotenv)
  - Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`
- [cors](https://www.npmjs.com/package/cors)
  - CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

Development utilities:

- [typescript](https://www.npmjs.com/package/typescript)
  - TypeScript is a language for application-scale JavaScript.
- [ts-node](https://www.npmjs.com/package/ts-node)
  - TypeScript execution and REPL for node.js, with source map and native ESM support.
- [nodemon](https://www.npmjs.com/package/nodemon)
  - nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
- [eslint](https://www.npmjs.com/package/eslint)
  - ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
- [typescript-eslint](https://typescript-eslint.io/)
  - Tooling which enables ESLint to support TypeScript.
- [jest](https://www.npmjs.com/package/jest)
  - Jest is a delightful JavaScript Testing Framework with a focus on simplicity.
- [supertest](https://www.npmjs.com/package/supertest)
  - HTTP assertions made easy via superagent.

## Setup

## Docker Setup

### Prerequisites

Make sure you have **Docker** and **Docker Compose** installed. You can download them from [here](https://www.docker.com/products/docker-desktop).

### Setup

Clone this repository and navigate to the project folder:

```bash
git clone https://github.com/amadebusuyi/wcag-check-be
cd wcag-check-be
```

Install the dependencies

```bash
npm install
```

### Run without Docker

Run in dev mode

```bash
npm run dev
```

Run in production mode

```bash
npm run start
```

Create a build

```bash
npm run build
```

### Run with Docker

Build the Docker Image.

```bash
docker-compose build
```

Start the Docker Container

```bash
docker-compose up
```

The container will sart running on http://localhost:3000

Stop the Docker Container

```bash
docker-compose down
```
