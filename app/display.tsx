import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { apiService } from '../services/api';
import DoctorProfileCard from '../components/DoctorProfileCard';
import PatientList from '../components/PatientList';
import YouTubePlayer from '../components/YouTubePlayer';

interface Patient {
  serialNumber: number;
  patientName: string;
  status: string;
  statusBgColor: string;
  estimatedTime: string;
  appointmentId: number;
  statusCode: string;
}

interface LiveData {
  chamber: {
    id: number;
    name: string;
    appointmentNumber: string;
    address: string;
    videoUrl?: string;
    isActive: boolean;
  };
  doctor: {
    id: number;
    fullName: string;
    phone: string;
    email?: string;
    profilePicture?: string;
  };
  patients: Patient[];
  breakStatus: boolean;
  timestamp: string;
}

export default function DisplayScreen() {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadLiveData();
    startAutoRefresh();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  const startAutoRefresh = () => {
    // Refresh every 3 seconds for real-time updates
    refreshIntervalRef.current = setInterval(() => {
      loadLiveData(false);
    }, 3000);
  };

  const loadLiveData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const data = await apiService.getLiveData();
      setLiveData(data);
    } catch (error: any) {
      console.error('Error loading live data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLiveData(false);
  };

  if (loading && !liveData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!liveData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Top Section: Doctor Profile and Patient List */}
        <View style={styles.topSection}>
          {/* Left: Doctor Profile */}
          <View style={styles.leftPanel}>
            <DoctorProfileCard doctor={liveData.doctor} />
          </View>

          {/* Right: Patient List */}
          <View style={styles.rightPanel}>
            <PatientList
              patients={liveData.patients}
              breakStatus={liveData.breakStatus}
              appointmentNumber={liveData.chamber.appointmentNumber}
            />
          </View>
        </View>

        {/* Bottom Section: YouTube Video */}
        {liveData.chamber.videoUrl && (
          <View style={styles.videoSection}>
            <YouTubePlayer videoUrl={liveData.chamber.videoUrl} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#ff0000',
  },
  topSection: {
    flexDirection: 'row',
    minHeight: 400,
  },
  leftPanel: {
    width: '30%',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  rightPanel: {
    width: '70%',
    padding: 20,
    backgroundColor: '#f9f9f9',
    height: '80%', // 80% of screen height
  },
  videoSection: {
    width: '100%',
    height: 400,
    backgroundColor: '#000',
    marginTop: 20,
  },
});

