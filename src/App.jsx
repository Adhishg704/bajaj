import React, { useState } from "react";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [responseData, setResponseData] = useState({});
  const [options, setOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data) throw new Error("Invalid JSON format. Missing 'data' key.");

      // Call backend API
      const response = await fetch("http://localhost:5000/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setResponseData(data);
      setShowDropdown(true); // Show dropdown on valid submission
      setError("");
    } catch (err) {
      setError(`Error: ${err.message}`); // Provide more specific error message
      setShowDropdown(false);
      setResponseData({});
    }
  };

  const handleOptionChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setOptions(selectedOptions);
  };

  const renderFilteredResponse = () => {
    const filteredData = {};
    if (options.includes("Alphabets")) filteredData.alphabets = responseData.alphabets;
    if (options.includes("Numbers")) filteredData.numbers = responseData.numbers;
    if (options.includes("Highest lowercase alphabet")) filteredData.highestLowercaseAlphabet = responseData.highest_lowercase_alphabet;
    return filteredData;
  };

  const filteredResponse = renderFilteredResponse();

  return (
    <div>
      <h1>{responseData.roll_number || "Your Roll Number"}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter JSON Input:
          <input
            type="text"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{"data": ["A", "C", "z"]}'
          />
        </label>
        <button type="submit">Submit</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      {showDropdown && (
        <div>
          <label>Select Options:</label>
          <select multiple={true} onChange={handleOptionChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
        </div>
      )}

      {Object.keys(filteredResponse).length > 0 && (
        <div>
          <h3>Filtered Response</h3>
          <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;


