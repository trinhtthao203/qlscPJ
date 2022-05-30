import Icon from 'react-native-vector-icons/FontAwesome5';
import {theme} from 'native-base';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
const Tab = createBottomTabNavigator();
import AlertScreen from './AlertScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ListScreen from './ListScreen';

export default TabBar = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {height: 70, paddingTop: 10, paddingBottom: 10},
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="list" color={color} size={size} />
          ),
        }}
        name="Danh sách"
        component={ListScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="tv" color={color} size={size} />
          ),
        }}
        name="Theo dõi & giám sát"
        component={AlertScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="adjust" color={color} size={size} />
          ),
        }}
        name="Biểu đồ"
        component={AlertScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="bell" color={color} size={size} />
          ),
        }}
        name="Thông báo"
        component={AlertScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
        name="Cá nhân"
        component={AlertScreen}
      />
    </Tab.Navigator>
  );
};
