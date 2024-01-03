from flask import Flask, jsonify
from flask import Flask,request
from flask_cors import CORS, cross_origin
import pandas as pd
from main import *
import numpy as np

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


app.config['CORS_HEADERS'] = 'Content-Type'
rows = []
column = []
value = ''

@app.route('/getDf',methods=['POST'])
@cross_origin()
def getDf():
    try:
        df = pd.read_excel("Pivot Practice.xlsx",sheet_name="Sheet5")
        temp = df.to_dict(orient='split')
        return jsonify(temp)
    except:
        return jsonify(False)

@app.route('/addRow', methods= ['POST'])
@cross_origin()
def addRow():
    try:
        data = request.get_json()
        print(data)
        df = pd.read_excel("Pivot Practice.xlsx", sheet_name="Sheet5")
        final_df = pd.concat([df, pd.DataFrame([data], columns=df.columns)], axis=0, ignore_index=True)
        final_df.to_excel("Pivot Practice.xlsx",sheet_name="Sheet5",index=False)
        return jsonify(True)
    except:
        return jsonify(False)
 
 
@app.route('/setLabels',methods=['POST'])
@cross_origin()
def setLabels():
    try:
        data = request.get_json()
        df = pd.DataFrame(columns=data)
        df.to_excel("Pivot Practice.xlsx",sheet_name="Sheet5",index=False)
        return jsonify(True)
    except:
        return jsonify(False)

@app.route('/copyData',methods=['POST'])
@cross_origin()
def copy_data():
    try:
        data = request.get_json()
        print(data)
        df = pd.read_excel("Pivot Practice.xlsx",sheet_name="Sheet5")
        copy_data_helper(df,data['last_col_name'],data['new_col_name'],column)
        return jsonify(True)
    except Exception as e:
        return jsonify(e)

@app.route('/updateData',methods=['POST'])
@cross_origin()
def update_data():
    data = request.get_json()
    print(data)
    Tr= data['row']
    Tc=data['col']
    if data['oldData']==0:
        ratio = data['newValue']
    else:
        ratio = data['newValue']/data['oldData']
    
    print(Tr,Tc,ratio)
    # print(type(Tr),type(Tc),type(ratio))
    df = pd.read_excel("Pivot Practice.xlsx",sheet_name="Sheet5")
    mask = pd.Series(True, index=df.index)
    if isinstance(Tr,list):
        idx=0
        for i in Tr:
            if i!='' and i!="Total":
                mask &= (df[rows[idx]]==i)
            idx+=1
    else:
         mask &= (df[rows[0]]==Tr)
    if isinstance(column,list):
        idx=0
        for i in Tc:
            if i!='' and i!="Total":
                mask &= (df[column[idx]]==i)
            idx+=1
    else:
         mask &= (df[column[0]]==Tc)
    # print(mask)
    # print(df.loc[mask,value] * ratio)
    if data['oldData']==0 and df.loc[mask,value].empty:
        temp_dic = {}
        for i in range(len(rows)):
            temp_dic[rows[i]]=Tr[i]
        for i in range(len(column)):
            temp_dic[column[i]]=Tc[i]
        temp_dic[value] = ratio
        print(temp_dic)
        df.loc[len(df)] = temp_dic
    else:
        if data['oldData']==0:
            df.loc[mask,value] =ratio/len(df.loc[mask,value])
        else:
            df.loc[mask,value] =df.loc[mask,value] * ratio
    df.to_excel("Pivot Practice.xlsx",sheet_name="Sheet5",index=False)
    return jsonify(True)

@app.route('/getColumns',methods=['POST'])
@cross_origin()
def get_columns():
    data = request.get_json()
    print(data)
    return data

@app.route('/clearData',methods=['POST'])
@cross_origin()
def clear_data():
    try:
        df = pd.DataFrame()
        df.to_excel("Pivot Practice.xlsx",sheet_name="Sheet5",index=False)
        rows=[]
        column=[]
        value=''
        return jsonify(True)
    except:
        return jsonify(False)

@app.route('/',methods=['POST'])
@cross_origin()
def get_pt():
    global rows,column,value
    data = request.get_json()
    print(data)
    df = pd.read_excel("Pivot Practice.xlsx",sheet_name="Sheet5")
    if data['value']=='' and value=='':
        return {'columns': [],
        'data': [],
        'index': [],
        'rows': [],
        'allcolumns': df.columns.tolist()}
    if data['value']!='':
        rows = data['rows']
        column = data['column']
        value = data['value']
    pivot_table = pd.pivot_table(df, values=value, index=rows, columns=column, aggfunc='sum', fill_value=0, margins=True, margins_name='Total')
    # temp = pivot_table.to_dict(orient='split')
    # # temp = subtotals(temp,df,rows,column,value)
    # temp['rows'] = rows
    # temp['allcolumns'] = df.columns.tolist()
    temp = subtotals(pivot_table,df,rows,column,value)
    temp['data'] = [
        # [int(cell) if isinstance(cell, (int, np.int64)) else cell for cell in row] for row in temp['data']
        [round(cell, 2) if isinstance(cell, (float)) else int(cell) if isinstance(cell, (int, np.int64)) else cell for cell in row] for row in temp['data']
    ]
    return jsonify(temp)
    # return {'columns': [],
    #     'data': [],
    #     'index': [],
    #     'rows': [],
    #     'allcolumns': df.columns.tolist()}

if __name__ == '__main__':
    app.run(debug=True,port=8080)