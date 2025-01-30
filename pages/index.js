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
      <div className="max-w-4xl mx-auto">
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
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            {editPlantId ? 'Update Plant' : 'Add Plant'}
          </button>
        </form>

        {/* Plants List */}
        <div className="space-y-4">
          {plants.map((plant) => (
            <div key={plant._id} className="bg-white p-6 rounded shadow">
              {/* Plant Details */}
              <h2 className="text-xl font-bold">{plant.name}</h2>
              <p><strong>Strain:</strong> {plant.strain}</p>
              <p><strong>Planted on:</strong> {new Date(plant.plantingDate).toLocaleDateString()}</p>
              <p><strong>Stage:</strong> {plant.stage}</p>
              <p><strong>Notes:</strong> {plant.notes}</p>

              {/* Timeline Section */}
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Growth Timeline</h3>
                
                {/* Add Timeline Event */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Event Date</label>
                      <DatePicker
                        selected={timelineDate}
                        onChange={date => setTimelineDate(date)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Event Type</label>
                      <input
                        type="text"
                        value={timelineEvent}
                        onChange={e => setTimelineEvent(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="e.g., Watering, Pruning"
                      />
                    </div>
                  </div>
                  <textarea
                    value={timelineNotes}
                    onChange={e => setTimelineNotes(e.target.value)}
                    className="w-full mt-4 p-2 border rounded"
                    placeholder="Event notes"
                    rows="2"
                  />
                  <button
                    onClick={() => addTimelineEvent(plant._id)}
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add Timeline Event
                  </button>
                </div>

                {/* Display Timeline Events */}
                <div className="space-y-4">
                  {plant.timeline?.map((event, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{event.event}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                          {event.notes && <p className="mt-1 text-gray-700">{event.notes}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit/Delete Buttons */}
              <div className="mt-4 flex space-x-2">
                <button 
                  onClick={() => handleEdit(plant)} 
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Edit Plant
                </button>
                <button 
                  onClick={() => deletePlant(plant._id)} 
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  Delete Plant
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}