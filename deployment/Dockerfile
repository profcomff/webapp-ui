FROM node:18 AS build

ARG BUILD_MODE=production
ARG LAUNCH_MODE=production
ARG APP_VERSION=dev

ENV MODE=${LAUNCH_MODE}
ENV VITE_APP_VERSION=${APP_VERSION}

WORKDIR /app
ADD ./package.json ./pnpm-lock.yaml /app/
RUN npm i -g pnpm && pnpm install
ADD . /app
RUN pnpm build --mode ${BUILD_MODE}


FROM nginx:1.21

ADD ./deployment/nginx.conf /etc/nginx/conf.d/default.conf
ADD ./deployment/docker_entrypoint.sh /docker_entrypoint.sh
COPY --from=build /app/dist /usr/share/nginx/html

RUN chmod +x /docker_entrypoint.sh && /docker_entrypoint.sh
