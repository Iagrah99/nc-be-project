# Northcoders News Backend REST API Project

## Project Summary

Welcome to my Northcoders News API Backend Project! The project was written in JavaScript and uses the Express framework, along with PostgreSQL for the Database, tested using Jest (a framework for testing JavaScript code) with a jest library called Supertest (used for testing HTTP servers), and additional development tools such as Husky, Nodemon & PGformat.

The project itself is a restful API which provides the backend for my future frontend project which will be built using React (a library for building Web user interface) and will be coming in the following few weeks. Once both sides have been integrated, users will be able to view, create, delete articles & comments, filter those articles and comments using SQL queries, and more!

## Hosted Live Version

This version is hosted using the cloud application hosting service, <a href="https://render.com/">Render</a> and the PostgreSQL database hosting service, <a href="https://www.elephantsql.com/">ElephantSQL</a>. 

This version can be found <a href="https://nc-news-project-imqq.onrender.com/api" target="_blank">here</a>.

**Note that it may take up to a couple of minutes to load. If the connection does not resolve after this time, try again later.**

## Instructions

### Minimum Installation Requirements

<ul>
  <li><a href="https://nodejs.org/en">Node.js</a> - Version v21.2.0</li>
  <li><a href="https://www.postgresql.org/">PostgreSQL</a> - Version 14.9</li>
</ul>

### Installation Walkthrough

<ol>
<li> Start by forking the project repository, and open up a terminal. Then do the following steps:
<p>
Clone the repository to your local machine
  
 ```
   git clone https://github.com/Iagrah99/nc-be-project
 ```
Change from the current directory into the project folder

 ```
   cd nc-be-project
 ```
Open up the folder in VS Code

 ```
   code .
 ```
</p>
</li>

<li> Now let's verify you have both Node & PostgreSQL installed. Inside VSCode open a terminal window <kbd>CTRL/CMD SHIFT `</kbd>. Then do the following steps:
<p>
Run the check version command for Node

```
  node --version
```
Run the check version command for PostgreSQL
```
  postgres --version
```
</p>
  
</li> 

<li> Once both versions are verified, we can install our dependencies by running the following Node Package Manager (NPM) command: 
<p>
  
```
  npm install
```
</p>

</li>
  
</ol>

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

