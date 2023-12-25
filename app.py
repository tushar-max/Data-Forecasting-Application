# from flask import Flask, jsonify
# from flask import Flask,request
# from flask_cors import CORS, cross_origin
# import pandas as pd
# import json

# app = Flask(__name__)
# cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

# @app.route('/getData',methods=['GET'])
# @cross_origin()
# def get_data():
#     df = pd.read_excel("Pivot Practice.xlsx",sheet_name="Sheet5")
#     row = ['Country', 'Gender', 'Age-Group']
#     column = ['Year']
#     value = 'People'
#     pivot_table = pd.pivot_table(df, values=value, index=row, columns=column, aggfunc='sum', fill_value=0, margins=True, margins_name='Total', observed=True)
#     # Implement logic to fetch and process data
#     # Return the data in JSON format
#     np_array = pivot_table.to_numpy().tolist()
#     print(np_array)
#     # return jsonify({'pivot':np_array})
#     return jsonify({'pivot': np_array})
# @app.route('/',methods=['GET'])
# @cross_origin()
# def get_pt():
#     df = pd.read_excel("Pivot Practice.xlsx",sheet_name="Sheet5")
#     row = ['Country', 'Gender', 'Age-Group']
#     column = ['Year']
#     value = 'People'
#     pivot_table = pd.pivot_table(df, values=value, index=row, columns=column, aggfunc='sum', fill_value=0, margins=True, margins_name='Total', observed=True)
#     return jsonify(pivot_table.to_dict(orient='split'))
  


# if __name__ == '__main__':
#     app.run(debug=True,port=8080)
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import pandas as pd

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Load the initial data
df = pd.read_excel("Pivot Practice.xlsx", sheet_name="Sheet5")
row = ['Country', 'Gender', 'Age-Group']
column = ['Year']
value = 'People'
pivot_table = pd.pivot_table(
    df,
    values=value,
    index=row,
    columns=column,
    aggfunc='sum',
    fill_value=0,
    margins=True,
    margins_name='Total',
    observed=True
)

@app.route('/getData', methods=['GET'])
@cross_origin()
def get_data():
    np_array = pivot_table.to_numpy().tolist()
    return jsonify({'pivot': np_array})

@app.route('/updateData', methods=['POST'])
@cross_origin()
def update_data():
    data = request.get_json()
    i, j, val = data['i'], data['j'], data['val']
    
    if i >= 0 and j >= 0 and i < len(pivot_table.index) and j < len(pivot_table.columns):
        pivot_table.iloc[i, j] = val
        # Save changes to the Excel file
        pivot_table.to_excel("Pivot Practice.xlsx", sheet_name="Sheet5", index=False)
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Invalid indices'})

@app.route('/saveChanges', methods=['POST'])
@cross_origin()
def save_changes():
    data = request.get_json()
    # Process and save changes as needed
    # Example: You might update the DataFrame with the provided data
    # and then save it to the Excel file
    # Note: Make sure to validate and handle data appropriately
    updated_data = data.get('updatedData')
    # ... Process and save changes ...
    
    return jsonify({'success': True, 'message': 'Changes saved successfully'})

@app.route('/', methods=['GET'])
@cross_origin()
def get_pt():
    return jsonify(pivot_table.to_dict(orient='split'))

if __name__ == '__main__':
    app.run(debug=True, port=8080)
