import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiService } from '../services/api';

export default function AppointmentNumberScreen() {
  const router = useRouter();
  const [appointmentNumber, setAppointmentNumber] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [chamberName, setChamberName] = useState<string>('');

  useEffect(() => {
    loadAppointmentNumber();
  }, []);

  const loadAppointmentNumber = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAppointmentNumber();
      setAppointmentNumber(data.appointmentNumber || '');
      setChamberName(data.chamberName || '');
    } catch (error: any) {
      console.error('Error loading appointment number:', error);
      Alert.alert('Error', 'Failed to load appointment number');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push('/display');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Appointment Number</Text>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{appointmentNumber || 'Loading...'}</Text>
        </View>
        {chamberName ? (
          <Text style={styles.chamberName}>{chamberName}</Text>
        ) : null}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  numberContainer: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 60,
    paddingVertical: 30,
    borderRadius: 20,
    marginBottom: 30,
    elevation: 8,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    }),
  },
  numberText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  chamberName: {
    fontSize: 24,
    color: '#666',
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 4,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    }),
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
});

