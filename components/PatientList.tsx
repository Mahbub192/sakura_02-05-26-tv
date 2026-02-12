import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Patient {
  serialNumber: number;
  patientName: string;
  status: string;
  statusBgColor: string;
  estimatedTime: string;
  appointmentId: number;
  statusCode: string;
}

interface Props {
  patients: Patient[];
  breakStatus: boolean;
  appointmentNumber: string;
}

export default function PatientList({ patients, breakStatus, appointmentNumber }: Props) {
  const scrollViewRef = useRef<ScrollView>(null);
  const previousRunningIndexRef = useRef<number>(-1);

  // Sort patients: Maintain serial order (1,2,3,4,5,6,7,8,9...), Running at top
  const sortedPatients = React.useMemo(() => {
    // Sort all patients by serial number first (maintain natural order)
    const sortedBySerial = [...patients].sort((a, b) => a.serialNumber - b.serialNumber);
    
    // Find running patient
    const runningIndex = sortedBySerial.findIndex(p => p.statusCode === 'running');
    
    if (runningIndex === -1) {
      // No running patient, return as is
      return sortedBySerial;
    }
    
    // Move running patient to top, keep others in serial order
    const runningPatient = sortedBySerial[runningIndex];
    const beforeRunning = sortedBySerial.slice(0, runningIndex);
    const afterRunning = sortedBySerial.slice(runningIndex + 1);
    
    // Combine: Running -> Rest in serial order
    return [runningPatient, ...afterRunning, ...beforeRunning];
  }, [patients]);

  // Find running patient index and next patient index
  const runningIndex = sortedPatients.findIndex(p => p.statusCode === 'running');
  const nextPatientIndex = runningIndex >= 0 ? runningIndex + 1 : -1;

  // Auto-scroll to running patient when it changes
  useEffect(() => {
    // Only scroll if running index changed
    if (runningIndex >= 0 && runningIndex !== previousRunningIndexRef.current) {
      previousRunningIndexRef.current = runningIndex;
      
      // Small delay to ensure layout is complete
      setTimeout(() => {
        if (scrollViewRef.current) {
          // Calculate approximate position (row height ~60px)
          const rowHeight = 60;
          const scrollPosition = runningIndex * rowHeight;
          
          scrollViewRef.current.scrollTo({
            y: Math.max(0, scrollPosition - 10), // Small offset for visibility
            animated: true,
          });
        }
      }, 300);
    } else if (runningIndex === -1 && previousRunningIndexRef.current >= 0) {
      // If running patient removed, scroll to top
      previousRunningIndexRef.current = -1;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: 0,
          animated: true,
        });
      }, 300);
    }
  }, [runningIndex]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointment Number: {appointmentNumber}</Text>
        {breakStatus && (
          <View style={styles.breakBadge}>
            <Text style={styles.breakText}>বিরতি</Text>
          </View>
        )}
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.serialColumn]}>নং</Text>
        <Text style={[styles.headerCell, styles.nameColumn]}>নাম</Text>
        <Text style={[styles.headerCell, styles.statusColumn]}>অবস্থা</Text>
        <Text style={[styles.headerCell, styles.timeColumn]}>সম্ভাব্য সময়</Text>
      </View>

      {/* Patient List */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.listContainer}
        showsVerticalScrollIndicator={true}
      >
        {sortedPatients.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>কোন রোগী নেই</Text>
          </View>
        ) : (
          sortedPatients.map((patient, index) => {
            // Check if this is the patient right after running (should have orange background)
            const isAfterRunning = runningIndex >= 0 && index === nextPatientIndex && patient.statusCode !== 'running';
            
            return (
            <View
              key={patient.appointmentId}
              style={[
                styles.row,
                patient.statusCode === 'running' && styles.runningRow,
                patient.statusCode === 'next' && styles.nextRow,
                isAfterRunning && styles.afterRunningRow,
              ]}
            >
              <Text style={[styles.cell, styles.serialColumn]}>
                {patient.serialNumber}
              </Text>
              <Text style={[styles.cell, styles.nameColumn]}>
                {patient.patientName}
              </Text>
              <View
                style={[
                  styles.statusCell,
                  styles.statusColumn,
                  { backgroundColor: isAfterRunning ? '#FFA500' : patient.statusBgColor },
                ]}
              >
                <Text style={[
                  styles.statusText,
                  (patient.statusCode === 'next' || patient.statusCode === 'running' || isAfterRunning) && styles.statusTextLight
                ]}>
                  {isAfterRunning ? 'এরপর' : patient.status}
                </Text>
              </View>
              <Text style={[styles.cell, styles.timeColumn]}>
                {patient.estimatedTime}
              </Text>
            </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  breakBadge: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  breakText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  headerCell: {
    fontWeight: '700',
    fontSize: 17,
    color: '#1a1a1a',
    letterSpacing: 0.3,
  },
  listContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#ffffff',
    marginBottom: 2,
    borderRadius: 6,
  },
  runningRow: {
    backgroundColor: '#90EE90', // Light green for running
    borderLeftWidth: 4,
    borderLeftColor: '#32CD32',
  },
  nextRow: {
    backgroundColor: '#228B22', // Dark green for next
    borderLeftWidth: 4,
    borderLeftColor: '#006400',
  },
  afterRunningRow: {
    backgroundColor: '#FFA500', // Orange for patient after running
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
  },
  cell: {
    fontSize: 17,
    color: '#1a1a1a',
    textAlign: 'center',
    fontWeight: '500',
  },
  statusCell: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.3,
  },
  statusTextLight: {
    color: '#ffffff',
  },
  serialColumn: {
    width: '15%',
  },
  nameColumn: {
    width: '35%',
    textAlign: 'left',
    paddingLeft: 8,
    fontWeight: '600',
  },
  statusColumn: {
    width: '25%',
  },
  timeColumn: {
    width: '25%',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
});

