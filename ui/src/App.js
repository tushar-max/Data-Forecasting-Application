import logo from './logo.svg';
import './App.css';
import React, {useState,useEffect} from 'react';
import axios from 'axios';

function App() {
  const [data,setData] = useState([]);
  const [pivotTable,setPivotTable] = useState([]);
  const [updateParams,setUpdateParams] = useState({
    i:-1,
    j:-1,
    val:0,
  });
  useEffect(()=>{
    fetchData();
  },[]);

  const fetchData = async ()=>{
    try{
      const response = await axios.get('http://127.0.0.1:8080');
      setPivotTable(response);
    }
    catch(error){
      console.log(error);
    }
  };

  const handleUpdateData = async () => {
    try {
      await axios.post('http://127.0.0.1:8080/updateData', updateParams);
      // Refresh data after updating
      fetchData();
      // Reset updateParams to default values
      setUpdateParams({ i: 0, j: 0, val: 0 });
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className="App">
      <h1>Forecasting Frontend</h1>
      <div>
        <h2>Pivot Table</h2>
        <pre>{JSON.stringify(pivotTable, null, 2)}</pre>
      </div>
      <div>
        <h2>Update Data</h2>
        <label>
          i:
          <input type="number" value={updateParams.i} onChange={(e) => setUpdateParams({ ...updateParams, i: parseInt(e.target.value) })} />
        </label>
        <label>
          j:
          <input type="number" value={updateParams.j} onChange={(e) => setUpdateParams({ ...updateParams, j: parseInt(e.target.value) })} />
        </label>
        <label>
          val:
          <input type="number" value={updateParams.val} onChange={(e) => setUpdateParams({ ...updateParams, val: parseInt(e.target.value) })} />
        </label>
        <button onClick={handleUpdateData}>Update Data</button>
      </div>
    </div>
  );
}

export default App;
