![CI for radarin](https://github.com/pglez82/radarin_0/workflows/CI%20for%20radarin/badge.svg)
[![codecov](https://codecov.io/gh/pglez82/radarin_0/branch/master/graph/badge.svg?token=MSC5JW0F0K)](https://codecov.io/gh/pglez82/radarin_0)
# Radarin project structure
Link to the deployed sample application: [radarin0](https://radarin0webapp.herokuapp.com/). Note that sometimes it can take a while to load because Heroku in the free plan, takes to sleep the containers when they are not used for some time and taking them up takes time.

## Quick start guide
If you want to execute the project you will need `git`, `npm` and `docker`. Make sure the three of them are installed in your system. Download the project with `git clone https://github.com/pglez82/radarin_0`. The fastest way to launch everything is with docker:
```
mkdir restapi/data
docker-compose up --build
```
This will create two docker images as they don't exist in your system (the webapp and the restapi) and launch a mongo container database (which will use the restapi/data directory to store the database). It will also launch Prometheus and Grafana containers to monitor the webservice. You can access everything from here:
 - [Webapp - http://localhost:3000](http://localhost:3000)
 - [Docs - http://localhost:3000/docs](http://localhost:3000/docs)
 - [RestApi example call - http://localhost:5000/api/users/list](http://localhost:5000/api/users/list)
 - [RestApi raw metrics - http://localhost:5000/metrics](http://localhost:5000/metrics)
 - [Prometheus server - http://localhost:9090](http://localhost:9090)
 - [Grafana server http://localhost:9091](http://localhost:9091)
 
If you want to run it without docker (even though you still need docker to run the mongo db database):
```
cd restapi
mkdir data
sudo docker run -d -p 27017:27017 -v `pwd`/data:/data/db mongo
```
Compile and run the web app:
```
cd webapp
npm install
npm start
```
Now the webservice:
```
cd restapi
npm install
npm start
```
You should be able to access the application in [http://localhost:3000](http://localhost:3000) and the documentation in [http://localhost:3000/docs](http://localhost:3000/docs)

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
docker build --tag webapp .
```
To run the image:
```
docker run -p 127.0.0.1:3000:3000  webapp
```
In order to run the app, we need a server. npm start is not good for production so we are going to use express. Check the server.js in the webapp to understand the configuration. As we will run it in port 3000 (in localhost), we have to bind this port with the port in our local machine.

You can then access the website in [http://localhost:3000](http://localhost:3000) and the docs in [http://localhost:3000/docs](http://localhost:8080/docs).

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
docker run -d -p 27017:27017 -v `pwd`/data:/data/db mongo
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
docker build --tag restapi .
```
Then we launch the database container:
```
docker run -d -p 27017:27017 -v `pwd`/data:/data/db mongo
```
as we did before. Then launch the restapi container:
```
docker run --network="host" restapi
```
Note the network="host" option which means that this container will be able to access the host network. This is important so the restapi can access the database.

## Launching everything at the same time (docker-compose)
All the containers will be launched in order using docker compose. Check the file [docker-compose.yaml](docker-compose.yaml) to see the definition of the containers and their lauch process. Here are the commands to launch the system and to turn it down:
```
docker-compose up
```
```
docker-compose down
```

## Continous integration
In this step we are going to setup GitHub Actions in order to have CI in our system. The idea is that, everytime we make a push to master, build the system (restapi and webapp), run the tests, and if everything is ok, build the docker images and upload them to Heroku to have our application deployed.

The workflow for this is in [radarin.yml](.github/workflow/radarin.yml). In this file you can see that there are two jobs, one for the restapi, one for the webapp. Jobs are executed in pararell so this will speed up our build.

So, the first to jobs in this file build the webapp and the restapi (in pararell). If everything goes well, it start deployment. For that we are going to use [Heroku](heroku.com). Heroku allows as to deploy docker containers. For the database we are going to use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) which will provide a free mongodb database in the cloud that will be enough for our application.
One important thing here is that we need to change the connection string to the database depending if we are running our application (locally, launching it with npm start or with docker-compose, it doesn't matter). For that we are going to use one enviroment variable in Heroku. In our code (check server.js), if we find this variable we will connect to MongoDB Atlas, if not, we are connecting to our local MongoDB.
In Heroku we need to create two apps, one for the restapi the other for the webapp. Each job is deploying one part of our project. 
Also it is important to know that Heroku doesn't allow us to chose the port of our application. For that we have to use the enviroment variable `PORT` in both the webapp and the restapi.
Another important point is the api end point. In react it will be hardcoded compiled in the application, so we need to configure this in the Dockerfile, prior to building the app. Using arguments we can differenciate when we are deploying locally with docker-compose or when we are doing it with github actions, so we can use the local restapi or the one deployed in Heroku.

## E2E testing
Integration tests is maybe the most difficult part to integratein our system. We have to test the system as a whole. The idea here is to deploy the system and make the tests using [jest-puppeteer](https://github.com/smooth-code/jest-puppeteer) (browser automatization) and [jest-cucumber](https://www.npmjs.com/package/jest-cucumber) (user stories). We will also be using [expect-puppeteer](https://www.npmjs.com/package/expect-puppeteer) to make easier the test writing. All the structure needed is under the `webapp/e2e` directory. This tests can be run locally using `npm run test:e2e` and they will be run also in GitHub Actions, just after the unitary tests. Let me explain each part, and how the pieces work together:
 - `features`. This directory is for writting the user stories, using Gherkin.
 - `steps`. Each feature is divided in parts. Here we implement the steps to complete each part in the test. We have to iterate with the browser so we will have to find elements by id, fill elements in forms, click buttons, etc.
 - `custom-environment.js`. Launchs the browsers (by default chromium). We can choose if we want it to be headless (good for github actions) or with graphical interface, to see what is actually happening. Just change the `headless` parameter.
 - `global-setup.js`. Defines how to launch our system. In our case we need, the database, the restapi and the webapp.
 - `global-teardown.js`. Clean resources once tests finish.
 - `jest-config.js`. This file links everything. Is the entry point for jest to load the e2e tests.
 - `start-db.js`. Launchs the in-memory database. Uses a script from the restapi directory. It is used by `global-setup.js`.
 - `start-restapi.js`. Launchs the rest api. Uses a script from the restapi directory. It is used by `global-setup.js`.


## Monitoring (Prometheus and Grafana)
In this step we are going use Prometheus and Grafana to monitor the restapi. First step is modifying the restapi launch to capture profiling data. In nodejs this is very easy. First install the required packages:

```
npm install prom-client express-prom-bundle
```

Then, modify the `restapi/server.js` in order to capture the profiling data adding:
```
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);
```
Now when we launch the api, in [http://localhost:5000/metrics](http://localhost:5000/metrics) we have a metrics endpoint from which get the profiling data. The idea here is to have another piece of software running (called [Prometheus](https://prometheus.io/)) that will get this data, let say, every five seconds. Then, another software called [Grafana](https://grafana.com/) will display this using beautiful charts.

For running Prometheus and Grafana we can use serveral docker images:
```
cd restapi
docker run --rm --net=host -p 9090:9090 -v `pwd`/monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
```
```
docker run --rm -p 9091 --net=host -e GF_AUTH_DISABLE_LOGIN_FORM=true -e GF_AUTH_ANONYMOUS_ENABLED=true -e GF_AUTH_ANONYMOUS_ORG_ROLE=Admin -e GF_SERVER_HTTP_PORT=9091 -v `pwd`/monitoring/grafana/datasources/datasource.yml:/etc/grafana/provisioning/datasources/datasources.yml grafana/grafana
```
Note that in the prometheus.yml we are telling prometheus where is our restapi metrics end point. In grafana docker image we are telling where to find prometheus data.

Obviously this can be easyly integrated with docker-compose so when the restapi, the database and the webapp are launched, also the monitoring services are launched together (check docker-compose.yaml). Once launched (see the Quick Start Guide), we can simulate a few petitions to our webservice:

```
sudo apt-get install apache2-utils
ab -m GET -n 10000 -c 100 http://localhost:5000/api/users/list
```
In the grafana dashboard we can see how the number of petitions increases dramatically after the call.

A good reference with good explanations about monitoring in nodejs can be found [here](https://github.com/coder-society/nodejs-application-monitoring-with-prometheus-and-grafana).

## Load testing (Gatling)
This part will be carried out using [Gatling](https://gatling.io/). Gatling will simulate load in our system making petitions to the webapp.

In order to use Gatling for doing the load tests in our application we need to [download](https://gatling.io/open-source/start-testing/) it. Basically, the program has two parts, a [recorder](https://gatling.io/docs/current/http/recorder) to capture the actions that we want to test and a program to run this actions and get the results. Gatling will take care of capture all the response times in our requests and presenting them in quite useful graphics for its posterior analysis.

Once we have downloaded Gatling we need to start the [recorder](https://gatling.io/docs/current/http/recorder). This works as a proxy that intercepts all the actions that we make in our browser. That means that we have to configure our browser to use a proxy. We have to follow this steps:

1. Configure the recorder in **HTTP proxy mode**.
2. Configure the **HTTPs mode** to Certificate Authority.
3. Generate a **CA certificate** and key. For this, press the Generate CA button. You will have to choose a folder to generate the certificates. Two pem files will be generated.
4. Configure Firefox to use this **CA certificate** (Preferences>Certificates, import the generated certificate).
5. Configure Firefox to use a **proxy** (Preferences>Network configuration). The proxy will be localhost:8000.
6. Configure Firefox so it uses this proxy even if the call is to a local address. In order to do this, we need to set the property `network.proxy.allow_hijacking_localhost` to `true` in `about:config`. 

Once we have the recorder configured, and the application running (in Heroku for instance), we can start recording our first test. We must specify a package and class name. This is just for test organization. Package will be a folder and Class name the name of the test. In my case I have used `GetUsersList` without package name. After pressing start the recorder will start capturing our actions in the browser. So here you should perform all the the actions that you want to record. In my case I just browsed to the Heroku deployed webapp. Once we stop recording the simulation will be stored under the `user-files/simulations` directory, written in [Scala](https://www.scala-lang.org/) language. I have copied the generated file under `webapp/loadtestexample` just in case you want to see how a test file in gatling looks like.

We can modify our load test for instance to inject 20 users at the same time:
```
setUp(scn.inject(atOnceUsers(20))).protocols(httpProtocol)
```
changing it in the scala file.
In order to execute the test we have to execute:
```
gatling.sh -s GetUsersExample
```

In the console, we will get an overview of the results and in the results directory we will have the full report in web format.

It is important to note that we could also dockerize this load tests using this [image](https://hub.docker.com/r/denvazh/gatling). It is just a matter of telling the docker file where your gatling configuration and scala files are and the image will do the rest.

