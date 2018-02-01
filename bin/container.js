// @flow

import { connect } from 'react-redux';

import {
  registerForm,
  focusFormInput,
  blurFormInput,
  auditFormValidation,
} from './actions';
import {
  setValue,
} from '../../actions';
import Form from './component';
import { FormPropsType, StorageType, InputType } from '../../types';

const mapStateToProps = (state: StorageType): FormPropsType => ({
  form: state.form,
  value: state.value,
});

const mapDispatchToProps = (dispatch: Function): FormPropsType => ({
  registerForm: (formName: string, inputs: Array<InputType>, validations: {}): void =>
    dispatch(registerForm(formName, inputs, validations)),
  focusFormInput: (formName: string, inputName: string): void =>
    dispatch(focusFormInput(formName, inputName)),
  blurFormInput: (formName: string, inputName: string): void =>
    dispatch(blurFormInput(formName, inputName)),
  setValue: (name: string, value: string | number | boolean) =>
    dispatch(setValue(name, value)),
  auditFormValidation: (formName: string, validations: {}) =>
    dispatch(auditFormValidation(formName, validations)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);
