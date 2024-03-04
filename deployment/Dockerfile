FROM oven/bun:1 AS build

ARG BUILD_MODE=production
ARG LAUNCH_MODE=production
ARG APP_VERSION=dev

ENV MODE=${LAUNCH_MODE}
ENV VITE_APP_VERSION=${APP_VERSION}

WORKDIR /app
ADD ./package.json ./bun.lockb /app/
RUN bun install
ADD . /app
RUN bun run build --mode ${BUILD_MODE}


FROM nginx:1.21

ADD ./deployment/nginx.conf /etc/nginx/conf.d/default.conf
ADD ./deployment/docker_entrypoint.sh /etc/docker_entrypoint.sh
COPY --from=build /app/dist /usr/share/nginx/html

RUN ls
RUN chmod -R 777 /etc/docker_entrypoint.sh
RUN /etc/docker_entrypoint.sh
