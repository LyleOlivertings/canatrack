import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function TimelineEventForm({ plantId }) {
  const [date, setDate] = useState(new Date());
  const [event, setEvent] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch(`/api/plants/${plantId}/timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, event, notes })
    });

    if (response.ok) {
      setDate(new Date());
      setEvent('');
      setNotes('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Add Timeline Event</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Date</label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">Event</label>
          <input
            type="text"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block mb-2">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded"
          rows="3"
        />
      </div>

      <button
        type="submit"
        className="mt-4 bg-green-theme-500 text-white px-4 py-2 rounded hover:bg-green-theme-600"
      >
        Add Event
      </button>
    </form>
  );
}