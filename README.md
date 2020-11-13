# Accesso.app frontend

![Docker Image CI](![Docker Image CI](https://github.com/accesso-app/frontend/workflows/Docker%20Image%20CI/badge.svg)) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](http://prettier.io) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) [![](https://img.shields.io/badge/feature/slices-1.0-blue)](https://featureslices.dev/v1.0) [![StackShare](http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/accessoapp/frontend)

## Setup

### Env vars

- `BACKEND_URL` (server) — full url to backend API endpoint to send requests from nodejs.

Example `BACKEND_URL=https://accesso.sova.dev/api/internal`, request `/session/get` will sent to `https://accesso.sova.dev/api/internal/session/get`. If not set uses `http://localhost:9005`

- `CLIENT_BACKEND_URL` (client, build-time) — full url to backend to call from browser. By default `/api/internal`
