# Stage 1: Build
FROM node:20-slim as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

# Add a basic nginx config if needed, or use default
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
