import { createSelector } from 'reselect';
import {get} from 'lodash';

const rootSelector = (state) => state.dashboard;

const dataByYearSelector = createSelector(rootSelector, (state) => {
  return (year) => get(state, year, []);
});

export {dataByYearSelector};
