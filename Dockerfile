# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Adjust to your actual build command and output folder (dist or build)
RUN npm run build

# Serve with Nginx
FROM nginx:1.28.0-alpine
ARG TZ=Europe/Berlin
ENV TZ=$TZ
ENV NODE_ENV=production

# Set timezone = Europe/Berlin
RUN apk add --no-cache tzdata \
 && cp /usr/share/zoneinfo/$TZ /etc/localtime \
 && echo "$TZ" > /etc/timezone

# Copy build output (dist or build) to Nginx root
# If your React tool outputs to /app/build, change dist -> build
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
