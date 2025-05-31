import { Prompt } from '../models';
import { IPrompt } from '../models/prompt.model';
import logger from '../utils/logger';

export class PromptService {
  async createPrompt(promptData: Partial<IPrompt>): Promise<IPrompt> {
    logger.debug('Creating new prompt', { data: promptData });
    const prompt = new Prompt(promptData);
    const result = await prompt.save();
    logger.info('Prompt created successfully', { id: result._id });
    return result;
  }

  async getAllPrompts(category?: string): Promise<IPrompt[]> {
    logger.debug('Fetching all prompts', { category });
    const query = category ? { category } : {};
    const prompts = await Prompt.find(query);
    logger.info('Prompts fetched successfully', { count: prompts.length });
    return prompts;
  }

  async getPromptById(id: string): Promise<IPrompt | null> {
    logger.debug('Fetching prompt by id', { id });
    const prompt = await Prompt.findById(id);
    if (!prompt) {
      logger.warn('Prompt not found', { id });
    }
    return prompt;
  }

  async updatePrompt(id: string, promptData: Partial<IPrompt>): Promise<IPrompt | null> {
    logger.debug('Updating prompt', { id, data: promptData });
    const prompt = await Prompt.findByIdAndUpdate(
      id, 
      promptData,
      { new: true }
    );
    if (!prompt) {
      logger.warn('Prompt not found for update', { id });
    } else {
      logger.info('Prompt updated successfully', { id });
    }
    return prompt;
  }

  async deletePrompt(id: string): Promise<IPrompt | null> {
    logger.debug('Deleting prompt', { id });
    const prompt = await Prompt.findByIdAndDelete(id);
    if (!prompt) {
      logger.warn('Prompt not found for deletion', { id });
    } else {
      logger.info('Prompt deleted successfully', { id });
    }
    return prompt;
  }

  async searchPrompts(searchTerm: string): Promise<IPrompt[]> {
    logger.debug('Fuzzy searching prompts (Atlas)', { searchTerm });

    const prompts = await Prompt.aggregate([
      {
        $search: {
          index: 'prompts_title',
          text: {
            query: searchTerm,
            path: 'title',
            fuzzy: {
              maxEdits: 2,
              prefixLength: 1
            }
          }
        }
      },
      {
        $limit: 5
      }
    ]);

    logger.info('Fuzzy search completed', { count: prompts.length });
    return prompts;
  }


  async getRecentPrompts(limit: number = 5): Promise<IPrompt[]> {
    logger.debug('Fetching recent prompts', { limit });
    const prompts = await Prompt.find()
      .sort({ last_updated: -1 })
      .limit(limit);
    logger.info('Recent prompts fetched successfully', { count: prompts.length });
    return prompts;
  }

  async clonePrompt(id: string, newTitle: string): Promise<IPrompt | null> {
    logger.debug('Cloning prompt', { sourceId: id, newTitle });
    
    const sourcePrompt = await Prompt.findById(id);
    if (!sourcePrompt) {
      logger.warn('Source prompt not found for cloning', { id });
      return null;
    }

    const clonedPrompt = new Prompt({
      title: newTitle,
      body: sourcePrompt.body,
      category: sourcePrompt.category,
      created_by: sourcePrompt.created_by
    });

    const result = await clonedPrompt.save();
    logger.info('Prompt cloned successfully', { 
      sourceId: id, 
      newId: result._id,
      newTitle 
    });
    
    return result;
  }
} 