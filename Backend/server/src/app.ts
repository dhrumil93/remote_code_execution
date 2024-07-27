import express, { Application } from 'express';
import { RabbitMQConnect } from './utils/RabbitMQ.util';
import initializeRedisClient from './utils/RedisClient.util';
import CodeRoute from './routes/Server.routes';
import GeminiRoute from './routes/Gemini.routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';

class ExpressServerInstance {
  private app: Application;
  private rabbitClient: any; // Consider using a more specific type here if possible
  private port = process.env.PORT || 3008;

  constructor() {
    this.app = express();
    this.app.use(
      cors({
        origin: ["http://localhost:5173","*"],
      }),
    );

    // Initialize RabbitMQ Client
    this.rabbitClient = new RabbitMQConnect();

    // Middleware to parse JSON bodies with a limit of 18kb
    this.app.use(express.json({ limit: '18kb' }));

    // Middleware to parse URL-encoded data
    this.app.use(express.urlencoded({ extended: true }));

    // Middleware to parse cookies
    this.app.use(cookieParser());

    // Register routes
    this.app.use('/api/v1', CodeRoute);
    this.app.use('/api/v1/gemini', GeminiRoute);
  }

  // Initialize services like RabbitMQ and Redis
  private async initializeService() {
    try {
      await this.rabbitClient.connectQueue();
      await initializeRedisClient();
    } catch (error) {
      console.error('Error initializing services:', error);
      process.exit(1); // Exit the process if initialization fails
    }
  }

  // Start the Express server
  public startServer() {
    this.initializeService().then(() => {
      this.app.listen(this.port, () => {
        console.log(`⚡Server is Running on PORT ${this.port}`);
      });
    });
  }
}

export default ExpressServerInstance;
