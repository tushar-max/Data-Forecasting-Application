import axios from 'axios';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react'
import './AddData.css'
import { Link } from 'react-router-dom';

function AddData() {
    const [data, setData] = useState({ columns: [], data: [] });
    const [fields, setFields] = useState([]);
    const [form, setForm] = useState([]);
    const [showAddRow, setShowAddRow] = useState(false);
    const [showAddLabels, setShowAddLabels] = useState(false);
    const [temp, setTemp] = useState('');
    useEffect(() => {
        getDf();
    }, []);

    const addFields = () => {
        if (temp.trim() !== '') {
            setFields([...fields, temp]);
            setTemp('');
        }
    };
    const removeFields = (index) => {
        const newData = [...fields];
        newData.splice(index, 1);
        setFields(newData);
    };
    const submitFields = async()=>{
        console.log(fields);
        const response = await axios.post('http://127.0.0.1:8080/setLabels', fields);
        if (!response) {
            alert("Failed");
        }
        getDf();
        setFields([]);
        setShowAddLabels(!showAddLabels);
    }
    const handleShowAddLabels = async () => {
        setShowAddLabels(!showAddLabels);
    }

    const handleAddData = async () => {
        console.log(form);
        const response = await axios.post('http://127.0.0.1:8080/addRow', form);
        if (!response) {
            alert("Failed");
        }
        getDf();
    }
    const getDf = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8080/getDf');
            console.log(response.data);
            setData({
                ...data,
                columns: response.data.columns,
                data: response.data.data,
            });
            // setFields(Array.from({ length: response.data.columns.length }, () => ''))
            setForm(Array.from({ length: response.data.columns.length }, () => ''))
        } catch (error) {
            console.log(error);
        }
    };
    const handleShowAddRow = async () => {
        setShowAddRow(!showAddRow);
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg sticky-top nav">
                <Link className="btn btn-success" to="/">Home</Link>
                <h1 className='ms-auto'>Forecasting App</h1>
                {data.columns.length === 0 && !showAddLabels && <button className="btn btn-primary ms-auto" onClick={handleShowAddLabels}>Add Labels</button>}
                {data.columns.length === 0 && showAddLabels && <button className="btn btn-danger ms-auto" onClick={handleShowAddLabels}>Collapse</button>}
                {data.columns.length !== 0 && !showAddRow && <button className="btn btn-primary ms-auto" onClick={handleShowAddRow}>Add Row</button>}
                {showAddRow && <button className="btn btn-danger ms-auto" onClick={handleShowAddRow}>Collapse</button>}
            </nav>

            {data.columns.length===0 && showAddLabels && <div>
                <h1>Add Labels</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Enter Label name"
                        value={temp}
                        onChange={(e) => setTemp(e.target.value)}
                    />
                    &nbsp;
                    <button className='btn btn-primary' onClick={addFields}>Add</button>
                    &nbsp;
                    <button className='btn btn-success' onClick={submitFields}>Submit</button>
                </div>
                <ul>
                    {fields.map((todo, index) => (
                        <li key={index}>
                            {todo}
                            <button onClick={() => removeFields(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>}

            {showAddRow && <><form className='card card-body form'>
                {form.map((attribute, index) => (
                    <div key={index}>{data.columns[index]}:
                        <input required
                            type="text"
                            placeholder='Enter Data'
                            value={form[index]}
                            onChange={(e) => {
                                const newData = [...form];
                                newData[index] = e.target.value;
                                console.log(newData);
                                setForm(newData);
                            }}
                        />
                    </div>
                ))}
                {form.includes('') && <button className='btn btn-success disabled'>Submit</button>}
                {!form.includes('') && <button className='btn btn-success' onClick={handleAddData}>Submit</button>}
            </form>
            </>
            }

            <h2>Data Table</h2>
            <table>
                <thead>
                    <tr>
                        {data.columns.map((column, index) => (
                            <th key={index}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AddData;