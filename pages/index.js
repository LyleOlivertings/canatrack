import { useState, useEffect } from 'react';

export default function Home() {
  const [plants, setPlants] = useState([]);
  const [name, setName] = useState('');
  const [strain, setStrain] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [stage, setStage] = useState('Seedling');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetch('/api/plants')
      .then((res) => res.json())
      .then((data) => setPlants(data));
  }, []);

  const addPlant = async () => {
    const response = await fetch('/api/plants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, strain, plantingDate, stage, notes }),
    });
    const newPlant = await response.json();
    setPlants([...plants, newPlant]);
    setName('');
    setStrain('');
    setPlantingDate('');
    setStage('Seedling');
    setNotes('');
  };

  return (
    <div className="min-h-screen bg-green-theme-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-theme-900 mb-8">
          🌱 My Cannabis Plants
        </h1>

        {/* Add Plant Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-green-theme-800 mb-4">
            Add a New Plant
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Plant Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-green-theme-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-theme-500"
            />
            <input
              type="text"
              placeholder="Strain"
              value={strain}
              onChange={(e) => setStrain(e.target.value)}
              className="w-full p-2 border border-green-theme-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-theme-500"
            />
            <input
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className="w-full p-2 border border-green-theme-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-theme-500"
            />
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full p-2 border border-green-theme-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-theme-500"
            >
              <option value="Seedling">Seedling</option>
              <option value="Vegetative">Vegetative</option>
              <option value="Flowering">Flowering</option>
              <option value="Harvested">Harvested</option>
            </select>
            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-green-theme-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-theme-500"
            />
            <button
              onClick={addPlant}
              className="w-full bg-green-theme-500 text-white py-2 rounded-lg hover:bg-green-theme-600 transition duration-200"
            >
              Add Plant
            </button>
          </div>
        </div>

        {/* Plant List */}
        <div className="space-y-4">
          {plants.map((plant) => (
            <div
              key={plant.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold text-green-theme-800">
                {plant.name}
              </h2>
              <p className="text-green-theme-700">
                <span className="font-medium">Strain:</span> {plant.strain}
              </p>
              <p className="text-green-theme-700">
                <span className="font-medium">Planted on:</span> {plant.plantingDate}
              </p>
              <p className="text-green-theme-700">
                <span className="font-medium">Stage:</span> {plant.stage}
              </p>
              <p className="text-green-theme-700">
                <span className="font-medium">Notes:</span> {plant.notes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}