// src/App.js
import React, { useState, useEffect } from 'react';
import {
  format,
  addDays,
  addWeeks,
  isAfter,
  isBefore,
  parseISO,
  setHours,
  setMinutes,
} from 'date-fns';

function App() {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [recurrence, setRecurrence] = useState('daily');
  const [occurrences, setOccurrences] = useState(5);
  const [viewStart, setViewStart] = useState('');
  const [viewEnd, setViewEnd] = useState('');
  const [eventInstances, setEventInstances] = useState([]);

  useEffect(() => {
    if (!startDate || !startTime || !occurrences) return;

    const [hour, minute] = startTime.split(':').map(Number);
    const baseDate = setMinutes(setHours(parseISO(startDate), hour), minute);
    const events = [];

    for (let i = 0; i < occurrences; i++) {
      const eventDate =
        recurrence === 'daily'
          ? addDays(baseDate, i)
          : addWeeks(baseDate, i);
      events.push(eventDate);
    }

    setEventInstances(events);
  }, [startDate, startTime, recurrence, occurrences]);

  const isInViewWindow = (date) => {
    if (!viewStart || !viewEnd) return true;
    const from = parseISO(viewStart);
    const to = parseISO(viewEnd);
    return !isBefore(date, from) && !isAfter(date, to);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8">📅 Recurring Event Scheduler</h1>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
        <div>
          <label className="block font-medium mb-1">Start Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Start Time</label>
          <input
            type="time"
            className="w-full p-2 border rounded"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Recurrence</label>
          <select
            className="w-full p-2 border rounded"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Number of Occurrences</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            min={1}
            value={occurrences}
            onChange={(e) => setOccurrences(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">View Window Start</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={viewStart}
            onChange={(e) => setViewStart(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">View Window End</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={viewEnd}
            onChange={(e) => setViewEnd(e.target.value)}
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-center mb-4">Generated Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {eventInstances.map((event, idx) => {
          const inView = isInViewWindow(event);
          return (
            <div
              key={idx}
              className={`p-4 border-l-4 shadow rounded bg-white ${
                inView ? 'border-green-500' : 'border-red-500 bg-red-50'
              }`}
            >
              <p className="text-lg font-medium">{format(event, 'eeee, MMMM d, yyyy h:mm a')}</p>
              <p className="text-sm text-gray-600">
                {inView ? '✅ Within view window' : '⚠️ Outside view window'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
