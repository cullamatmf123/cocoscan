import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, BackHandler, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ConditionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [weather, setWeather] = useState('');
  const [soil, setSoil] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [lightCondition, setLightCondition] = useState('');
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
    { label: 'Partly Cloudy', value: 'partly_cloudy' },
    { label: 'Cloudy', value: 'cloudy' },
    { label: 'Overcast', value: 'overcast' },
    { label: 'Light Rain', value: 'light_rain' },
    { label: 'Heavy Rain', value: 'heavy_rain' },
    { label: 'Windy', value: 'windy' },
    { label: 'Foggy', value: 'foggy' },
  ];

  const soilOptions = [
    { label: 'Select soil type', value: '' },
    { label: 'Sandy', value: 'sandy' },
    { label: 'Clay', value: 'clay' },
    { label: 'Loamy', value: 'loamy' },
    { label: 'Peaty', value: 'peaty' },
    { label: 'Chalky', value: 'chalky' },
    { label: 'Silty', value: 'silty' },
    { label: 'Rocky', value: 'rocky' },
  ];

  const lightOptions = [
    { label: 'Select light condition', value: '' },
    { label: 'Direct Sunlight', value: 'direct_sunlight' },
    { label: 'Bright Shade', value: 'bright_shade' },
    { label: 'Partial Shade', value: 'partial_shade' },
    { label: 'Full Shade', value: 'full_shade' },
    { label: 'Artificial Light', value: 'artificial_light' },
    { label: 'Low Light', value: 'low_light' },
  ];

  const validateInputs = () => {
    if (!weather || !soil || !lightCondition) {
      Alert.alert('Incomplete Information', 'Please select weather, soil type, and light conditions.');
      return false;
    }

    if (!temperature.trim()) {
      Alert.alert('Missing Temperature', 'Please enter the current temperature.');
      return false;
    }

    if (!humidity.trim()) {
      Alert.alert('Missing Humidity', 'Please enter the current humidity level.');
      return false;
    }

    // Validate temperature range (reasonable for coconut growing regions: 15-45°C)
    const tempValue = parseFloat(temperature);
    if (isNaN(tempValue) || tempValue < -10 || tempValue > 60) {
      Alert.alert('Invalid Temperature', 'Please enter a valid temperature between -10°C and 60°C.');
      return false;
    }

    // Validate humidity range (0-100%)
    const humidityValue = parseFloat(humidity);
    if (isNaN(humidityValue) || humidityValue < 0 || humidityValue > 100) {
      Alert.alert('Invalid Humidity', 'Please enter a valid humidity percentage between 0% and 100%.');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateInputs()) {
      return;
    }

    if (!imageUri) {
      Alert.alert('Error', 'No image data available. Please go back and take a photo again.');
      return;
    }

    setIsSubmitting(true);
    
    // Navigate to result page with all collected environmental data
    router.push({
      pathname: '/result',
      params: {
        imageUri,
        prediction,
        confidence,
        details,
        recommendations,
        weather,
        soil,
        temperature: temperature.trim(),
        humidity: humidity.trim(),
        lightCondition
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
          <Text style={styles.title}>Environmental Conditions</Text>
          <Text style={styles.subtitle}>Provide detailed environmental data for accurate analysis:</Text>
          
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
            <Text style={styles.label}>Light Condition</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={lightCondition}
                onValueChange={(itemValue) => setLightCondition(itemValue)}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                {lightOptions.map((option) => (
                  <Picker.Item 
                    key={option.value} 
                    label={option.label} 
                    value={option.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Temperature (°C)</Text>
            <TextInput
              style={styles.textInput}
              value={temperature}
              onChangeText={setTemperature}
              placeholder="e.g., 28.5"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Humidity (%)</Text>
            <TextInput
              style={styles.textInput}
              value={humidity}
              onChangeText={setHumidity}
              placeholder="e.g., 75"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={3}
            />
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
              {isSubmitting ? 'Processing...' : 'Analyze Conditions'}
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
  inputContainer: {
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
  textInput: {
    borderWidth: 1.5,
    borderColor: '#2d5a3d',
    borderRadius: 10,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2d5a3d',
    height: 50,
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