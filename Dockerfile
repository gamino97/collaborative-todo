FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builderJs
WORKDIR /app/client
# pnpm fetch does require only lockfile
COPY ./client/pnpm-lock.yaml ./
RUN pnpm fetch
ADD ./client ./
RUN pnpm install -r --offline
RUN pnpm run build

FROM python:3.10.9-slim-buster AS builderPython
WORKDIR /app/server-builder
# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
# install dependencies
RUN pip install --upgrade pip
COPY ./server/requirements.txt ./requirements.txt
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/server-builder/wheels -r requirements.txt

FROM python:3.10.9-slim-buster

# create the app user
RUN addgroup --system app && adduser --system --group app

# set work directory
WORKDIR /app/server

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
COPY --from=builderPython /app/server-builder/wheels /wheels
COPY --from=builderPython /app/server-builder/requirements.txt .

# install dependencies
RUN pip install --upgrade pip
# COPY ./server/requirements.txt ./requirements.txt
# RUN pip install -r requirements.txt
RUN pip install --no-cache /wheels/*

# copy project
COPY ./server ./
COPY --from=builderJs /app/client/dist ./static
# chown all the files to the app user
RUN chown -R app:app /app/server

# change to the app user
USER app
