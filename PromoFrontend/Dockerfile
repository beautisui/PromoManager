FROM node:24 As build

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

COPY .env.docker .env

RUN npm run build && ls -la /app/dist

FROM nginx:alpine

# Remove existing default NGINX config if it conflicts (good practice)
RUN rm /etc/nginx/conf.d/default.conf || true # `|| true` to prevent error if file doesn't exist

# Copy your custom NGINX configuration file
# Make sure nginx.conf is in the same directory as your Dockerfile,
# or adjust the source path (e.g., `COPY ./nginx/nginx.conf ...`)
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Clear default html (optional, but ensures only your app is served)
RUN rm -rf /usr/share/nginx/html/*

COPY  --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]