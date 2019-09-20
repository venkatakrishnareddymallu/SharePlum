from flask import Flask,jsonify,render_template,request
import pandas as pd
import pymysql
from sqlalchemy import create_engine
pymysql.install_as_MySQLdb()
from shareplum import Site
import json
from shareplum import Office365
from flask_wtf.csrf import CSRFProtect
csrf = CSRFProtect()
app = Flask(__name__)
csrf.init_app(app)
app.config['SECRET_KEY'] = 'venkata789123'
authcookie = Office365('https://svm12.sharepoint.com', username='sudhakar@SVM12.onmicrosoft.com', password='Spoint@123').GetCookies()
site = Site('https://svm12.sharepoint.com/sites/GENIV', authcookie=authcookie)

def connect_site():
    return site

@app.route('/label_new', methods=['GET','POST'])
def labelmatrix_new():
    site = connect_site()
    program = site.List('GENIV_Product_ADB2')
    feature = site.List('GENIV Features_ADB2')
    rel_name = site.List('GENIV Releases_ADB2')
    program_data = program.GetListItems('All Items')
    feature_data = feature.GetListItems('All Items')
    label_data = {"program": program_data, "feature": feature_data}
    return jsonify(label_data)

@app.route('/rel_name', methods=['GET','POST'])
def rel_name():
    args = request.args.get('program')
    site = connect_site()
    rel_name = site.List('GENIV Releases_ADB2')
    rel_data = rel_name.GetListItems('All Items')
    df = pd.DataFrame.from_dict(rel_data, orient='columns')
    df = df[(df['Rel Status'] == 'Active')]
    df = df[df['Program'].str.contains(args)]['Release Name']
    return jsonify(df.values.tolist())

@app.route('/cctag', methods=['GET','POST'])
def cctag():
    args = request.args.get('cctag')
    site = connect_site()
    feat = site.List('GENIV CR_ADB2')
    feat_data = feat.GetListItems(fields=['Issue ID', 'CR Status','Affected Feature'])
    df = pd.DataFrame.from_dict(feat_data, orient='columns')
    df = df[df['Affected Feature'].str.contains(args)]
    df = df[df['CR Status'] == 'Open']['Issue ID']
    return jsonify(df.values.tolist())

@app.route('/exp_rel_name', methods=['GET','POST'])
def exp_rel_name():
    args1 = request.args.get('program')
    args = request.args.get('rel')
    site = connect_site()
    ex_rel_name = site.List('GENIV Releases_ADB2')
    ex_rel_data = ex_rel_name.GetListItems('All Items')
    df = pd.DataFrame.from_dict(ex_rel_data, orient='columns')
    df = df[(df['Rel Status'] == 'Active')]
    df = df[df['Program'].str.contains(args1) & df['Release Name'].str.contains(args)]['Exp Release Name']
    return jsonify(df.values.tolist())

@app.route('/submit_new', methods=['GET','POST'])
def submit_new_list():
    site = connect_site()
    new_list = site.List('GENIV LM_ADB2')
    data = [{'Program': request.args.get('program'), 'Status': request.args.get('status'), 'Feature': request.args.get('feature'),
    'Rel_Name': request.args.get('rel_name'),'Exp_Rel_Name': request.args.get('exp_rel_name'),'CRs': request.args.get('crs'),
    'CC_Tag': request.args.get('cctag')}]
    new_list.UpdateListItems(data=data, kind='New')
    return jsonify({"result":"data Added"})


@app.route('/edit_view', methods=['GET','POST'])
def edit_view():
    site = connect_site()
    new_list = site.List('GENIV LM_ADB2')
    feat_data = new_list.GetListItems(fields=['Program','Rname'])
    data_items = pd.DataFrame.from_dict(feat_data, orient='columns')
    return jsonify(data_items.values.tolist())

@app.route('/edit_data', methods=['GET','POST'])
def edit_data():
    site = connect_site()
    new_list = site.List('GENIV LM_ADB2')
    feat_data = new_list.GetListItems('All Items')
    data_items = pd.DataFrame.from_dict(feat_data, orient='columns')
    data_item1 = data_items[data_items['Program'] == request.args.get('pro')]
    data_item2 = data_item1[data_item1['Rname'] == request.args.get('rel')]
    # import pdb;pdb.set_trace()
    return data_item2.to_json(orient='records')

@app.route('/submit_edit', methods=['GET','POST'])
def submit_edit_list():
    site = connect_site()
    new_list = site.List('GENIV LM_ADB2')
    data = [{'ID':request.args.get('id'),'Program': request.args.get('program'), 'Status': request.args.get('status'), 'Feature': request.args.get('feature'),
    'Rname': request.args.get('rel_name'),'Ername': request.args.get('exp_rel_name'),'CRs': request.args.get('crs'),
    'CC Tag': request.args.get('cctag')}]
    new_list.UpdateListItems(data=data, kind='Update')
    return jsonify({"result":"data updated"})

@app.route('/')
def index():
    return render_template('index.html')