import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    photoBase64,
    prediction = 'Unknown',
    confidence = '0',
    details = '',
    recommendations = 'No recommendations available'
  } = params as {
    imageUri?: string;
    photoBase64?: string;
    prediction?: string;
    confidence?: string;
    details?: string;
    recommendations?: string;
  };

  const weatherOptions = [
    { label: 'Select weather condition', value: '' },
    { label: 'Sunny', value: 'Sunny' },
    { label: 'Partly Cloudy', value: 'Partly Cloudy' },
    { label: 'Cloudy', value: 'Cloudy' },
    { label: 'Overcast', value: 'Overcast' },
    { label: 'Light Rain', value: 'Light Rain' },
    { label: 'Heavy Rain', value: 'Heavy Rain' },
    { label: 'Windy', value: 'Windy' },
    { label: 'Foggy', value: 'Foggy' },
  ];

  const soilOptions = [
    { label: 'Select soil type', value: '' },
    { label: 'Sandy', value: 'Sandy' },
    { label: 'Clay', value: 'Clay' },
    { label: 'Loamy', value: 'Loamy' },
    { label: 'Peaty', value: 'Peaty' },
    { label: 'Chalky', value: 'Chalky' },
    { label: 'Silty', value: 'Silty' },
    { label: 'Rocky', value: 'Rocky' },
  ];

  const lightOptions = [
    { label: 'Select light condition', value: '' },
    { label: 'Direct Sunlight', value: 'Direct Sunlight' },
    { label: 'Bright Shade', value: 'Bright Shade' },
    { label: 'Partial Shade', value: 'Partial Shade' },
    { label: 'Full Shade', value: 'Full Shade' },
    { label: 'Artificial Light', value: 'Artificial Light' },
    { label: 'Low Light', value: 'Low Light' },
  ];

  const validateInputs = () => {
    if (!weather || !soil || !lightCondition) {
      Alert.alert('Incomplete Information', 'Please fill in all fields');
      return false;
    }

    if (!temperature.trim() || isNaN(Number(temperature)) || 
        Number(temperature) < -10 || Number(temperature) > 60) {
      Alert.alert('Invalid Temperature', 'Please enter a valid temperature between -10°C and 60°C');
      return false;
    }

    if (!humidity.trim() || isNaN(Number(humidity)) || 
        Number(humidity) < 0 || Number(humidity) > 100) {
      Alert.alert('Invalid Humidity', 'Please enter a valid humidity percentage between 0% and 100%');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    if (!imageUri && !photoBase64) {
      Alert.alert('Error', 'No image data available. Please go back and take a photo again.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create enhanced details with environmental conditions
      const enhancedDetails = `${details}\n\nEnvironmental Conditions:\n• Temperature: ${temperature}°C\n• Humidity: ${humidity}%\n• Light: ${lightCondition}`;
      
      // Create history item using the historyService
      const historyItem = await addHistoryItem({
        imageUri: imageUri || undefined,
        photoBase64: photoBase64 || undefined,
        prediction,
        confidence,
        details: enhancedDetails,
        recommendations,
        weather,
        soil
      });

      // Navigate to result page with all the data
      router.push({
        pathname: '/result',
        params: {
          id: historyItem.id,
          fromHistory: '0', // Indicates this is a new scan, not from history
          imageUri: imageUri || undefined,
          photoBase64: photoBase64 || undefined,
          prediction,
          confidence,
          details: enhancedDetails,
          recommendations,
          weather,
          soil,
          temperature,
          humidity,
          lightCondition
        }
      });

    } catch (error) {
      console.error('Error saving scan to history:', error);
      Alert.alert('Error', 'Failed to save scan data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Cancel Scan',
        'Are you sure you want to cancel? All unsaved data will be lost.',
        [
          { text: 'No', onPress: () => null, style: 'cancel' },
          { text: 'Yes', onPress: () => router.back() }
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Environmental Conditions</Text>
          <Text style={styles.subtitle}>Provide details about the current conditions</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Weather Condition</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={weather}
              onValueChange={(itemValue) => setWeather(itemValue)}
              style={styles.picker}
            >
              {weatherOptions.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Soil Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={soil}
              onValueChange={(itemValue) => setSoil(itemValue)}
              style={styles.picker}
            >
              {soilOptions.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Temperature (°C)</Text>
          <TextInput
            style={styles.input}
            value={temperature}
            onChangeText={setTemperature}
            placeholder="e.g., 25.5"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Humidity (%)</Text>
          <TextInput
            style={styles.input}
            value={humidity}
            onChangeText={setHumidity}
            placeholder="e.g., 70"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Light Condition</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={lightCondition}
              onValueChange={(itemValue) => setLightCondition(itemValue)}
              style={styles.picker}
            >
              {lightOptions.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Analyze Conditions</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#2d5a3d',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#4a7c59',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#4a7c59',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4a7c59',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
});