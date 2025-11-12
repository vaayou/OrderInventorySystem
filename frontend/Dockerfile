# Frontend Dockerfile for production build with Vite and nginx
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

FROM nginx:alpine
# copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# copy built app (Vite outputs to /dist)
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
