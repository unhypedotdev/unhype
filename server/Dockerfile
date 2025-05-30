FROM oven/bun:latest@sha256:8b5e8d3b6a734ae438c7c6f1bdc23e54eb9c35a0e2e3099ea2ca0ef781aca23b

WORKDIR /app
COPY . .

RUN bun install --frozen-lockfile

EXPOSE 8000

CMD ["bun", "run", "start"]
