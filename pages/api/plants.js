import dbConnect from '@/lib/db';
import Plant from '../../models/Plant';
import { format } from 'date-fns';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const plants = await Plant.find();

      const formattedPlants = plants.map((plant) => ({
        ...plant.toObject(),
        plantingDate: format(new Date(plant.plantingDate), 'dd MMMM yyyy'), // Format planting date
      }));

      res.status(200).json(formattedPlants);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching plants', error });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, strain, plantingDate, stage, notes } = req.body;

      const newPlant = new Plant({
        name,
        strain,
        plantingDate: new Date(plantingDate), // Ensure valid date
        stage,
        notes,
      });

      await newPlant.save();
      res.status(201).json(newPlant);
    } catch (error) {
      res.status(400).json({ message: 'Error creating plant', error });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, name, strain, plantingDate, stage, notes } = req.body;

      const updatedPlant = await Plant.findByIdAndUpdate(
        id,
        { name, strain, plantingDate: new Date(plantingDate), stage, notes },
        { new: true }
      );

      if (!updatedPlant) return res.status(404).json({ message: 'Plant not found' });

      res.status(200).json(updatedPlant);
    } catch (error) {
      res.status(400).json({ message: 'Error updating plant', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      const deletedPlant = await Plant.findByIdAndDelete(id);
      if (!deletedPlant) return res.status(404).json({ message: 'Plant not found' });

      res.status(200).json({ message: 'Plant deleted' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting plant', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
