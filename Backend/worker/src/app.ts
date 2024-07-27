import 'dotenv/config';
import { ENV_VARIABLE } from './config/index';
import { writeData } from './middleware/Redis.middleware';
import logger from './middleware/morgan.middleware';
import { RabbitMQConnect } from './utils/RabbitMQ.util';
import path from 'path';

import { SUPPORTED_LANGUAGES, PATHS, QUEUE_NAME } from './config/index';

import * as fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import initializeRedisClient from './utils/RedisClient.util';

// Promisify exec for asynchronous execution
const execPromise = promisify(exec);

// Create an instance of RedisManager with the provided configuration
initializeRedisClient();

// Function to get the command to run code based on the language
const getRunCommand = (fileName: string, language: string): string => {
  switch (language) {
    case SUPPORTED_LANGUAGES.JAVASCRIPT:
      return `node ${PATHS.SRC}/${fileName}${SUPPORTED_LANGUAGES.JAVASCRIPT}`;
    case SUPPORTED_LANGUAGES.JAVA:
      return `java -cp ${PATHS.SRC} ${fileName}`; // Correct command for Java
    case SUPPORTED_LANGUAGES.PYTHON:
      return `python3 ${PATHS.SRC}/${fileName}${SUPPORTED_LANGUAGES.PYTHON}`;
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
};

// Function to execute the code and return the output
// const runCode = async (
//   fileName: string,
//   language: string,
// ): Promise<{ stdout?: string; err?: string }> => {
//   try {
//     return await execSync(getRunCommand(fileName, language));
//   } catch (err: any) {
//     // Specify type any to catch detailed error
//     // Use logger for better error handling and tracking
//     console.log(`${err.message} - run - for ${language} - id ${fileName}`);
//     return {
//       err: err.stderr,
//     };
//   }
// };
const runCodeInDocker = async (
  language: string,
  fileName: string,
): Promise<{ stdout?: string; err?: string }> => {
  const absolutePath = path.resolve(PATHS.SRC);
  const fileNameWithoutExtension = fileName.replace('.java', '');

  let command: string;

  switch (language) {
    case '.js':
      command = `docker run --rm -v ${absolutePath}:/usr/src/app -w /usr/src/app node:latest node ${fileName}`;
      break;
    case '.java':
      command = `
        docker run --rm -v ${absolutePath}:/usr/src/app -w /usr/src/app openjdk:latest sh -c "
          javac ${fileName} &&
          java ${fileNameWithoutExtension}"
      `;
      break;
    case '.py':
      command = `docker run --rm -v ${absolutePath}:/usr/src/app -w /usr/src/app python:latest python ${fileName}`;
      break;
    default:
      throw new Error('Unsupported language');
  }

  try {
    const { stdout, stderr } = await execPromise(command);
    if (stderr) {
      console.error(`Docker Error: ${stderr}`);
    }
    return { stdout, err: stderr };
  } catch (err: any) {
    console.error(`Error executing Docker command: ${err.message}`);
    return { err: err.message };
  }
};

const executeCodeHandler = async (eventData: {
  key: string;
  code: string;
  lang: string;
  className?: string;
}): Promise<void> => {
  try {
    const { key, code, lang, className } = eventData;

    // Validate file extension
    if (lang !== '.js' && lang !== '.java' && lang !== '.cpp') {
      console.log('Error: Please provide a valid extension');
      return;
    }

    const fileNameWithExtension =
      lang === '.java' ? `${className}${lang}` : `${key}${lang}`;

    console.log(fileNameWithExtension);

    const sourceFilePath = `${PATHS.SRC}/${fileNameWithExtension}`;

    // Create a file and store code in it
    await fs.writeFile(sourceFilePath, code, 'utf8');

    // Run the code in Docker
    const output = await runCodeInDocker(lang, fileNameWithExtension);

    console.log(output);

    // Set results in Redis
    await writeData(`submissions:${key}`, JSON.stringify(output), {
      EX: ENV_VARIABLE.CACHE_EXPIRY_SECONDS,
    });

    // Delete the source file
    // await fs.unlink(sourceFilePath);
  } catch (err) {
    console.log(`Error in code execution queue handle: ${err}`);
  }
};

// Initialize RabbitMQManager and start listening to the queue
const rabbitMQ = new RabbitMQConnect();

rabbitMQ
  .listenToQueue(executeCodeHandler)
  .then(() => {
    console.log(`Listening to queue ${QUEUE_NAME}`);
  })
  .catch((err) => {
    console.log(`${err} - Error listening to queue ${QUEUE_NAME}`);
  });

// Export the executeCodeHandler function
export default executeCodeHandler;
