// @flow

import { ActionType, InputType } from '../../types';

export const registerForm = (formName: string, inputs: Array<InputType>, validations: {}): ActionType => ({
  type: 'REGISTER_FORM',
  payload: { formName, inputs, validations },
});

export const focusFormInput = (formName: string, inputName: string): ActionType => ({
  type: 'FOCUS_FORM_INPUT',
  payload: { formName, inputName },
});

export const blurFormInput = (formName: string, inputName: string): ActionType => ({
  type: 'BLUR_FORM_INPUT',
  payload: { formName, inputName },
});

export const auditFormValidation = (formName: string, validations: {}) => ({
  type: 'AUDIT_FORM_VALIDATION',
  payload: { formName, validations },
});

export const setValue = (name: string, value: string | number | boolean): ActionType => ({
  type: 'SET_VALUE',
  payload: { name, value },
});

export const clearValue = (name: string): ActionType => ({
  type: 'CLEAR_VALUE',
  payload: name,
});
