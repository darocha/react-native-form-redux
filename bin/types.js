// @flow

// Reducers

export type ActionType = {
  type: string,
  payload?: any
};

export type FormReducerType = {
  [name: string]: {
    name: string,
    inputs: Array<{
      name: string,
      focus: boolean,
      valid: boolean,
      message: ?string
    }>
  }
};

export type ValueReducerType = {
  [name: string]: string
};

// Components

export type InputType = {
  name: string,
  placeholder: string,
  type: string,
  value: string,
  autoCorrect: boolean,
  TextInputProps: {
    [prop: string]: boolean | string
  }
};

export type FormPropsType = {
  action: Function,
  title?: string,
  titleColor?: string,
  presentationalText?: string,
  presentationalTextColor?: string,
  name: string,
  inputs: Array<InputType>,
  form: FormReducerType,
  inactiveColor?: string,
  activeColor?: string,
  successColor?: string,
  errorColor?: string,
  // customStyles
  formStyle: {},
  inputsContainerStyle: {},
  inputContainerStyle: {},
  placeholderStyle: {},
  inputStyle: {},
  messageStyle: {},
  registerForm: (formName: string, inputs: Array<InputType>) => void,
  focusFormInput: (formName: string, inputName: string) => void,
  blurFormInput: (formName: string, inputName: string) => void,
  auditFormValidation: (formName: string, validations: {
    form: boolean,
    [inputName: string]: {
      valid: boolean,
      message: ?string
    }
  }) => void
};
