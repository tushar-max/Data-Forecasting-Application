// import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';

function App() {
  const [showCopyData,setShowCopyData] = useState(false);
  const [updateParams, setUpdateParams] = useState({
    columns: [],
    data: [],
    index: [],
    rows: [],
    allcolumns: [],
    i: -1,
    j: -1,
    val: 0,
  });
  const [attributes, setAttributes] = useState({ rows: [], column: [], value: '' });
  const [showForm, SetShowForm] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedData, setEditedData] = useState({
    rowIndex: -1,
    colIndex: -1,
    value: 0,
  });
  const [inputData, setInputData] = useState('');
  const [tempData, setTempData] = useState([]);
  useEffect(() => {
    fetchData();
  }, [attributes]);
  const fetchData = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8080', attributes);
      // setPivotTable(response.data);
      // console.log(response.data);
      // alert(response.data);
      setUpdateParams({
        ...updateParams,
        columns: response.data.columns,
        rows: response.data.rows,
        data: response.data.data,
        index: response.data.index,
        allcolumns: response.data.allcolumns,

      });
      console.log(updateParams.data);
      console.log("-------------");
      console.log(tempData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {
    setTempData(cloneDeep(updateParams.data));
    console.log(tempData);
    setEdit(!edit);
  }

  const handleShowCopyData = async()=>{
    try {
      setShowCopyData(!showCopyData);
    } catch (error) {
      console.log(error);
    }
  }

  const handleCopyData = async () => {
    try {
      if(inputData===''){
        alert("Enter values.");
        return;
      }
      console.log(inputData);
      await axios.post('http://127.0.0.1:8080/copyData', {
        "last_col_name": updateParams.columns[updateParams.columns.length - 2][0],
        "new_col_name": inputData
      });
      setInputData('');
      setShowCopyData(!showCopyData);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdateData = async () => {
    try {
      if (editedData.colIndex === -1 || editedData.rowIndex === -1) {
        console.log("error");
      }
      else if(updateParams.data[editedData.rowIndex][editedData.colIndex]<0){
        alert("Enter postive values only!")
      }
      else {
        console.log({
          "col": updateParams.columns[editedData.colIndex],
          "row": updateParams.index[editedData.rowIndex], "oldData": tempData[editedData.rowIndex][editedData.colIndex],
          "newValue": updateParams.data[editedData.rowIndex][editedData.colIndex]
        });
        await axios.post('http://127.0.0.1:8080/updateData', {
          "col": updateParams.columns[editedData.colIndex],
          "row": updateParams.index[editedData.rowIndex], "oldData": tempData[editedData.rowIndex][editedData.colIndex],
          "newValue": updateParams.data[editedData.rowIndex][editedData.colIndex]
        });
        setTempData(cloneDeep(updateParams.data));
        fetchData();
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleAttributeGroupChange = (group, value) => {
    const tempAttributes = attributes;
    if (group === 'value') {
      tempAttributes[group] = value;
    }
    else {
      tempAttributes[group].push(value);
    }
    setAttributes(tempAttributes);
    console.log(attributes);
  }
  const handleShowForm = () => {
    SetShowForm(!showForm);
  }
  function handle2DColumn(lst) {
    return lst.map((item, i) => (
      <span key={i}>
        {item}
        {i < lst.length - 1 && <br />} {"--"}
      </span>
    ));
  }

  function isArray2D(arr) {
    if (!Array.isArray(arr)) {
      return false;
    }

    for (let element of arr) {
      if (!Array.isArray(element)) {
        return false;
      }
    }
    return true;
  }

  return (
    <div className="App">
      <h1>Forecasting App</h1>
      {showForm && <button className='btn btn-danger' onClick={handleShowForm}>Collapse</button>}
      {!showForm && <button className='btn btn-info' onClick={handleShowForm}>Set Attributes</button>}
      {
        showForm &&
        <form>
          {updateParams.allcolumns.map((attribute) => (
            <div key={attribute}>
              <label>
                {attribute}:
                <select required onChange={(e) => handleAttributeGroupChange(e.target.value, attribute)}>
                  <option value="">None</option>
                  <option value="rows">Row</option>
                  <option value="column">Column</option>
                  <option value="value">Value</option>
                </select>
              </label>
            </div>
          ))}
          <button className='btn btn-primary' onClick={fetchData}>Fetch</button>
        </form>
      }{updateParams.data.length==0&&
        <div>
          <h1>No Data Available</h1></div>}
      {updateParams.data.length!=0 && <>
      <div className="container buttons-container">
        {edit && <button onClick={handleEdit} className="btn btn-danger">Make Read-only</button>}
        {!edit && <button onClick={handleEdit} className="btn btn-info">Edit</button>} &nbsp;
        {!showCopyData && <button onClick={handleShowCopyData} className="btn btn-primary">Copy Data</button>}
        {showCopyData &&<> <input
          type="text"
          placeholder='Enter column name'
          value={inputData}
          onChange={(e) => {
            setInputData(e.target.value);
          }}
        />
      
        {inputData==='' &&<button className='btn btn-success disabled' >Submit</button>}
        {inputData!=='' &&<button className='btn btn-success' onClick={handleCopyData}>Submit</button>}
        </>
        }
        
      </div>
      <div>
        <table>
          <thead>

            <tr>
              {updateParams.rows.map((val, index) => (
                <th key={index}>{val}</th>
              ))}
              {!isArray2D(updateParams.columns) && updateParams.columns.map((year, index) => (
                <th key={index}>{year}</th>
              ))}

              {isArray2D(updateParams.columns) && updateParams.columns.map((year, index) => (
                <th key={index}>{(handle2DColumn(year))}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!edit && updateParams.index.map((rowData, rowIndex) => (
              <tr key={rowIndex}>
                {rowData.map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
                {isArray2D(updateParams.data) && updateParams.data[rowIndex].map((cellValue, colIndex) => (
                  <td key={colIndex}>{cellValue}</td>
                ))}
              </tr>
            ))}
            {edit && updateParams.index.map((rowData, rowIndex) => (
              <tr key={rowIndex}>
                {rowData.map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
                {isArray2D(updateParams.data) && updateParams.data[rowIndex].map((cellValue, colIndex) => (
                  // <td key={colIndex}>{cellValue}</td>
                  <td key={colIndex}><label>
                    <input
                      type="number"
                      value={cellValue}
                      required

                      // onChange={(e) => setUpdateParams({ ...updateParams, cellValue: parseInt(e.target.value) })}
                      onChange={(e) => {
                        const newData = [...updateParams.data];
                        let oldData = updateParams.data[rowIndex][colIndex]
                        newData[rowIndex][colIndex] = parseInt(e.target.value);
                        setUpdateParams({ ...updateParams, data: newData });
                        setEditedData({ rowIndex: rowIndex, colIndex: colIndex, value: oldData })
                      }}
                    />
                  </label>
                    <button onClick={handleUpdateData}>Update Data</button></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div></>}
    </div>
  );
}

export default App;
