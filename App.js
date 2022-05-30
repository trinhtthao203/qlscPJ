/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import axios from 'axios';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import LogIn from './Screens/LogIn';
import TabBar from './Screens/TabBar';
import FilterScreen from './Screens/FilterScreen';
import ListScreen from './Screens/ListScreen';
import {Provider} from 'react-redux';
import {store} from './Contains/Store';

axios.defaults.baseURL = 'https://qlsc.maysoft.io/server/api';
const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <View style={styles.container}>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="LogIn" component={LogIn} />
            <Stack.Screen name="TabBar" component={TabBar} />
            <Stack.Screen name="ListScreen" component={ListScreen} />
            <Stack.Screen name="FilterScreen" component={FilterScreen} />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
