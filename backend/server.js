import app from './app.js';
import { connectDb } from './src/config/db.js';

const PORT = Number(process.env.PORT || 5000);
const HOST = process.env.HOST || '127.0.0.1';

async function start() {
  await connectDb();
  app.listen(PORT, HOST, () => {
    console.log(`SIH DoCA backend running at http://${HOST}:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
