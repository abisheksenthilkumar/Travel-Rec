import React, { useState } from 'react';

const VacationRecommendation = () => {
  const [preferences, setPreferences] = useState({
    cost_per_person: 15000,
    weather: 'cool',
  });
  const [recommendations, setRecommendations] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences({
      ...preferences,
      [name]: value,
    });
  };

  const getRecommendations = async () => {
    const response = await fetch(
      'https://travel-rec-1.onrender.com/recommend-vacations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      },
    );
    const data = await response.json();
    setRecommendations(data);
  };

  return (
    <div>
      <h2>Vacation Planner</h2>

      <div>
        <label>Budget (per person): </label>
        <input
          type="number"
          name="cost_per_person"
          value={preferences.cost_per_person}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Preferred Weather: </label>
        <select
          name="weather"
          value={preferences.weather}
          onChange={handleChange}
        >
          <option value="cool">Cool</option>
          <option value="hot">Hot</option>
        </select>
      </div>

      <button onClick={getRecommendations}>Get Recommendations</button>

      <h3>Recommended Vacations:</h3>
      <ul>
        {recommendations.map((vacation, index) => (
          <li key={index}>
            <h4>{vacation.Destination}</h4>
            <p>Cost per person: {vacation.cost_per_person}</p>
            <p>Weather: {vacation.weather}</p>
            <p>Places to visit: {vacation.Places_to_visit}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VacationRecommendation;
