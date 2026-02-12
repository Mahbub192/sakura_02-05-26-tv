import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DisplayScreen() {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    loadLiveData();
    startAutoRefresh();
    startTextScroll();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  console.log(67,'liveData', liveData);

  const startAutoRefresh = () => {
    // Refresh every 3 seconds for real-time updates
    refreshIntervalRef.current = setInterval(() => {
      loadLiveData(false);
    }, 3000);
  };

  const startTextScroll = () => {
    // Auto-scroll text animation - continuous loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(scrollX, {
          toValue: -SCREEN_WIDTH * 2,
          duration: 60000, // 30 seconds for full scroll
          useNativeDriver: true,
        }),
        Animated.timing(scrollX, {
          toValue: SCREEN_WIDTH,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
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
    }
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
      {/* Main Content Area - 85% height */}
      <View style={styles.mainContent}>
        {/* Left Panel: Doctor Card + YouTube Video */}
        <View style={styles.leftPanel}>
          <DoctorProfileCard doctor={liveData.doctor} />
          
          {/* YouTube Video below Doctor Card */}
          {liveData.chamber.videoUrl && (
            <View style={styles.videoContainer}>
              <YouTubePlayer videoUrl={liveData.chamber.videoUrl} />
            </View>
          )}
        </View>

        {/* Right Panel: Appointment List */}
        <View style={styles.rightPanel}>
          <PatientList
            patients={liveData.patients}
            breakStatus={liveData.breakStatus}
            appointmentNumber={liveData.chamber.appointmentNumber}
          />
        </View>
      </View>

      {/* Auto-scrolling Bottom Banner */}
      <View style={styles.bottomBanner}>
        <Animated.View
          style={[
            styles.scrollingTextContainer,
            {
              transform: [{ translateX: scrollX }],
            },
          ]}
        >
          <Text style={styles.scrollingText}>
            সিরিয়াল অনুযায়ী সেবা দেয়া হবে তাই আপনার সিরিয়াল আসা পর্যন্ত অপেক্ষা করুন। ধন্যবাদ। • Service will be provided according to the serial, so please wait until your turn comes. Thank you. • 
          </Text>
        </Animated.View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Sakura App</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainContent: {
    flexDirection: 'row',
    height: '85%', // 85% of screen height
  },
  leftPanel: {
    width: '30%',
    padding: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
  },
  videoContainer: {
    marginTop: 20,
    height: 300,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  rightPanel: {
    width: '70%',
    padding: 20,
    backgroundColor: '#f9f9f9',
    height: '100%',
  },
  bottomBanner: {
    height: 50,
    backgroundColor: '#2c2c2c',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  scrollingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    ...(Platform.OS === 'web' ? {
      whiteSpace: 'nowrap',
    } : {}),
    paddingHorizontal: 20,
  },
  footer: {
    height: 40,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
});

