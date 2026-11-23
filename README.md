# Realtime Whiteboard

## Run locally

1. Start the API from the repository root with `npm start`.
2. Copy `whiteboard/.env.example` to `whiteboard/.env` and adjust `VITE_API_URL` if needed.
3. Start the React client:

   ```bash
   cd whiteboard
   npm install
   npm run dev
   ```

The client includes authentication, canvas management, drawing tools, undo/redo,
sharing, persistence, and real-time updates through Socket.IO.