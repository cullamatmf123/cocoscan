import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, BackHandler, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConditionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [weather, setWeather] = useState('');
  const [soil, setSoil] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract all parameters from the navigation
  const {
    imageUri,
    prediction = 'Unknown',
    confidence = '0',
    details = '',
    recommendations = 'No recommendations available'
  } = params as {
    imageUri?: string;
    prediction?: string;
    confidence?: string;
    details?: string;
    recommendations?: string;
  };

  const weatherOptions = [
    { label: 'Select weather condition', value: '' },
    { label: 'Sunny', value: 'sunny' },
    { label: 'Rainy', value: 'rainy' },
    { label: 'Cloudy', value: 'cloudy' },
    { label: 'Windy', value: 'windy' },
    { label: 'Other', value: 'other' },
  ];

  const soilOptions = [
    { label: 'Select soil type', value: '' },
    { label: 'Sandy', value: 'sandy' },
    { label: 'Clay', value: 'clay' },
    { label: 'Loamy', value: 'loamy' },
    { label: 'Peaty', value: 'peaty' },
    { label: 'Chalky', value: 'chalky' },
    { label: 'Silty', value: 'silty' },
  ];

  const handleSubmit = () => {
    if (!weather || !soil) {
      Alert.alert('Incomplete Information', 'Please select both weather and soil conditions.');
      return;
    }

    if (!imageUri) {
      Alert.alert('Error', 'No image data available. Please go back and take a photo again.');
      return;
    }

    setIsSubmitting(true);
    
    // Navigate to result page with all collected data
    router.push({
      pathname: '/result',
      params: {
        imageUri,
        prediction,
        confidence,
        details,
        recommendations,
        weather,
        soil
      }
    });
  };

  useEffect(() => {
    const onBackPress = () => {
      router.back();
      return true;
    };
    
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

  const handleCancel = () => {
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>CocoScan</Text>
          <View style={{ flex: 1 }} />
          <View style={styles.iconCircleSmall}>
            <Text style={styles.palmTreeIconSmall}>🌴</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>External Conditions</Text>
          <Text style={styles.subtitle}>Please provide the following information:</Text>
          
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Weather Condition</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={weather}
                onValueChange={(itemValue) => setWeather(itemValue)}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                {weatherOptions.map((option) => (
                  <Picker.Item 
                    key={option.value} 
                    label={option.label} 
                    value={option.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Soil Type</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={soil}
                onValueChange={(itemValue) => setSoil(itemValue)}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                {soilOptions.map((option) => (
                  <Picker.Item 
                    key={option.value} 
                    label={option.label} 
                    value={option.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={handleCancel}
        disabled={isSubmitting}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#2d5a3d',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  iconCircleSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
    marginLeft: 10,
  },
  palmTreeIconSmall: {
    fontSize: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d5a3d',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#2d5a3d',
    marginBottom: 24,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2d5a3d',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: '#2d5a3d',
    borderRadius: 10,
    backgroundColor: '#f7f7f7',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#2d5a3d',
  },
  submitButton: {
    backgroundColor: '#FFD700',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#2d5a3d',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});