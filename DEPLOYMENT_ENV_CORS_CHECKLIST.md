# Deployment Env and CORS Checklist

This consolidates the deployment guidance and command flow you shared, in a corrected and copy-safe format.

## Frontend production env (Vite)

File path:
- /home/apps/mrwashwala/client/.env.production

Expected:

VITE_API_URL=https://mrwashwala.com
VITE_UPI_ID=9008433284@ybl

If .env.production previously contained localhost values such as:

VITE_API_URL=http://localhost:5005

that is incorrect for production.

## Backend production env

File path:
- /home/apps/mrwashwala/server/.env

Example keys:

PORT=5005
NODE_ENV=production
FRONTEND_URL=https://mrwashwala.com
FRONTEND_URLS=https://mrwashwala.com,https://www.mrwashwala.com
MONGO_URI=...
EMAIL_USER=...
EMAIL_PASS=...

## Required rebuild behavior

Vite embeds VITE_ values at build time. After changing frontend env:

1. cd /home/apps/mrwashwala/client
2. npm run build
3. pm2 restart mrwashwala-client

For backend env changes:

1. cd /home/apps/mrwashwala/server
2. pm2 restart mrwashwala-backend --update-env

## Verify frontend build is using correct API URL

Run:

grep -R "localhost:5005" dist

grep -R "mrwashwala.com" dist

Expected:
- No output for localhost:5005
- Output containing https://mrwashwala.com

## Validate API and CORS

Run:

curl https://mrwashwala.com/api/test
curl https://mrwashwala.com/api/services
curl -I -H "Origin: https://www.mrwashwala.com" https://mrwashwala.com/api/services

Expected CORS header should include:
- Access-Control-Allow-Origin: https://www.mrwashwala.com

If missing, inspect:
- Express CORS allowlist/env parsing
- Nginx site config and /api proxy block

## Nginx check

Inspect:

cat /etc/nginx/sites-available/mrwashwala.com

Focus on location /api behavior and forwarded headers.

## Safe update flow

Backend:
1. cd /home/apps/mrwashwala/server
2. nano .env
3. pm2 restart mrwashwala-backend --update-env

Frontend:
1. cd /home/apps/mrwashwala/client
2. nano .env.production
3. npm run build
4. pm2 restart mrwashwala-client

## Notes

- Browser CORS errors usually indicate the frontend reached the backend URL, but the backend (or proxy) rejected the origin.
- Restarting PM2 alone does not refresh Vite env values already baked into dist assets.
- The original pasted snippets had some line-merge and escaping artifacts; this file keeps the corrected command forms.
