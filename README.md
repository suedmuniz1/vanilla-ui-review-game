# sued-vanilla-ui-assignments

## Intro

This project was created for completing the optional assignment of the 'UI essentials - Vanilla UI' course.

## Steps to run the project

**In order to install all the dependencies used on the project, run**:

> npm install

**After that, for running the project locally, you need to run the following**:

> npm run dev

the command above will also generate the '/development' and '/.cache' folders. The project will be running on port 3005.

**To run the json-server (on port 3000), on another terminal, run the command**:

> npm run json:server

If you need to run the project on another port, go to package.json, and on 'dev' script, change '3005' to the port number that you want.

If you need to run json-server on another port, go to package.json, and on 'json:server' script, add '-p portNumber' before 'db.json', where 'portNumber' is the port number that you want.

**To generate the '/dist' folder, run the command**:
npm run build
