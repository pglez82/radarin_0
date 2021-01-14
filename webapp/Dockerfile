FROM node:12.14.1
COPY . /app
WORKDIR /app
RUN npm install http-server -g
RUN npm install
RUN npm run build
CMD http-server build