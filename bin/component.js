// @flow

import React, { Component, Node } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  NativeModules,
  LayoutAnimation,
} from 'react-native';

import { FormPropsType, InputType } from './types';
import styles from './styles';

const { UIManager } = NativeModules;

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default class Form extends Component<FormPropsType> {
  componentWillMount(): void {
    const {
      name,
      inputs,
      form,
      registerForm,
      setValue,
    } = this.props;

    const validations = {
      form: true,
    };

    if (!name) return new Error('Debe indicarse el nombre el Form');
    if (!inputs.length) return new Error('Debe indicarse por lo menos un input');
    inputs.forEach((input: InputType, index: number) => {
      if (!input.name) return new Error('Alguno de los inputs no tiene el atributo "name"');
      if (!input.validation) {
        inputs[index].validation = () => ({ valid: true, message: null });
        validations[input.name] = { valid: true, message: null };
        validations.form = Boolean(validations.form * true);
      } else {
        const validation = input.validation(input.value || '');
        validations[input.name] = validation;
        validations.form = Boolean(validations.form * validation.valid);
      }
      if (input.value) setValue(input.name, input.value);

      this.setState({
        [input.name]: {
          bottom: 18,
          color: '#bbb',
          fontSize: 14,
          left: 15,
          validation: {
            valid: false,
            message: null,
          },
        },
      });

      return true;
    });

    if (!form[name]) registerForm(name, inputs, validations);

    return true;
  }

  ref = {};

  focusFormInput(inputName: string) {
    LayoutAnimation.spring();

    this.setState({
      [inputName]: {
        ...this.state[inputName],
        bottom: 50,
        color: '#000',
        fontSize: 10,
        left: 4,
        validation: {
          ...this.state[inputName].validation,
          message: null,
        },
      },
    });
  }

  blurFormInput(inputName: string, onlyColor: boolean = false, validator: {}): Promise {
    const { name, auditFormValidation } = this.props;

    return new Promise((resolve: Promise.resolve) => {
      LayoutAnimation.spring();

      const { validation, getValue } = validator;

      if (onlyColor) {
        this.setState({
          [inputName]: {
            ...this.state[inputName],
            bottom: 50,
            color: '#000',
            fontSize: 10,
            left: 4,
            validation: validation(getValue(inputName)),
          },
        }, () => {
          const validations = {
            form: true,
          };

          Object.keys(this.state).forEach((iName: string) => {
            const input = this.state[iName];

            validations[iName] = input.validation;
            validations.form = Boolean(validations.form * input.validation.valid);
          });

          auditFormValidation(name, validations);
          resolve();
        });
      } else {
        this.setState({
          [inputName]: {
            ...this.state[inputName],
            bottom: 18,
            color: '#bbb',
            fontSize: 14,
            left: 15,
            validation: validation(getValue(inputName)),
          },
        }, () => {
          const validations = {
            form: true,
          };

          Object.keys(this.state).forEach((iName: string) => {
            const input = this.state[iName];

            validations[iName] = input.validation;
            validations.form = Boolean(validations.form * input.validation.valid);
          });

          auditFormValidation(name, validations);
          resolve();
        });
      }
    });
  }

  formValidation(action: Function) {
    let validForm = true;

    Object.keys(this.state).forEach((inputName: string) => {
      const input = this.state[inputName];

      validForm = Boolean(validForm * input.validation.valid);
    });

    if (!validForm) {
      const messages = Object.keys(this.state).map((inputName: string) => {
        const input = this.state[inputName];

        return input.validation.message;
      });

      action(validForm, messages);
    } else {
      action(validForm);
    }
  }

  handleSubmit(inputName: string, action: Form) {
    const index = Object.keys(this.ref).findIndex((name: string) => name === inputName);

    try {
      this.ref[Object.keys(this.ref)[index + 1]].focus();
    } catch (e) {
      this.formValidation(action);
    }
  }

  render(): Node {
    const {
      action,
      title,
      titleColor = '#000',
      presentationalText,
      presentationalTextColor = '#000',
      name,
      inputs,
      inactiveColor = '#bbb',
      activeColor = '#000',
      successColor = '#00CC6A',
      errorColor = '#E74856',
      value,
      form,
      focusFormInput,
      blurFormInput,
      setValue,
    } = this.props;

    const getValue = (n: string) => {
      if (value[n]) {
        return value[n].toString();
      }

      return '';
    };

    return (
      <View style={styles.formView}>
        {(title || presentationalText) && (
          <View style={styles.headerView}>
            {title && <Text style={[styles.title, { color: titleColor }]}>{title}</Text>}
            {presentationalText && (
              <Text style={[styles.presentationalText, { color: presentationalTextColor }]}>
                {presentationalText}
              </Text>
            )}
          </View>
        )}
        <View style={styles.inputsView}>
          {inputs.map((input: InputType) => {
            const inputObject = form[name] &&
              form[name].inputs.find((i: {}) => i.name === input.name);

            return (
              <TouchableWithoutFeedback
                onPress={() => {
                  if (!inputObject.focus && this.ref[input.name]) {
                    this.ref[input.name].focus();
                  }
                }}
                key={input.name}
              >
                <View>
                  <View style={styles.inputView}>
                    <Text
                      style={[{
                        bottom: this.state[input.name].bottom,
                        color: this.state[input.name].color,
                        fontFamily: 'Open Sans',
                        fontSize: this.state[input.name].fontSize,
                        left: this.state[input.name].left,
                        position: 'absolute',
                      }, this.state[input.name].validation.message &&
                        !this.state[input.name].validation.valid ?
                        { color: errorColor } : {},
                      this.state[input.name].validation.message &&
                        this.state[input.name].validation.valid ?
                        { color: successColor } : {}]}
                    >
                      {input.placeholder}
                    </Text>
                    <TextInput
                      autoCorrect={input.autoCorrect === undefined}
                      onBlur={() => {
                        blurFormInput(name, input.name);
                        this.blurFormInput(input.name, !!getValue(input.name), {
                          getValue,
                          validation: input.validation,
                        });
                      }}
                      onChangeText={(val: string) => setValue(input.name, val)}
                      onFocus={() => {
                        focusFormInput(name, input.name);
                        this.focusFormInput(input.name);
                      }}
                      onSubmitEditing={() => {
                        this.blurFormInput(input.name, !!getValue(input.name), {
                          getValue,
                          validation: input.validation,
                        }).then(() => this.handleSubmit(input.name, action));
                      }}
                      ref={(ref: Node) => { this.ref[input.name] = ref; }}
                      secureTextEntry={input.type === 'password'}
                      style={[
                        styles.textInput,
                        inputObject && inputObject.focus ?
                          { borderColor: activeColor } : { borderColor: inactiveColor },
                        getValue(input.name) ? { borderColor: activeColor } : {},
                        this.state[input.name].validation.message &&
                          !this.state[input.name].validation.valid ?
                          { borderColor: errorColor } : {},
                        this.state[input.name].validation.message &&
                          this.state[input.name].validation.valid ?
                          { borderColor: successColor } : {},
                      ]}
                      underlineColorAndroid="transparent"
                      value={getValue(input.name)}
                      {...{
                        ...input.TextInputProps || {},
                      }}
                    />
                  </View>
                  {this.state[input.name].validation.message && (
                    <Text
                      style={[
                        styles.validationText,
                        {
                          color: this.state[input.name].validation.valid ?
                            successColor : errorColor,
                        },
                      ]}
                    >
                      {this.state[input.name].validation.message}
                    </Text>
                  )}
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </View>
    );
  }
}
