# Deploy Setup for Realtime Whiteboard

## Recommended architecture

- Backend: Render or Railway
- Frontend: Vercel
- Database: MongoDB Atlas

## Backend deployment (Render / Railway)

1. Push this repo to GitHub.
2. Create a new backend service on Render or Railway.
3. Set the build/start command:
   - Render: `npm install` then `npm start`
   - Railway: default Node start command is usually `npm start`
4. Add production environment variables exactly like this:

   MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/realtime_whiteboard?retryWrites=true&w=majority
   JWT_SECRET=replace_with_a_secure_32_plus_character_secret
   PORT=5000
   ALLOWED_ORIGINS=https://realtime-whiteboard.vercel.app,http://localhost:3000,http://localhost:5173

5. Use the generated backend host URL exactly as provided by the platform.

   Example backend URLs:
   - Render: `https://realtime-whiteboard-api.onrender.com`
   - Railway: `https://realtime-whiteboard-api.up.railway.app`

## Frontend deployment (Vercel)

1. In the `whiteboard` folder, create a Vercel project.
2. Set the frontend environment variables:

   VITE_API_URL=https://realtime-whiteboard-api.onrender.com
   VITE_SOCKET_URL=https://realtime-whiteboard-api.onrender.com

3. If you choose Railway instead of Render, replace the value with the Railway URL.

## CORS and Socket.IO rules

The backend only accepts the origins listed in `ALLOWED_ORIGINS`.
That list must include the Vercel frontend URL exactly.

This app must not be deployed with the root Vercel serverless backend pattern because it uses Socket.IO and a long-lived Node server.

## Required production rules

- Do not deploy the backend on Vercel serverless.
- Keep the backend on Render or Railway.
- Keep the frontend on Vercel.
- Whitelist the backend host IP in MongoDB Atlas.
- Restart the backend if the port is already in use locally: `EADDRINUSE` on port `5000` means another Node process is running.
