import { Router } from 'express';
import {
  executeCode,
  getSubmission,
} from 'src/controller/QueuePublish.controller';

let router: Router = Router();

// Remain Validate code
router.route('/execute').post(executeCode);
router.route('/submission/output').post(getSubmission);

router.route('/health').get((req, res) => res.send('Server is Running'));

export default router;
