import logo from './logo.svg';
import './App.css';
import React, {useState,useEffect} from 'react';
import axios from 'axios';

// function App() {
//   const [data,setData] = useState([]);
//   const [pivotTable,setPivotTable] = useState([]);
//   const [updateParams,setUpdateParams] = useState({
//     i:-1,
//     j:-1,
//     val:0,
//   });
//   useEffect(()=>{
//     fetchData();
//   },[]);

//   const fetchData = async ()=>{
//     try{
//       const response = await axios.get('http://127.0.0.1:8080');
//       setPivotTable(response);
//     }
//     catch(error){
//       console.log(error);
//     }
//   };

//   const handleUpdateData = async () => {
//     try {
//       await axios.post('http://127.0.0.1:8080/updateData', updateParams);
//       // Refresh data after updating
//       fetchData();
//       // Reset updateParams to default values
//       setUpdateParams({ i: 0, j: 0, val: 0 });
//     } catch (error) {
//       console.error('Error updating data:', error);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Forecasting Frontend</h1>
//       <div>
//         <h2>Pivot Table</h2>
//         <pre>{JSON.stringify(pivotTable, null, 2)}</pre>
//       </div>
//       <div>
//         <h2>Update Data</h2>
//         <label>
//           i:
//           <input type="number" value={updateParams.i} onChange={(e) => setUpdateParams({ ...updateParams, i: parseInt(e.target.value) })} />
//         </label>
//         <label>
//           j:
//           <input type="number" value={updateParams.j} onChange={(e) => setUpdateParams({ ...updateParams, j: parseInt(e.target.value) })} />
//         </label>
//         <label>
//           val:
//           <input type="number" value={updateParams.val} onChange={(e) => setUpdateParams({ ...updateParams, val: parseInt(e.target.value) })} />
//         </label>
//         <button onClick={handleUpdateData}>Update Data</button>
//       </div>
//     </div>
//   );
// }

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

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleUpdateData = async () => {
    try {
      await axios.post('http://127.0.0.1:8080/updateData', updateParams);
      // Refresh data after updating
      fetchData();
      // Reset updateParams to default values
      setUpdateParams({ columns: [], data: [], index: [], i: -1, j: -1, val: 0 });
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className="App">
      <h1>Forecasting App</h1>

      <div>
        <h2>Pivot Table</h2>
        {/* <pre>{JSON.stringify(updateParams.columns, null, 2)}</pre> */}
        {/* <pre>{JSON.stringify(pivotTable.data, null, 2)}</pre> */}
        {/* <pre>{JSON.stringify(updateParams.index, null, 2)}</pre> */}
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
                  <td key={colIndex}>{value}</td>
                ))}
                {updateParams.data[rowIndex].map((cellValue, colIndex) => (
                  <td key={colIndex}>{cellValue}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
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
      </div>
    </div>
  );
}

export default App;
