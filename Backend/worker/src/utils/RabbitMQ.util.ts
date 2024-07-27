import amqp, { Connection, Channel } from 'amqplib';
import logger from './logger.util';

const QUEUE_NAME: string = 'CODE_EXECUTION_ENGINE';

interface CodeData {
  code: string;
  lang: string;
  key: string;
  className?: string;
}

export class RabbitMQConnect {
  private connection!: Connection;
  private channel!: Channel;

  // Connect to RabbitMQ
  async connectQueue() {
    try {
      this.connection = await amqp.connect({
        hostname: process.env.RABBITMQ_HOST || 'rabbitmq', // Ensure this is 'rabbitmq'
        password: process.env.QUEUE_USER_PASSWORD || 'guest',
        port: Number(process.env.QUEUE_PORT) || 5672,
        username: process.env.QUEUE_USER_NAME || 'guest',
      });
      logger.info('RabbitMQ Connected Successfully');
      return this.connection;
    } catch (error) {
      console.error('RabbitMQ Connection Error:', error);
      throw new Error('Failed to connect to RabbitMQ');
    }
  }

  // Create a channel if it doesn't already exist
  async createChannel() {
    if (!this.connection) {
      throw new Error('RabbitMQ connection is not established');
    }

    if (!this.channel) {
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(QUEUE_NAME, { durable: true });
      logger.info('RabbitMQ Channel Created and Queue Asserted');
    }

    return this.channel;
  }

  // Publish a message to the queue
  async publish(code: CodeData) {
    if (!this.channel) {
      await this.connectQueue(); // Ensure connection
      await this.createChannel(); // Ensure channel is created
    }

    try {
      const bufferMessage = Buffer.from(JSON.stringify(code));
      const success = this.channel.sendToQueue(QUEUE_NAME, bufferMessage, {
        persistent: true,
      });

      console.log(success);

      if (!success) {
        throw new Error('Message not sent to queue');
      }

      logger.info('Message sent to queue:', code);
    } catch (error) {
      console.error('Error sending message to RabbitMQ:', error);
      throw error;
    }
  }

  // Consume messages from the queue
  async consumeCode(callback: (content: CodeData) => void) {
    if (!this.channel) {
      await this.connectQueue(); // Ensure connection
      await this.createChannel(); // Ensure channel is created
    }

    try {
      await this.channel.consume(QUEUE_NAME, (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          console.log(content);
          callback(content);
          this.channel.ack(message);
          logger.info('Message consumed and acknowledged:', content);
        }
      });
    } catch (error) {
      console.error('Error consuming message from RabbitMQ:', error);
      throw error;
    }
  }

  async declareQueue() {
    if (this.channel === null) {
      throw new Error('Channel is required first to create a queue');
    }
    await this.channel.assertQueue(QUEUE_NAME, { durable: true });
  }

  // Listen to the queue (for consumers)
  async listenToQueue(handler: (content: CodeData) => void) {
    if (this.connection === null) {
      console.log('here');
      await this.connectQueue();
      await this.createChannel();
      await this.declareQueue();
      // await this.consumeCode(handler);
    }
    await this.consumeCode(handler);
  }
}
