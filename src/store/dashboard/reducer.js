import {SET_DATA} from './type';

const initialState = {};

const reducer = ((state = initialState, action) => {
  const {type, value} = action;

  if(type === SET_DATA) {
    const {year, data} = value;
    return {
      ...state,
      [year]: data
    }
  }

  return state;
});

export default reducer;
