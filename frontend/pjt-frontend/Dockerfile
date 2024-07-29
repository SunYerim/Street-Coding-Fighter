# base image
FROM node:20.15.0-alpine AS build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# add app
COPY . ./

# build app
RUN npm run build

# stage to copy the build output to
FROM alpine:latest
WORKDIR /app
COPY --from=build /app/build /app/build

# expose build directory to the host
VOLUME /app/build
