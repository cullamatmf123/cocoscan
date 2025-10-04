import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Simulate loading assets or making API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Error during app initialization:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Hide the splash screen once the app is ready
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Don't render anything until the app is ready
  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'default',
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
        {/* Main Screens */}
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Home',
            headerShown: false,
          }} 
        />
        
        <Stack.Screen 
          name="home" 
          options={{ 
            title: 'Home',
            headerShown: false,
            animation: 'fade',
          }} 
        />
        
        {/* Authentication Screens */}
        <Stack.Screen 
          name="signin" 
          options={{ 
            title: 'Sign In',
            headerShown: false,
            animation: 'slide_from_right',
          }} 
        />
        
        <Stack.Screen 
          name="signup" 
          options={{ 
            title: 'Sign Up',
            headerShown: false,
            animation: 'slide_from_right',
          }} 
        />
        
        {/* Main Feature Screens */}
        <Stack.Screen 
          name="camera" 
          options={{ 
            title: 'Camera',
            headerShown: false,
            animation: 'fade',
            presentation: 'modal',
          }} 
        />
        
        <Stack.Screen 
          name="conditions" 
          options={{ 
            title: 'Conditions',
            headerShown: false,
            animation: 'slide_from_right',
          }} 
        />
        
        <Stack.Screen 
          name="result" 
          options={{ 
            title: 'Result',
            headerShown: false,
            animation: 'slide_from_right',
          }} 
        />
        
        <Stack.Screen 
          name="about" 
          options={{ 
            title: 'About Plant',
            headerShown: false,
            animation: 'slide_from_right',
          }} 
        />
        
        <Stack.Screen 
          name="treatment" 
          options={{ 
            title: 'Treatment',
            headerShown: false,
            animation: 'slide_from_right',
          }} 
        />
      </Stack>
    </View>
  );
}