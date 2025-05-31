import { Request, Response, NextFunction } from 'express';
import { PromptService } from '../services/prompt.service';
import logger from '../utils/logger';
import mongoose from 'mongoose';
import { ERROR_MESSAGES } from '../constants/errorMessages';
import { throwError } from '../utils/errors';

const promptService = new PromptService();

export class PromptController {
  async createPrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const prompt = await promptService.createPrompt(req.body);
      logger.info('Created prompt with full content:', {
        id: prompt._id,
        title: prompt.title,
        fullBody: prompt.body,
        bodyLength: prompt.body.length
      });
      res.status(201).json(prompt);
    } catch (error) {
      next(error);
    }
  }

  async getAllPrompts(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.query;
      const prompts = await promptService.getAllPrompts(category as string);
      res.json(prompts);
    } catch (error) {
      next(error);
    }
  }

  async getPromptById(req: Request, res: Response, next: NextFunction) {
    try {
      const prompt = await promptService.getPromptById(req.params.id);
      if (!prompt) {
        throwError.notFound(ERROR_MESSAGES.PROMPT.NOT_FOUND);
      }
      
      const safePrompt = prompt!; // Type assertion after null check
      logger.info('Retrieved prompt with full content:', {
        id: safePrompt._id,
        title: safePrompt.title,
        fullBody: safePrompt.body,
        bodyLength: safePrompt.body.length
      });
      res.json(safePrompt);
    } catch (error) {
      next(error);
    }
  }

  async updatePrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const prompt = await promptService.updatePrompt(req.params.id, req.body);
      if (!prompt) {
        throwError.notFound(ERROR_MESSAGES.PROMPT.NOT_FOUND);
      }
      res.json(prompt);
    } catch (error) {
      next(error);
    }
  }

  async deletePrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const prompt = await promptService.deletePrompt(req.params.id);
      if (!prompt) {
        throwError.notFound(ERROR_MESSAGES.PROMPT.NOT_FOUND);
      }
      res.json({ message: 'Prompt deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async searchPrompts(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query;
      if (!q) {
        throwError.validation(ERROR_MESSAGES.PROMPT.SEARCH_QUERY_REQUIRED);
      }
      const prompts = await promptService.searchPrompts(q as string);
      res.json(prompts);
    } catch (error) {
      next(error);
    }
  }

  async getRecentPrompts(req: Request, res: Response, next: NextFunction) {
    try {
      const prompts = await promptService.getRecentPrompts();
      res.json(prompts);
    } catch (error) {
      next(error);
    }
  }

  async clonePrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throwError.validation(ERROR_MESSAGES.PROMPT.INVALID_ID);
      }

      const { title } = req.body;
      if (!title) {
        throwError.validation(ERROR_MESSAGES.PROMPT.TITLE_REQUIRED);
      }

      const clonedPrompt = await promptService.clonePrompt(id, title);
      if (!clonedPrompt) {
        throwError.notFound(ERROR_MESSAGES.PROMPT.NOT_FOUND);
      }

      const safeClonedPrompt = clonedPrompt!; // Type assertion after null check
      logger.info('Cloned prompt with full content:', {
        sourceId: id,
        newId: safeClonedPrompt._id,
        title: safeClonedPrompt.title,
        fullBody: safeClonedPrompt.body,
        bodyLength: safeClonedPrompt.body.length
      });
      
      res.status(201).json({
        success: true,
        message: 'Prompt cloned successfully',
        data: safeClonedPrompt
      });
    } catch (error) {
      next(error);
    }
  }
} 