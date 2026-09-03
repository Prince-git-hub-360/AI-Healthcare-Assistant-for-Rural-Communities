import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Users, Camera, Settings } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { AshaHomeScreen } from '../features/asha/AshaHomeScreen';
import { PrescriptionScannerFlow } from '../features/scanner/PrescriptionScannerFlow';
import { ProfileScreen } from '../features/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AshaTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.secondaryDark,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Roster"
        component={AshaHomeScreen}
        options={{
          tabBarLabel: 'Patient Roster',
          tabBarIcon: ({ color }) => <Users size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Scanner"
        component={PrescriptionScannerFlow}
        options={{
          tabBarLabel: 'Field Scan',
          tabBarIcon: ({ color }) => <Camera size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const AshaStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AshaTabs" component={AshaTabNavigator} />
    </Stack.Navigator>
  );
};
