// @flow

import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';

import Form, { formReducer as form, valueReducer as value } from './bin';

const reducers = combineReducers({
  form, // <- Very importatn reducer
  value, // <- Very importatn reducer
});

const devText = '__DEV__';
const isDev = global[devText];

const debug = (typeof atob !== 'undefined');

const store = isDev || debug ?
  createStore(reducers, applyMiddleware(createLogger())) :
  createStore(reducers);

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
        <Text style={{ fontWeight: 'bold', fontSize: 22 }}>react-native-form-redux</Text>
        <Text style={{ color: '#bbb', marginBottom: 32 }}>Eduardo Grajales @edgravill</Text>
        <Form
          name="example"
          inputs={[
            {
              name: 'username',
              placeholder: 'Nombre de Usuario',
              type: 'text',
              TextInputProps: {
                autoCapitalize: 'none',
                autoCorrect: false,
              },
              validation: (val: string) => {
                if (!val.length) {
                  return {
                    valid: false,
                    message: 'El Nombre de Usuario no puede estar vacío',
                  };
                } else if (val.length < 6) {
                  return {
                    valid: false,
                    message: 'El Nombre de Usuario debe tener por lo menos 6 caracteres',
                  };
                } else if (val.length > 18) {
                  return {
                    valid: false,
                    message: 'El Nombre de Usuario no puede tener más de 18 caracteres',
                  };
                }

                return {
                  valid: true,
                  message: null,
                };
              },
            }, {
              name: 'password',
              placeholder: 'Contraseña',
              type: 'password',
              validation: (val: string) => {
                if (!val.length) {
                  return {
                    valid: false,
                    message: 'El Password no puede estar vacío',
                  };
                } else if (val.length < 6) {
                  return {
                    valid: false,
                    message: 'El Password debe tener por lo menos 6 caracteres',
                  };
                } else if (val.length > 18) {
                  return {
                    valid: false,
                    message: 'El Password no puede tener más de 18 caracteres',
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

export default App;
