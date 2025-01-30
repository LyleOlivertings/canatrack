import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  strain: { type: String, required: true },
  plantingDate: { type: Date, required: true },
  stage: {
    type: String,
    enum: ['Seedling', 'Vegetative', 'Flowering', 'Harvested'],
    required: true
  },
  timeline: [{
    date: { type: Date, required: true },
    event: { type: String, required: true },
    notes: String
  }],
  notes: String
});

export default mongoose.models.Plant || mongoose.model('Plant', plantSchema);