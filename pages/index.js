import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Home() {
  const [plants, setPlants] = useState([]);
  const [name, setName] = useState('');
  const [strain, setStrain] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [stage, setStage] = useState('Seedling');
  const [notes, setNotes] = useState('');
  const [editPlantId, setEditPlantId] = useState(null);
  const [timelineDate, setTimelineDate] = useState(new Date());
  const [timelineEvent, setTimelineEvent] = useState('');
  const [timelineNotes, setTimelineNotes] = useState('');

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
    setPlantingDate(plant.plantingDate);
    setStage(plant.stage);
    setNotes(plant.notes);
    setEditPlantId(plant._id);
  };

  const addTimelineEvent = async (plantId) => {
    const response = await fetch(`/api/plants/${plantId}/timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: timelineDate,
        event: timelineEvent,
        notes: timelineNotes
      })
    });

    if (response.ok) {
      fetchPlants();
      setTimelineDate(new Date());
      setTimelineEvent('');
      setTimelineNotes('');
    }
  };

  return (
    <div className="min-h-screen bg-green-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🌱 My Plants</h1>
        
        {/* Add/Edit Plant Form */}
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
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
          >
            {editPlantId ? 'Update Plant' : 'Add Plant'}
          </button>
        </form>

        {/* Plants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plants.map((plant) => (
            <div key={plant._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col">
              {/* Plant Details */}
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{plant.name}</h2>
                <div className="space-y-1 mb-4">
                  <p><span className="font-semibold">Strain:</span> {plant.strain}</p>
                  <p><span className="font-semibold">Planted:</span> {new Date(plant.plantingDate).toLocaleDateString()}</p>
                  <p><span className="font-semibold">Stage:</span> {plant.stage}</p>
                  {plant.notes && <p><span className="font-semibold">Notes:</span> {plant.notes}</p>}
                </div>

                {/* Timeline Section */}
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-semibold mb-2">Growth Timeline</h3>
                  
                  {/* Timeline Input */}
                  <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                    <DatePicker
                      selected={timelineDate}
                      onChange={date => setTimelineDate(date)}
                      className="w-full mb-2 p-1 border rounded text-sm"
                    />
                    <input
                      type="text"
                      value={timelineEvent}
                      onChange={e => setTimelineEvent(e.target.value)}
                      placeholder="Event name"
                      className="w-full mb-2 p-1 border rounded text-sm"
                    />
                    <textarea
                      value={timelineNotes}
                      onChange={e => setTimelineNotes(e.target.value)}
                      placeholder="Event notes"
                      className="w-full p-1 border rounded text-sm"
                      rows="2"
                    />
                    <button
                      onClick={() => addTimelineEvent(plant._id)}
                      className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                    >
                      Add Event
                    </button>
                  </div>

                  {/* Timeline Events */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {plant.timeline?.map((event, index) => (
                      <div key={index} className="border-l-2 border-green-500 pl-2 text-sm">
                        <p className="font-medium">{event.event}</p>
                        <p className="text-gray-600 text-xs">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                        {event.notes && <p className="text-gray-700 text-xs mt-1">{event.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t flex space-x-2">
                <button
                  onClick={() => handleEdit(plant)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePlant(plant._id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}