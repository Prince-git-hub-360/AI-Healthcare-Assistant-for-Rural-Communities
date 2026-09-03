import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Pill, Activity, FolderHeart, Settings, Camera } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY } from '../constants/theme';
import { PatientHomeScreen } from '../features/patient/PatientHomeScreen';
import { PatientMedicinesScreen } from '../features/patient/PatientMedicinesScreen';
import { PatientHealthMapScreen } from '../features/patient/PatientHealthMapScreen';
import { PatientRecordsScreen } from '../features/patient/PatientRecordsScreen';
import { PrescriptionScannerFlow } from '../features/scanner/PrescriptionScannerFlow';
import { ProfileScreen } from '../features/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const PatientTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
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
        name="Home"
        component={PatientHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Medicines"
        component={PatientMedicinesScreen}
        options={{
          tabBarLabel: 'Medicines',
          tabBarIcon: ({ color, size }) => <Pill size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Health"
        component={PatientHealthMapScreen}
        options={{
          tabBarLabel: 'Health Map',
          tabBarIcon: ({ color, size }) => <Activity size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Records"
        component={PatientRecordsScreen}
        options={{
          tabBarLabel: 'Records',
          tabBarIcon: ({ color, size }) => <FolderHeart size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const PatientStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatientTabs" component={PatientTabNavigator} />
      <Stack.Screen name="Scanner" component={PrescriptionScannerFlow} />
    </Stack.Navigator>
  );
};
