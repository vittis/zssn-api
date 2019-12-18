# Zombie Survival Social Network - API

Node RESTful API for the Zombie Survival Social Network, built with **docker**, **express**, **mongodb**, **inversify** and **typescript**.

The world as we know it has fallen into an apocalyptic scenario. A laboratory-made virus is transforming human beings and animals into zombies, hungry for fresh flesh.
You, as a zombie resistance member (and the last survivor who knows how to code), was designated to develop a system to share resources between non-infected humans.

## Usage

Install dependencies:
```sh
yarn (or npm i)
```
Make a copy of .env.example as .env (the default values should work fine, but you are free to tweak it):
```sh
cp .env.example .env
```
Start the services (make sure you have docker installed):
```sh
docker-compose up -d
```

You can start the application without docker too, just make sure to have mongo running on background and .env pointing to it, then run:
```sh
yarn start:dev
```

## Project Structure

Heavily inspired by the [NestJS](https://nestjs.com/) framework:

* `src/controllers` follows the resource.controller name convention
* `src/services` follows the resource.service name convention
* `src/models` follows the resource.model name convention
* `src/ioc` inversify container config
* `src/middlewares` route-level middlewares
* `src/validator` route-level validation, powered by [Joi](https://github.com/hapijs/joi)

## Commands

```sh
yarn build # Build production ready dist folder
yarn start:dev # Start server in dev mode
yarn start:prod # Start server in production mode
yarn test # Run tests
yarn lint # Lint project (eslint)
yarn lint:fix # Try to fix all fixables errors
```
## Endpoints

   - SurvivorController
      - GET /survivors
      - GET /survivors/:id
      - POST /survivors
      - PATCH /survivors/:id
      - DELETE /survivors/:id
      - POST /survivors/:id/report-infection
      - POST /survivors/:id/trade
      - GET /survivors/:id/items
  - BlueprintController
      - GET /blueprints
      - GET /blueprints/:id
      - POST /blueprints
      - DELETE /blueprints/:id
   - ItemController
      - GET /items
   - ReportController
      - GET /reports
      - GET /reports/infected
      - GET /reports/healthy
      - GET /reports/average-resources
      - GET /reports/points-lost

