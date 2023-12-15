import pandas as pd

def pass_Cols():
    df = pd.read_excel("Pivot Practice.xlsx",sheet_name="Sheet5")
    return df.columns.tolist()