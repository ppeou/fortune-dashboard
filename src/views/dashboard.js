import React, {useEffect, useRef, useState} from 'react';
import {get} from 'lodash';

import { useSelector } from 'react-redux'

import { AgGridReact } from '@ag-grid-community/react';
import { AllModules } from '@ag-grid-enterprise/all-modules';

import {buildAgGridColumns} from '../transform/util';
import rawColumns from '../config/columns.json';
import {getData} from '../store/dashboard/action';
import {dataByYearSelector} from '../store/dashboard/selector';

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
import '../css/grid.css';

const defaultProfile = ['rank', 'name', 'sector', 'f500_revenues', 'revchange',
  'f500_profits', 'prftchange', 'assets', 'f500_mktval',
  'rankchange1000', 'f500_ employees', 'rankchange'];

const columns = buildAgGridColumns(rawColumns, defaultProfile);

const gridStyles = {
  height: 'calc(100% - 50px)',
  width: '100%',
};

const Toolbar = ({setTheme, setYear}) => {
  const years = [2020, 2019, 2018, 2017];
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
      <label>Theme: </label>
      <select onChange={(({target:{value}}) => {setTheme(value);})}>
        {themes.map((theme, idx) => (<option key={idx} value={theme}>{theme}</option>))}
      </select>
      <label>Year: </label>
      <select onChange={(({target:{value}}) => {setYear(value);})}>
        {years.map((year, idx) => (<option key={idx} value={year}>{year}</option>))}
      </select>
    </div>
  </div>);
};

window.columns = columns;

const Dashboard = () => {
  const [year, setYear] = useState(2020);
  const data = useSelector(dataByYearSelector)(year);

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

  useEffect(() => {
    getData(year);
  }, [year]);

  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <Toolbar setTheme={setTheme} setYear={setYear}></Toolbar>
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
