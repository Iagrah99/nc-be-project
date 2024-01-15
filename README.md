# Northcoders News API

## How to successfully connect two databases together

The file you will need is:

1. `connection.js`

This will either point towards the test database, or the live development database. This depends on which `.env` file is being referred to by `procces.env`.

## How to create the environment variables

If you are cloning this project, you will need the following files: 

`.env.test` and `.env.development`

Inside of both of these you will have to specify which database you want to refer to. Inside the `.env.test` file you will need the following:

`PGDATABASE=nc_news_test;`

Inside the `.env.development` file you will need:

`PGDATABASE=nc_news;`

