import React from 'react';

const JSON = ({ data }) => {
  return (
    <div>
      <h2>JSON Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default JSON;
