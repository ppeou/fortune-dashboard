import {startCase, difference} from 'lodash';
import numeral from 'numeral';

const formatters = {
  money: ({value: v}) => v && numeral(v).format('$ 0,0[.]0'),
  number: ({value}) => value,
  percent: ({value}) => value && `${value}%`,
  text: ({value}) => value
}

const buildAgGridColumns = (columns, preference) => {
  const newColumns = Object.keys(columns).reduce((p, k) => {
    const {dataField: field, label: headerName, dataType, options, ...rest} = columns[k];
    const valueFormatter = formatters[dataType] || formatters.text;
    p[k] = {
      ...rest,
      dataType,
      field,
      headerName,
      valueFormatter
    };
    return p;
  }, {});

  const hiddenColumns = difference(Object.keys(newColumns), preference);

  const cols = [
    ...preference.map(k => ({...newColumns[k]})),
    ...hiddenColumns.map(k => ({...newColumns[k], hide: true}))
  ];
  return cols;
};


export {buildAgGridColumns};
