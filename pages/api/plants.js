import fs from 'fs';
import path from 'path';
import Plant from '../../models/Plant';

const dataFilePath = path.join(process.cwd(), 'data', 'plants.json');

// Helper function to read plants from the JSON file
const readPlants = () => {
  const data = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write plants to the JSON file
const writePlants = (plants) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(plants, null, 2));
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Read and return all plants
    const plants = readPlants();
    res.status(200).json(plants);
  } else if (req.method === 'POST') {
    // Create a new plant
    const plants = readPlants();
    const newPlant = new Plant(
      Date.now(), // Unique ID
      req.body.name,
      req.body.strain,
      req.body.plantingDate,
      req.body.stage,
      req.body.notes
    );

    // Validate the new plant
    if (!newPlant.isValid()) {
      return res.status(400).json({ message: 'Invalid plant data' });
    }

    plants.push(newPlant);
    writePlants(plants);
    res.status(201).json(newPlant);
  } else if (req.method === 'PUT') {
    // Update an existing plant
    const plants = readPlants();
    const updatedPlant = req.body;

    // Find the plant by ID
    const index = plants.findIndex((plant) => plant.id === updatedPlant.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Validate the updated plant
    const plant = new Plant(
      updatedPlant.id,
      updatedPlant.name,
      updatedPlant.strain,
      updatedPlant.plantingDate,
      updatedPlant.stage,
      updatedPlant.notes
    );
    if (!plant.isValid()) {
      return res.status(400).json({ message: 'Invalid plant data' });
    }

    plants[index] = plant;
    writePlants(plants);
    res.status(200).json(plant);
  } else if (req.method === 'DELETE') {
    // Delete a plant
    const plants = readPlants();
    const plantId = parseInt(req.query.id);

    // Filter out the plant to delete
    const filteredPlants = plants.filter((plant) => plant.id !== plantId);
    if (filteredPlants.length === plants.length) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    writePlants(filteredPlants);
    res.status(200).json({ message: 'Plant deleted' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}