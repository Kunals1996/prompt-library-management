import mongoose, { Document, Schema } from 'mongoose';

export interface IPrompt extends Document {
  title: string;
  body: string;
  category: string;
  created_by: string;
  last_updated: Date;
}

const promptSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true // for faster text search
  },
  body: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true // for faster category filtering
  },
  created_by: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: { 
    createdAt: true,
    updatedAt: 'last_updated'
  },
  collection: 'prompts' // explicitly setting collection name
});

// Create text index for fuzzy search on title
promptSchema.index({ title: 'text' });

export default mongoose.model<IPrompt>('Prompt', promptSchema); 