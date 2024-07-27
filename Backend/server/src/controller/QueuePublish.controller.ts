import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import APIError from 'src/utils/APIError.util';
import { readData } from '../middleware/Redis.middleware';
import { RabbitMQConnect } from 'src/utils/RabbitMQ.util';

// Initialize RabbitMQConnect instance
const QueueService = new RabbitMQConnect();

/**
 * Handler for executing code
 */
export const executeCode = async (req: Request, res: Response) => {
  try {
    let { code, lang, className } = req.body;

    if (lang !== '.js' && lang !== '.java' && lang !== '.py') {
      console.log('Error: Please provide a valid extension');
      return;
    }

    if (!className) className = '';

    // Validate the request body
    if (!code || !lang) {
      return res
        .status(400)
        .json(new APIError(400, 'Please provide valid parameters.'));
    }

    // Generate a unique submission ID
    const uniqueSubmissionId = uuidv4();

    // Publish code to the queue
    await QueueService.publish({
      code,
      key: uniqueSubmissionId,
      lang,
      className,
    });

    // Respond with the unique key and language
    return res.json({
      key: uniqueSubmissionId,
      lang,
      className,
    });
  } catch (error) {
    console.error('Error executing code:', error);
    return res.status(500).json(new APIError(500, 'Internal Server Error'));
  }
};

/**
 * Handler for getting submission results
 */
export const getSubmission = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.body;

    // Read data from Redis
    const value = await readData(`submissions:${submissionId}`);

    // Check if the submission was found
    if (value === null || value === undefined) {
      return res
        .status(404)
        .json(new APIError(404, `Submission Id ${submissionId} not found.`));
    }

    // Respond with the submission data
    return res.send(value);
  } catch (error) {
    console.error('Error retrieving submission:', error);
    return res.status(500).json(new APIError(500, 'Internal Server Error'));
  }
};
