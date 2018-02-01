// @flow

import { ValueReducerType, ActionType } from '../types';

export default (state: ValueReducerType = {}, action: ActionType) => {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        [action.payload.name]: action.payload.transform ?
          action.payload.transform(action.payload.value) :
          action.payload.value,
      };
    case 'CLEAR_VALUE':
      return {
        ...state,
        [action.payload]: '',
      };
    default:
      return state;
  }
};
