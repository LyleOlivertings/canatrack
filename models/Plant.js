import mongoose from 'mongoose';

const PlantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  strain: { type: String, required: true },
  plantingDate: { type: Date, required: true },
  stage: { type: String, required: true },
  notes: { type: String },
});

export default mongoose.models.Plant || mongoose.model('Plant', PlantSchema);
