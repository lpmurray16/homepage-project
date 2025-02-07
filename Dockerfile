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

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY . .

# Build Angular application for production
RUN npm run build --prod

# Final stage for app image using nginx
FROM nginx:alpine

# Copy built Angular app to nginx's default static file directory
COPY --from=build /app/dist/homepage-project /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start nginx to serve the application
CMD ["nginx", "-g", "daemon off;"]
