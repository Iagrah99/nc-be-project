# Northcoders News Backend REST API Project

## Project Summary

Welcome to my Northcoders News API Backend Project! The project was written in JavaScript and uses the Express framework, along with PostgreSQL for the Database, tested using Jest (a framework for testing JavaScript code) with a jest library called Supertest (used for testing HTTP servers), and additional development tools such as Husky, Nodemon & PGformat.

The project itself is a restful API which provides the backend for my frontend NC News Web App project which is built using React (a library for building Web user interfaces). Using this API, users will be able to view, create, delete articles & comments, filter those articles and comments using SQL queries, and more!

## Hosted Live Version

This version is hosted using the cloud application hosting service, <a href="https://render.com/">Render</a> and the PostgreSQL database hosting service, <a href="https://www.elephantsql.com/">ElephantSQL</a>. 

This version can be found <a href="https://nc-news-project-imqq.onrender.com/api" target="_blank">here</a>.

**Note that it may take up to a couple of minutes to load. If the connection does not resolve after this time, try again later.**

## Instructions

### Minimum Installation Requirements

<ul>
  <li><a href="https://nodejs.org/en" target="_blank">Node.js</a> - Version v21.2.0</li>
  <li><a href="https://www.postgresql.org/" target="_blank">PostgreSQL</a> - Version 14.9</li>
</ul>

### Installation Walkthrough

1. Start by forking the project repository, and open up a terminal. Then do the following steps:

    1A. Clone the repository to your local machine

    ```bash
    git clone https://github.com/Iagrah99/nc-be-project
    ```

    2B. Change from the current directory into the project folder

    ```bash
    cd nc-be-project
    ```

    3C. Open up the folder in VS Code

    ```bash
    code .
    ```

2. Now let's verify you have both Node & PostgreSQL installed. Inside VSCode open a terminal window <kbd>CTRL/CMD SHIFT `</kbd>. Then do the following steps:

    2A. Run the check version command for Node
    
    ```
      node --version
    ```
    
    2B. Run the check version command for PostgreSQL
    
    ```
      psql --version
    ```
    
    2C.  Once both versions are verified, we can install our dependencies by running the following Node Package Manager (NPM) command: 
  
    ```
      npm install
    ```
    **Note that this may take a couple of minutes, depending on how fast your computer is.**

## How To Get Started Running The Project

### Create The Environment Variables

Once you have successfully followed the installation steps, you will need to create the following files yourself inside of the root folder: 

`.env.test` and `.env.development`

Inside both of these files you will have to specify which database you want to connect to. Inside the `.env.test` file you will need to write the following code:

```
PGDATABASE=nc_news_test
```

Inside the `.env.development` file you will need to write:

```
PGDATABASE=nc_news
```

Ensure that the names of both files are present inside of your `.gitignore` file. If it's not already there, you can simply write `.env.*` on a new line and it will target both `.env` files.

### Seeding The Database

Before you are able to use or test the application, you will need to set up the database and seed it with the data. In the terminal, enter the following commands: 

```
npm run setup-dbs
```

```
npm run seed
```
Both of these commands reference NPM scripts found within the `package.json` file. Now you should be good to go either running or testing the API.
Note that the database will be automatically reseeded prior to each test, so you will not need to run these commands again.

### API Testing

To run a test, type in the following command: 
```
npm test
```
This will run every test including those from `utils.test.js`. To specifically test our server endpoints, append the `app.test.js` file name to the `npm test` command.
To run specific test suites, prefix them with `.only`, for example:
```
describe.only() => {
...
}
```
If you wish to see a full list of all the endpoints, checkout the `endpoints.json` file.

Thanks for checking out my project! 
