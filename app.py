from flask import Flask, jsonify
from flask import Flask,request
from flask_cors import CORS, cross_origin
import pandas as pd
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/getData',methods=['GET'])
@cross_origin()
def get_data():
    df = pd.read_excel("Pivot Practice.xlsx",sheet_name="Sheet5")
    row = ['Country', 'Gender', 'Age-Group']
    column = ['Year']
    value = 'People'
    pivot_table = pd.pivot_table(df, values=value, index=row, columns=column, aggfunc='sum', fill_value=0, margins=True, margins_name='Total', observed=True)
    # Implement logic to fetch and process data
    # Return the data in JSON format
    np_array = pivot_table.to_numpy().tolist()
    print(np_array)
    return jsonify({'pivot':np_array})

@app.route('/',methods=['GET'])
@cross_origin()
def get_pt():
    df = pd.read_excel("Pivot Practice.xlsx",sheet_name="Sheet5")
    row = ['Country', 'Gender', 'Age-Group']
    column = ['Year']
    value = 'People'
    pivot_table = pd.pivot_table(df, values=value, index=row, columns=column, aggfunc='sum', fill_value=0, margins=True, margins_name='Total', observed=True)
    return jsonify(pivot_table.to_dict(orient='split'))
  


if __name__ == '__main__':
    app.run(debug=True,port=8080)