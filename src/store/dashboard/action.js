import {SET_DATA} from './type';
import {dispatch} from '../';

const getData = async (year) => {
  const r = await fetch(`data/${year}.json`);
  const data = await r.json();

  dispatch({
    type: SET_DATA,
    value: {year, data}
  });
};

export {getData};
