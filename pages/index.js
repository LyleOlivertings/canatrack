import { useState, useEffect } from 'react';

export default function Home() {
  const [plants, setPlants] = useState([]);
  const [name, setName] = useState('');
  const [strain, setStrain] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [stage, setStage] = useState('Seedling');
  const [notes, setNotes] = useState('');
  const [editPlantId, setEditPlantId] = useState(null);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    const response = await fetch('/api/plants');
    const data = await response.json();
    setPlants(data);
  };

  const addOrUpdatePlant = async () => {
    const method = editPlantId ? 'PUT' : 'POST';
    const body = {
      id: editPlantId,
      name,
      strain,
      plantingDate,
      stage,
      notes,
    };

    const response = await fetch('/api/plants', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      await fetchPlants();
      resetForm();
    }
  };

  const deletePlant = async (id) => {
    await fetch(`/api/plants?id=${id}`, { method: 'DELETE' });
    fetchPlants();
  };

  const resetForm = () => {
    setName('');
    setStrain('');
    setPlantingDate('');
    setStage('Seedling');
    setNotes('');
    setEditPlantId(null);
  };

  const handleEdit = (plant) => {
    setName(plant.name);
    setStrain(plant.strain);
    setPlantingDate(plant.plantingDate); // Already formatted
    setStage(plant.stage);
    setNotes(plant.notes);
    setEditPlantId(plant._id);
  };

  return (
    <div className="min-h-screen bg-green-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🌱 My Plants</h1>
        <form className="bg-white p-6 rounded shadow-md mb-8 space-y-4">
          <h2 className="text-2xl font-semibold">{editPlantId ? 'Edit Plant' : 'Add a New Plant'}</h2>
          <input
            type="text"
            placeholder="Plant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Strain"
            value={strain}
            onChange={(e) => setStrain(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            value={plantingDate}
            onChange={(e) => setPlantingDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={addOrUpdatePlant}
            className="w-full bg-green-500 text-white p-2 rounded"
          >
            {editPlantId ? 'Update Plant' : 'Add Plant'}
          </button>
        </form>

        <div className="space-y-4">
          {plants.map((plant) => (
            <div key={plant._id} className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold">{plant.name}</h2>
              <p><strong>Strain:</strong> {plant.strain}</p>
              <p><strong>Planted on:</strong> {plant.plantingDate}</p>
              <p><strong>Stage:</strong> {plant.stage}</p>
              <p><strong>Notes:</strong> {plant.notes}</p>
              <div className="mt-4 flex space-x-2">
                <button onClick={() => handleEdit(plant)} className="bg-blue-500 text-white p-2 rounded">Edit</button>
                <button onClick={() => deletePlant(plant._id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
