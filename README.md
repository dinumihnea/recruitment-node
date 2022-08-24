![Agreena](https://agreena.com/wp-content/uploads/2021/06/agreena-logo.svg)

# NodeJS recruitment test task

## Requirements

- NodeJS v14 or higher
- A MongoDB server
- A good mood

## Stack

- NestJS v9
- MongoDB (`mongoose` package)

## Database setup

This project uses MongoDB

Run the following command to set up a Docker container with MongoDB.

```bash
$ docker-compose up -d
```

In case you don't have Docker installed on your machine provide a link to a running MongoDB server as `DATABASE_URI` in
the `.env` file

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Seeders

Separately build the Seeder module

```bash
$ npm run seeder:build
```

### Generate random seeds

Generates 10 random Users and 100 Certificates (the output will be stored in `./dist/seeders/`)

```bash
$ npm run seeder:generate
```

### Apply seeds

Takes the seeds from `./dist/seeders/` and stores them in the database.
To prevent applying the same seeds multiple times the seedKey will be stored in the DB (`seeders` collection)

* For a future implementation the randomly generated seeds may be replaced with the vital project information to be
  stored on an empty database

```bash
$ npm run seeder:apply
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Manual testing

- ### Login

Request:

```bash
curl --location --request POST 'localhost:3000/auth/login' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'username=username' \
--data-urlencode 'password=username1234'
```

Expected response:

```JSON
{
  "accessToken": "JWT_ACCESS_TOKEN"
}
```

- ### List of available Carbon certificates (*no owner*)
  Request

```bash
curl --location --request GET 'localhost:3000/certificates/available?skip=0&limit=10' \
--header 'Authorization: Bearer JWT_ACCESS_TOKEN'
```

Expected response:

```JSON
[
  {
    "_id": "63051f512c634740d03b3c09",
    "country": "Denmark",
    "owner": "63051f512c634740d03b3c74",
    "status": "OWNED"
  },
  {
    "_id": "63065e8958ab3e1109ab093e",
    "country": "Denmark",
    "owner": "63051f512c634740d03b3c74",
    "status": "TRANSFERRED"
  }
]
```

- ### List of owned Carbon certificates (*owned by current user*)
Request

```bash
curl --location --request GET 'localhost:3000/certificates/my?skip=0&limit=10' \
--header 'Authorization: Bearer JWT_ACCESS_TOKEN'
```

Expected response:

```JSON
[
  {
    "_id": "63065e8958ab3e1109ab0938",
    "country": "Denmark",
    "status": "AVAILABLE"
  }
]

```

- ### Transfer certificate

Request:

```bash
curl --location --request PATCH 'localhost:3000/certificates' \
--header 'Authorization: Bearer JWT_ACCESS_TOKEN' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'id=63051f512c634740d03b3c09' \
--data-urlencode 'newOwnerId=A_USER_ID_FROM_THE_DATABASE'
```

Expected response:

```JSON
true
```

## Environment variables

This project uses [DotEnv](https://github.com/motdotla/dotenv) package for the environment variables

Required environment variables:

- `DATABASE_URI` the database connection URI (e.g. `mongodb://localhost:27017/agreena`)
- `PASSWORD_HASH_SALT_ROUNDS` the cost of encrypting the password. The higher the cost factor, the more hashing rounds
  are done (e.g. `10`)
- `ACCESS_TOKEN_SIGN_KEY` the secret key for signing the JWT access token (e.g. `fTJyKX@b?QNR3)THIui1RMpn`)
- `ACCESS_TOKEN_EXPIRES_IN` the expiration time for the JWT access token expressed in seconds or a string describing a
  time span [vercel/ms](https://github.com/vercel/ms) (e.g. 60, "2 days", "10h", "7d")

## Production build

```bash
# build for production
$ npm run build

## start production instance
$ npm run start:prod
```

# Original task

### Carbon Certificates application API

Create the API containing endpoints:

1. Login
2. List of available Carbon certificates (*no owner*)
3. List of owned Carbon certificates (*owned by current user*)
4. Transfer my own Carbon certificate to the another existing user (*based on the User ID parameter*)

##### Data information

**Carbon certificate** should contain the following data:

- Unique ID
- Country
- Status:
    - `available` (*no owner*)
    - `owned` (*owner is present and certificate hasn't been transferred*)
    - `transferred` (*owner is present and certificate has been transferred from one owner to another*)
- Owner (*relation to existing user, can be empty*)

##### Requirements

- Application should be written with strong typing (*TypeScript*)
- Framework is free of choice
- Authentication should be implemented (*type/package if free of choice*)
- Seeds should be included (*100 random certificates, 5 random users with certificates and 5 without them*)
- Tests have to be included

### Good luck!
