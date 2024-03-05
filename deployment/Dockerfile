# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
COPY . /app
WORKDIR /app

ARG BUILD_MODE=production
ARG LAUNCH_MODE=production
ARG APP_VERSION=dev

ENV MODE=${LAUNCH_MODE}
ENV VITE_APP_VERSION=${APP_VERSION}

FROM base AS prod-deps
RUN --mount=type=cache,id=bun,target=/bun/store bun install --frozen-lockfile --production

FROM base AS build
RUN --mount=type=cache,id=bun,target=/bun/store bun install --frozen-lockfile
RUN bun run build --mode ${BUILD_MODE}


FROM nginx:1.21

ADD ./deployment/nginx.conf /etc/nginx/conf.d/default.conf
ADD ./deployment/docker_entrypoint.sh /docker_entrypoint.sh
COPY --from=build /app/dist /usr/share/nginx/html

RUN chmod +x /docker_entrypoint.sh
RUN /docker_entrypoint.sh
