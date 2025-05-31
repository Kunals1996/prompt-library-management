import { Router, Request, Response, NextFunction } from 'express';
import { PromptController } from '../controllers/prompt.controller';
import { validateMongoId } from '../utils/validation';

const router = Router();
const controller = new PromptController();

// Search endpoint
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  await controller.searchPrompts(req, res, next);
});

// Recent prompts endpoint
router.get('/recent', async (req: Request, res: Response, next: NextFunction) => {
  await controller.getRecentPrompts(req, res, next);
});

// Clone endpoint
router.post('/:id/clone', validateMongoId, async (req: Request, res: Response, next: NextFunction) => {
  await controller.clonePrompt(req, res, next);
});

// CRUD operations
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  await controller.createPrompt(req, res, next);
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  await controller.getAllPrompts(req, res, next);
});

router.get('/:id', validateMongoId, async (req: Request, res: Response, next: NextFunction) => {
  await controller.getPromptById(req, res, next);
});

router.put('/:id', validateMongoId, async (req: Request, res: Response, next: NextFunction) => {
  await controller.updatePrompt(req, res, next);
});

router.delete('/:id', validateMongoId, async (req: Request, res: Response, next: NextFunction) => {
  await controller.deletePrompt(req, res, next);
});

export default router;
