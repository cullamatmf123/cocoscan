import { router } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PesticideRecommendationScreen() {
  useEffect(() => {
    // Navigate to About screen with the pesticide tab selected
    router.replace({ pathname: '/about', params: { tab: 'pesticide' } });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.text}>Redirecting to Pesticide Recommendation…</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.replace({ pathname: '/about', params: { tab: 'pesticide' } })}>
          <Text style={styles.btnText}>Go now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  text: { color: '#1f2937', marginBottom: 12, fontWeight: '700' },
  btn: { backgroundColor: '#2d5a3d', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '900' },
});
