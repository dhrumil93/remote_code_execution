import { Router } from 'express';
import { generateCode, generateTest } from 'src/controller/Gemini.controller';

let router: Router = Router();

// Remain Validate code

router.route('/generate/test').post(generateTest);
router.route('/generate/code').post(generateCode);

export default router;
