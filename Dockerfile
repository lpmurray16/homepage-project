# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.11.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of the final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install Angular CLI globally
RUN npm install -g @angular/cli@16.2.0

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci

# Copy application code
COPY . .

# Build Angular application for production
RUN ng build --configuration production

# Install http-server to serve the Angular app
RUN npm install -g http-server

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start http-server to serve the built app
CMD ["http-server", "dist/homepage-project", "-p", "80", "-a", "0.0.0.0"]
