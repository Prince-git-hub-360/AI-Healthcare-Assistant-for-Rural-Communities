import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../features/auth/LoginScreen';
import { PatientStack } from './PatientTabs';
import { AshaStack } from './AshaTabs';
import { CaregiverHomeScreen } from '../features/caregiver/CaregiverHomeScreen';
import { DoctorHomeScreen } from '../features/doctor/DoctorHomeScreen';
import { MobileFrame } from '../components/frame/MobileFrame';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <MobileFrame>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : role === 'HEALTHCARE_WORKER' ? (
            <Stack.Screen name="AshaApp" component={AshaStack} />
          ) : role === 'CAREGIVER' ? (
            <Stack.Screen name="CaregiverApp" component={CaregiverHomeScreen} />
          ) : role === 'DOCTOR' ? (
            <Stack.Screen name="DoctorApp" component={DoctorHomeScreen} />
          ) : (
            <Stack.Screen name="PatientApp" component={PatientStack} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </MobileFrame>
  );
};
