# Prompt Library Management System

A TypeScript-based REST API for managing and organizing prompts with features like categorization, search, and cloning.

## Features

- ✨ CRUD operations for prompts
- 🔍 Fuzzy search on prompt titles
- 🏷️ Category-based filtering
- 📋 Prompt cloning capability
- 📝 Recent prompts tracking
- 🚀 RESTful API design
- 🔒 Input validation
- 📊 Proper error handling
- 📝 Comprehensive logging

## Technologies

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **Libraries**:
  - `mongoose` - MongoDB ODM
  - `winston` - Logging
  - `express` - Web framework
  - Other utilities for validation and error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or MongoDB Atlas account)
- npm or yarn package manager

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kunals1996/prompt-library-management.git
   cd prompt-library-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add the following configurations:
     ```env
     PORT=3000
     MONGODB_URI=your_mongodb_connection_string
     NODE_ENV=development
     ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   npm start
   ```

## API Endpoints

### Prompts
- `GET /prompts` - Get all prompts
- `GET /prompts/:id` - Get a specific prompt
- `POST /prompts` - Create a new prompt
- `PUT /prompts/:id` - Update a prompt
- `DELETE /prompts/:id` - Delete a prompt

### Special Operations
- `GET /prompts/search?q=query` - Search prompts
- `GET /prompts/recent` - Get recent prompts
- `POST /prompts/:id/clone` - Clone a prompt

## Request/Response Format

### Create/Update Prompt
```json
{
  "title": "Example Prompt",
  "body": "Prompt content",
  "category": "general"
}
```

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": "...",
    "title": "Example Prompt",
    "body": "Prompt content",
    "category": "general",
    "created_at": "2024-...",
    "updated_at": "2024-..."
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

## Error Handling

The system implements a centralized error handling mechanism with:
- Custom error classes
- HTTP status code mapping
- Consistent error response format
- Detailed logging

## Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server
- `npm run lint` - Run linting
- `npm test` - Run tests (when implemented)

### Project Structure
```
src/
├── app.ts              # Application entry point
├── routes/            # Route definitions
├── controllers/       # Request handlers
├── services/         # Business logic
├── models/           # Database models
├── middleware/       # Express middleware
├── utils/           # Utility functions
└── constants/       # Constants and configurations
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 