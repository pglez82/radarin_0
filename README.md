# Radarin project structure

## The webapp
In this case we are using react for the webapp. Lets create the app in the directory webapp with the following command (make sure you have npm installed in your system):
```
npx create-react-app webapp
```
At this point we can already run the app with:
```
cd webapp
npm start
```
We will notice that the app runs locally in port 3000. At this point this app is a hello world.

Lets make some modifications to the app, we will create an app that asks the name and email to the user and sends it to an api rest. 
```
npm install react-bootstrap bootstrap
```

Basically the app should be able to get the name and email of a user, send it to the api, and then refresh the list of the users from the api. You can check the relevant code in the components [EmailForm.js](webapp/src/components/EmailForm.js) and [UserList.js](webapp/src/components/UserList.js). 

### Testing the webapp

## The rest api
The objective for this part is to make a rest API using Express, Node.js and MongoDB as the database (Mongose for accesing it). We will implement only two functions, one push petition, for registering a new user and a get petition, to list all the users in the system. The WS will be deployed using docker and docker-compose (to launch mongo+the ws).

Lets start creating the directory `restapi` and installing the tools to make a nodejs ws there:
```
mkdir restapi
cd restapi
npm init -y
npm install express mongoose
```
Now lets run the database. Note that for the volume, docker only accepts absolute paths.
```
mkdir data
sudo docker run -d -p 27017:27017 -v `pwd`/data:/data/db mongo
```
The code is quite straight forward, the `server.js` launchs the api and connects to the mongo database using mongoose. The `app.js` is actually the api, you will see there two api entry points, one post for creating a new user, and one get to list all the users. The `models/users.js` defines the schema of our mongo database.

### Testing the rest api
This will download an inmemory mongodb database, very suitable for testing. Also we need something for making the api requests, in this case we are using Supertest.
```
npm install --save-dev jest mongodb-memory-server
npm install supertest --save-dev
```
The idea is to use Jest as the main testing framework. We are going to use it to launch our in-memory database and run the tests against the api. For making the get or post petitions we are going to use supertest.
After configuring the tests in the `package.json` we can run them using `npm run test`
