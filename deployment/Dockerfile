FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

ARG BUILD_MODE=production
ARG LAUNCH_MODE=production
ARG APP_VERSION=dev

ENV MODE=${LAUNCH_MODE}
ENV VITE_APP_VERSION=${APP_VERSION}

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build --mode ${BUILD_MODE}


FROM nginx:1.21

ADD ./deployment/nginx.conf /etc/nginx/conf.d/default.conf
ADD ./deployment/docker_entrypoint.sh /docker_entrypoint.sh
COPY --from=build /app/dist /usr/share/nginx/html

RUN chmod +x /docker_entrypoint.sh
RUN /docker_entrypoint.sh
