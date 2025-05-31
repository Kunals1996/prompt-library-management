export const ERROR_MESSAGES = {
  PROMPT: {
    NOT_FOUND: 'Prompt not found',
    CREATION_FAILED: 'Error creating prompt',
    UPDATE_FAILED: 'Error updating prompt',
    DELETE_FAILED: 'Error deleting prompt',
    CLONE_FAILED: 'Error cloning prompt',
    SEARCH_FAILED: 'Error searching prompts',
    FETCH_FAILED: 'Error fetching prompts',
    INVALID_ID: 'Invalid prompt ID format',
    TITLE_REQUIRED: 'Title is required',
    BODY_REQUIRED: 'Body is required',
    CATEGORY_REQUIRED: 'Category is required',
    SEARCH_QUERY_REQUIRED: 'Search query is required'
  },
  DATABASE: {
    CONNECTION_FAILED: 'Database connection failed',
    QUERY_FAILED: 'Database query failed'
  },
  VALIDATION: {
    INVALID_MONGO_ID: 'Invalid MongoDB ObjectId format'
  }
}; 