import { createStore, combineReducers } from 'redux';
import dashboard from './dashboard/reducer';

const store = createStore(combineReducers({dashboard}));
const {dispatch, getState} = store;
window.store = store;
export {
  dispatch,
  getState,
  store as default,
};
