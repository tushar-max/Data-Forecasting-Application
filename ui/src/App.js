



import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [pivotTable, setPivotTable] = useState([]);
  const [updateParams, setUpdateParams] = useState({
    columns: [],
    data: [],
    index: [],
    i: -1,
    j: -1,
    val: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get('http://127.0.0.1:8080');
//       setPivotTable(response.data);
//       setUpdateParams({
//         ...updateParams,
//         columns: response.data.columns,
//         data: response.data.data,
//         index: response.data.index,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080');
      setPivotTable(response.data);
      setUpdateParams({
        ...updateParams,
        columns: response.data.columns,
        data: response.data.data,
        index: response.data.index,
      });
    } catch (error) {
      console.log(error);
    }
  };

//   const handleUpdateData = async () => {
//     try {
//       await axios.post('http://127.0.0.1:8080/updateData', updateParams);
//       // Refresh data after updating
//       fetchData();
//       // Reset updateParams to default values
//       setUpdateParams({ columns: [], data: [], index: [], i: -1, j: -1, val: 0 });
//     } catch (error) {
//       console.error('Error updating data:', error);
//     }
//   };

  const handleUpdateData = async () => {
    try {
      await axios.post('http://127.0.0.1:8080/updateData', updateParams);
   
      fetchData();
      
      setUpdateParams({ columns: [], data: [], index: [], i: -1, j: -1, val: 0 });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleEditClick = () => {
   
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  return (
    <div className="App">
      <h1>Forecasting App</h1>

      <div>
        <h2>Pivot Table</h2>
       
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>Gender</th>
              <th>Age-Group</th>
              {updateParams.columns.map((year, index) => (
                <th key={index}>{year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
          
            {updateParams.index.map((rowData, rowIndex) => (
              <tr key={rowIndex}>
                {rowData.map((value, colIndex) => (
                  <td key={colIndex} contentEditable={isEditing} suppressContentEditableWarning>
                    {value}
                  </td>
                ))}
                
                {updateParams.data[rowIndex].map((cellValue, colIndex) => (
                  <td key={colIndex} contentEditable={isEditing} suppressContentEditableWarning>
                    {cellValue}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
<div>
<button onClick={handleEditClick}>{isEditing ? 'Update' : 'Edit'}</button>
</div>
      {/* <div>
        <h2>Update Data</h2>
        <label>
          i:
          <input
            type="number"
            value={updateParams.i}
            onChange={(e) => setUpdateParams({ ...updateParams, i: parseInt(e.target.value) })}
          />
        </label>
        <label>
          j:
          <input
            type="number"
            value={updateParams.j}
            onChange={(e) => setUpdateParams({ ...updateParams, j: parseInt(e.target.value) })}
          />
        </label>
        <label>
          val:
          <input
            type="number"
            value={updateParams.val}
            onChange={(e) => setUpdateParams({ ...updateParams, val: parseInt(e.target.value) })}
          />
        </label>
        <button onClick={handleUpdateData}>Update Data</button>
      </div> */}
    </div>
  );
}

export default App;


