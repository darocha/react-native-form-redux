// @flow

import { FormReducerType, ActionType, InputType } from './types';

export default (state: FormReducerType = {}, action: ActionType) => {
  switch (action.type) {
    case 'REGISTER_FORM':
      return {
        ...state,
        [action.payload.formName]: {
          name: action.payload.formName,
          valid: action.payload.validations.form,
          inputs: action.payload.inputs.map((input: InputType) => ({
            name: input.name,
            focus: false,
            validation: action.payload.validations[input.name],
          })),
        },
      };
    case 'FOCUS_FORM_INPUT':
      return {
        ...state,
        [action.payload.formName]: {
          ...state[action.payload.formName],
          inputs: state[action.payload.formName].inputs.map((input: InputType) => {
            if (input.name !== action.payload.inputName) return input;

            return { ...input, focus: true };
          }),
        },
      };
    case 'BLUR_FORM_INPUT':
      return {
        ...state,
        [action.payload.formName]: {
          ...state[action.payload.formName],
          inputs: state[action.payload.formName].inputs.map((input: InputType) => {
            if (input.name !== action.payload.inputName) return input;

            return { ...input, focus: false };
          }),
        },
      };
    case 'AUDIT_FORM_VALIDATION':
      return {
        ...state,
        [action.payload.formName]: {
          ...state[action.payload.formName],
          valid: action.payload.validations.form,
          inputs: state[action.payload.formName].inputs.map((input: InputType) => ({
            ...input,
            validation: action.payload.validations[input.name],
          })),
        },
      };
    default:
      return state;
  }
};
