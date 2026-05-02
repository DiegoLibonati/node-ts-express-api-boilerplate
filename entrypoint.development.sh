#!/bin/sh
set -e

if [ -z "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  npx prisma migrate dev --name init
else
  npx prisma migrate deploy
fi

exec npm run dev
