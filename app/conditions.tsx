import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, BackHandler, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

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

    if (!imageUri) {
      Alert.alert('Error', 'No image data available. Please go back and take a photo again.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create a new document in the 'scans' collection
      const scanRef = doc(collection(db, 'scans'));
      const scanData = {
        userId: user.uid,
        imageUri,
        prediction,
        confidence: parseFloat(confidence),
        details,
        recommendations,
        conditions: {
          weather,
          soil,
          temperature: parseFloat(temperature),
          humidity: parseFloat(humidity),
          lightCondition
        },
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(scanRef, scanData);

      // Navigate to result page with the scan ID
      router.push({
        pathname: '/result',
        params: {
          scanId: scanRef.id,
          ...params,
          weather,
          soil,
          temperature,
          humidity,
          lightCondition
        }
      });

    } catch (error) {
      console.error('Error saving scan:', error);
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
            <Text style={styles.submitButtonText}>Submit Conditions</Text>
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