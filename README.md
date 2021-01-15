![CI for radarin](https://github.com/pglez82/radarin_0/workflows/CI%20for%20radarin/badge.svg)
[![codecov](https://codecov.io/gh/pglez82/radarin_0/branch/master/graph/badge.svg?token=MSC5JW0F0K)](https://codecov.io/gh/pglez82/radarin_0)
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

Basically the app should be able to get the name and email of a user, send it to the api, and then refresh the list of the users from the api. You can check the relevant code in the components [EmailForm.js](webapp/src/components/EmailForm.js) and [UserList.js](webapp/src/components/UserList.js). The [App.js](webapp/src/App.js) component acts as the coordinator for the other components. Obviously there are other more sofisticated alternatives, for instance using [React Redux](https://react-redux.js.org/)

### The documentation
The idea here is to have the documentation along with the webapp in /docs. We are going to use asciidocs and plantuml. The template for the docs will live in webapp/docs. Lets install the required software to generate the htmls from this asciidocs

```
apt-get install ruby openjdk-8-jre
gem install asciidoctor asciidoctor-diagram
npm install shx --save-dev
```
After installing these tools we can generate the documentation. Note that we have added a new line in package.json in order to be able to run:
```
npm run docs
```
The documentation will be generated under the `build` directory. When we use docker, we are going to configure it so it is generated inside de container and deployed with the webapp.

### Testing the webapp

#### Unit tests
Basically this tests make sure that each component work isolated. It is important to check that they render properly. This tests are done using jest and you can execute them with `npm run test`

### Docker image for the web app
The `Dockerfile` for the webapp is pretty simple. Just copy the app, install the dependencies, build the production version an then run a basic webserver to launch it. To create the webapp docker image just run:
```
sudo docker build --tag webapp .
```
To run the image:
```
sudo docker run -p 127.0.0.1:8080:8080  webapp
```
Note than http-server runs by default in port 8080 so we have to bind this port with the port in our local computer.
You can then access the website in [localhost:8080](localhost:8080) and the docs in [localhost:8080/docs](localhost:8080/docs).

Important: As you can see, this docker image takes a long time to build. The problem is installing all the software for building the doc inside the docker image. This obviously is not a good solution as this should be a production image. I leave for future work changing this for avoiding generating the doc inside the production docker image.

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

### Docker image for the rest api
In this case the web service depends on the mongo database. What we are going to do is create a Dockerfile that will be responible for loading the ws and then, a general docker-compose that will load everything in order (database, webservice and webapp).

For launching manually the database and the restapi, first we build the restapi container:
```
sudo docker build --tag restapi .
```
Then we launch the database container:
```
sudo docker run -d -p 27017:27017 -v `pwd`/data:/data/db mongo
```
as we did before. Then launch the restapi container:
```
sudo docker run --network="host" restapi
```
Note the network="host" option which means that this container will be able to access the host network. This is important so the restapi can access the database.

## Launching everything at the same time (docker-compose)
All the containers will be launched in order using docker compose. Check the file [docker-compose.yaml](docker-compose.yaml) to see the definition of the containers and their lauch process. Here are the commands to launch the system and to turn it down:
```
sudo docker-compose up
```
```
sudo docker-compose down
```

## Continous integration
In this step we are going to setup GitHub Actions in order to have CI in our system. The idea is that, everytime we make a push to master, build the system (restapi and webapp), run the tests, and if everything is ok, build the docker images and upload them to Heroku to have our application deployed.

The workflow for this is in [radarin.yml](.github/workflow/radarin.yml). In this file you can see that there are two jobs, one for the restapi, one for the webapp. Jobs are executed in pararell so this will speed up our build.

So, the first to jobs in this file build the webapp and the restapi (in pararell). If everything goes well, it start deployment. For that we are going to use [Heroku](heroku.com). Heroku allows as to deploy docker containers. For the database we are going to use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) which will provide a free mongodb database in the cloud that will be enough for our application.
One important thing here is that we need to change the connection string to the database depending if we are running our application (locally, launching it with npm start or with docker-compose, it doesn't matter). For that we are going to use one enviroment variable in Heroku. In our code (check server.js), if we find this variable we will connect to MongoDB Atlas, if not, we are connecting to our local MongoDB.
In Heroku we need to create to apps, one for the restapi the other for the webapp. Each job is deploying one part of our project. 