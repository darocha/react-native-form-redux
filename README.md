# react-native-form-redux
*React Native Form Component highly customizable with redux integration and validation engine*

## Expo Example
![qr](https://raw.githubusercontent.com/EdGraVill/react-native-form-redux/master/expoExampleQR.png)

## Installation

Into your project's root directory run the following command:

##### npm
```bash
npm i -P react-native-form-redux
```

##### Yarn
```bash
yarn add react-native-form-redux
```

This package also need some dependencies because it's build with redux, we assume you have it installed, either way the list of these dependencies is below:

- react
- react-native
- react-redux
- redux

## Implementation

You may do the integration with your current project before to use this package.

Add the reducer to your store.

```javascript
import { combineReducers } from 'redux';
import Form, { formReducer as form, valueReducer as value } from 'react-native-form-redux';

const reducers = combineReducers({
  // your list of reducers
  form,
  value,
});
```

### formReducer

This reducer handle the behavior under the form.

Let's assume we have a form named "login", and we have 2 inputs whit its own validations: username and password. Then our reducer looks like this below.

```javascript
{
  login: {
    name: 'login',
    valid: false,
    inputs: [
      {
        name: 'username',
        focus: false,
        validation: {
          valid: false,
          message: '',
        }
      }, {
        name: 'password',
        focus: false,
        validation: {
          valid: false,
          message: '',
        },
      },
    ],
  },
};
```

### valueReducer

This is more simple, it's a simple key-value storage for cross-component information sharing.

Continuing with the previous example, now assume we have typing data in the inputs. Then our reducer looks like this below.

```javascript
{
  username: 'foosername',
  password: 'bazzword123',
};
```

## Basic Usage

We will create a basic login example:

```javascript
// @flow

import React from 'react';
import { Text, View, ScrollView, AppRegistry } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';

import Form, { formReducer as form, valueReducer as value } from 'react-native-form-redux';

const reducers = combineReducers({
  form, // <- Very importatn reducer
  value, // <- Very importatn reducer
});

const store = createStore(reducers);

const App = () => (
  <Provider store={store}>
    <ScrollView keyboardShouldPersistTaps="handled">
      <View
        style={{
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
          paddingTop: 50,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 22 }}>Login</Text>
        <Text style={{ color: '#bbb', marginBottom: 32 }}>Please, type your credentials</Text>
        <Form
          action={(validForm, messages) => {
            if (!validForm) {
              Alert.alert('Please fix the following', messages.join(', '));
            } else {
              performLogin();
            }
          }}
          name="login"
          inputs={[
            {
              name: 'username',
              placeholder: 'Username',
              type: 'text',
              TextInputProps: {
                autoCapitalize: 'none',
                autoCorrect: false,
              },
              validation: (val: string) => {
                if (!val.length) {
                  return {
                    valid: false,
                    message: 'Username cannot be empty',
                  };
                } else if (val.length < 6) {
                  return {
                    valid: false,
                    message: 'Username must have 6 characters at least',
                  };
                } else if (val.length > 18) {
                  return {
                    valid: false,
                    message: 'Username cannot have more than 18 characters',
                  };
                }

                return {
                  valid: true,
                  message: null,
                };
              },
            }, {
              name: 'password',
              placeholder: 'Password',
              type: 'password',
              validation: (val: string) => {
                if (!val.length) {
                  return {
                    valid: false,
                    message: 'Password cannot be empty',
                  };
                } else if (val.length < 6) {
                  return {
                    valid: false,
                    message: 'Password must have 6 characters at least',
                  };
                } else if (val.length > 18) {
                  return {
                    valid: false,
                    message: 'Password cannot have more than 18 characters',
                  };
                }

                return {
                  valid: true,
                  message: null,
                };
              },
            },
          ]}
          formStyle={{ width: '100%' }}
        />
      </View>
    </ScrollView>
  </Provider>
);

AppRegistry.registerComponent('trask', (): React.Node => App);
```

### Props

|Prop|Type|Default|Description|
|---|---|---|---|
|**action** (*Optional*)|Function|`() => {}`|Function to execute when form is sended.
|**title** (*Optional*)|string|`undefined`|Builtin Title
|**titleColor** (*Optional*)|string|`undefined`|HEX, RGB or RGBA string color for builtin title
|**presentationalText** (*Optional*)|string|`undefined`|Builtin text below title
|**presentationalTextColor** (*Optional*)|string|`undefined`|HEX, RGB or RGBA string color for builtin text below title
|**name** (*Required*)|string|`undefined`|String id for the form
|**inputs** (*Required*)|Array<`InputObject`>|`undefined`|Array with the `InputObject` for input's declaration
|**inactiveColor** (*Optional*)|string|<span style="border: 5px solid #BBB; border-radius: 5px">`'#BBB'`</span>|Unfocused color
|**activeColor** (*Optional*)|string|<span style="border: 5px solid #000; border-radius: 5px">`'#000'`</span>|Focused color
|**successColor** (*Optional*)|string|<span style="background-color: #00CC6A">`'#00CC6A'`</span>|Validation message color when is valid
|**errorColor** (*Optional*)|string|<span style="background-color: #E74856">`'#E748v56'`</span>|Validation message color when is valid
|**formStyle** (*Optional*)|Object|`undefined`|Style object of the top \<View\> form component
|**inputsContainerStyle** (*Optional*)|Object|`undefined`|Style object of the \<View\> component that contains the inputs
|**inputContainerStyle** (*Optional*)|Object|`undefined`|Style object of the \<View\> component that contains the \<TextInput\> component and placeholder text
|**placeholderStyle** (*Optional*)|Object|`undefined`|Style object of the placeholder \<Text\> component
|**inputStyle** (*Optional*)|Object|`undefined`|Style object of the \<TextInput\> component
|**messageStyle** (*Optional*)|Object|`undefined`|Style object of the validation \<Text\> component message

#### Prop: action

This is a callback function when form is "sended", like the html form tag. This  callback recibes 2 parameters from the validation engine to help developer dertemine if the action can be continue or not. These parameters are:

- **validForm**: Boolean that returns true if all inputs in the form are valid.
- **messages**: Array of strings with the error messages, if there any message. It always return an Array, could be an empty array.

Example:
```javascript
<Form
  action={(validForm, messages) => {
    if (!validForm) {
      Alert.alert('Please fix the following', messages.join(', '));
    } else {
      performLogin();
    }
  }}
  name="login"
  inputs=[...]
/>
```

#### InputObject

When we declare our form, we will declare each input too, this is because the package need be highly customizable.

|Key|Type|Default|Description
|---|---|---|---|
|name|string|`undefined`|Name of the input
|placeholder|string|input's name|Placeholder text
|type|Enum (`'text', 'password', 'email', 'number', 'phone', 'search'`)|`'text'`|Type of input will recibe, this also helps to show right keyboard type
|TextInputProps|Object|`undefined`|Extra props you want to pass to the `<TextInput>` component.
|validation|Function|`() => ({ valid: true, message: null })`|Function to check validation of the typed text

##### validation

This is a callback function when the input is losing the focus. This callback recibes the text value as only parameter, so you can compare if is valid or not. To keep a right functionality you need always return the **validationObject** which is a simple object with two keys:

- **valid**: Boolean that determines if the text input is valid
- **message**: Can be a `string` or `null` to display in below the input

Example:
```javascript
<Form
  action={(validForm, messages) => {
    if (!validForm) {
      Alert.alert('Your search text is wrong', messages[0]);
    } else {
      search();
    }
  }}
  name="login"
  inputs={[{
    name: 'search',
    placeholder: 'Search some funny',
    type: 'search',
    TextInputProps: {
      autoCapitalize: 'none',
    },
    validation: (val: string) => {
      if (!val) return { valid: false, message: 'Please, fill the search input' };
      if (val.length < 8) return { valid: false, message: 'Your search is too short' };
      if (val.length > 80) return { valid: false, message: 'Your search is too long' };

      return { valid: true, message: 'Your search looks funny' };
    }
  }]}
/>
```

## Redux's Advantage

Because every action in the form dispatch an state mutation we can perform some conditional UI design like a disabled button if form's validation is false.

Also every value in the form is keeped in the redux's storage, so you can manipulate and work with it.

## License

MIT License

Copyright (c) 2018 Eduardo Grajales Villanueva

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
