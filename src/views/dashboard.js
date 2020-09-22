import React, {useRef, useState} from 'react';
import data from '../data/data.json';
import rawColumns from '../data/columns.json';

import { AgGridReact } from '@ag-grid-community/react';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-blue.css';
import 'ag-grid-community/dist/styles/ag-theme-bootstrap.css';
import 'ag-grid-community/dist/styles/ag-theme-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-fresh.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import {buildAgGridColumns} from '../transform/raw-2-object';

import '../css/grid.css';

const defaultProfile = ['rank', 'name', 'sector', 'f500_revenues', 'revchange',
  'f500_profits', 'prftchange', 'assets', 'f500_mktval',
  'rankchange1000', 'f500_ employees', 'rankchange'];

const columns = buildAgGridColumns(rawColumns, defaultProfile);

const gridStyles = {
  height: 'calc(100% - 50px)',
  width: '100%',
};

const Toolbar = ({setTheme}) => {
  const themes = ['ag-theme-alpine',
    'ag-theme-alpine-dark',
    'ag-theme-balham',
    'ag-theme-balham-dark',
    'ag-theme-blue',
    'ag-theme-bootstrap',
    'ag-theme-dark',
    'ag-theme-fresh',
    'ag-theme-material'];
  return (<div className="toolbar">
    <div className="menu">
      <select onChange={(({target:{value}}) => {setTheme(value);})}>
        {themes.map((theme, idx) => (<option key={idx} value={theme}>{theme}</option>))}
      </select>
    </div>
  </div>);
};

window.columns = columns;

const Dashboard = () => {
  const [theme, setTheme] = useState('ag-theme-alpine');
  const gridContext = useRef({api: null, columnApi: null});
  const defaultColDef = {
    filter: true,
    resizable: true,
    sortable: true,
  };
  const sideBar = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
      },
      'filters'
    ]
  };
  const onGridReady = ({api, columnApi}) => {
    gridContext.current = {api, columnApi};
    api.setSortModel([{
      colId : 'rank',
        sort: 'asc',
      }]);
    api.sizeColumnsToFit();
  };

  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <Toolbar setTheme={setTheme}></Toolbar>
      <div
        className={theme}
        style={gridStyles}>
        <AgGridReact
          onGridReady={onGridReady}
          defaultColDef={defaultColDef}
          headerHeight={50}
          modules={AllModules}
          columnDefs={columns}
          multiSortKey="ctrl"
          rowData={data}
          sideBar={sideBar}
        />
      </div>
    </div>
  );
};


export default Dashboard;
