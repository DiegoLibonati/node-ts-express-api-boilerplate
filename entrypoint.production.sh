#!/bin/sh
set -e

if [ -z "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  npx prisma db push
else
  npm run migrate:deploy
fi

exec node dist/server.js
