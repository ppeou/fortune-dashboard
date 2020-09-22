import rawData from '../data/raw.json';
import {convertData} from '../transform/raw-2-object';

const {columns, filterable, items, sortable} = convertData(rawData);

export {columns, filterable, items, sortable};
