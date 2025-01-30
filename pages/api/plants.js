import dbConnect from '@/lib/db';
import Plant from '../../models/Plant';


export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    // Fetch all plants
    try {
      const plants = await Plant.find({});
      res.status(200).json(plants);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching plants', error });
    }
  } else if (req.method === 'POST') {
    
    // Create a new plant
    try {
      const newPlant = new Plant(req.body);
      await newPlant.save();
      res.status(201).json(newPlant);
    } catch (error) {
      res.status(400).json({ message: 'Invalid plant data', error });
    }
  } else if (req.method === 'PUT') {
    // Update an existing plant
    try {
      const updatedPlant = await Plant.findByIdAndUpdate(
        req.body.id,
        req.body,
        { new: true }
      );
      if (!updatedPlant) {
        return res.status(404).json({ message: 'Plant not found' });
      }
      res.status(200).json(updatedPlant);
    } catch (error) {
      res.status(400).json({ message: 'Error updating plant', error });
    }
  } else if (req.method === 'DELETE') {
    // Delete a plant
    try {
      const deletedPlant = await Plant.findByIdAndDelete(req.query.id);
      if (!deletedPlant) {
        return res.status(404).json({ message: 'Plant not found' });
      }
      res.status(200).json({ message: 'Plant deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting plant', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}