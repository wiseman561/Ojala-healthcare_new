FROM node:18-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-slim AS runtime
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
EXPOSE 80
CMD ["npx", "serve", "-s", "build", "-l", "80"]
