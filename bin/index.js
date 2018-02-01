import Form from './container';
import reducer from './reducer';
import actions from './actions';
import value from './valueReducer';

export default Form;

export const formReducer = reducer;

export const valueReducer = value;

export const formActions = actions;
