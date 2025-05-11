<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
<p align="center">
  NothingBetterThanAL API
</p>

## 🌐 Public API URL

The API is deployed and accessible at:

👉 **https://api-cinema-rjku.onrender.com/api**

This includes the Swagger documentation, which provides all available endpoints, input formats, and expected responses.


## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file, take example from `.env.example`.

## Project setup

```bash
$ npm install
```

```bash
$ prisma generate
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 📂 API Tests – Usage Guide

This folder contains files to help you test the NestJS API using two different methods: **Postman** and **REST Client (VS Code)**.

---

### 🧪 1. Using Postman

#### ✅ Requirements:

* [Postman](https://www.postman.com/downloads/) installed on your machine

#### 📥 How to import the collection:

1. Open Postman
2. Click on the **"Import"** button in the top left corner
3. Select the file `api-tests/NothingBetterThanAL.postman_collection.json` located in this folder
4. Click **"Import"**

#### 🚀 Running the requests:

* After importing, the requests will appear under **Collections**
* Make sure to configure environment variables if needed (e.g., `{{baseUrl}}`)

---

### 🧪 2. Using REST Client (VS Code)

#### ✅ Requirements:

* [Visual Studio Code](https://code.visualstudio.com/)
* [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

#### 📁 Structure:

* `.http` files are available in the folder `api-tests`
* Each file contains multiple requests grouped by resource or feature

#### ▶️ Running a request:

1. Open a `.http` file in VS Code
2. Click the **"Send Request"** button above the desired request

#### Example:

```http
### Get all users
GET http://localhost:3000/users

### Create a new user
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.
