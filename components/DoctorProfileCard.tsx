import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';

interface Doctor {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  profilePicture?: string;
}

interface Props {
  doctor: Doctor;
}

export default function DoctorProfileCard({ doctor }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        {doctor.profilePicture ? (
          <Image
            source={{ uri: doctor.profilePicture }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              {doctor.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.name}>{doctor.fullName}</Text>
      <Text style={styles.profession}>সফটওয়্যার ইঞ্জিনিয়ার</Text>
      {doctor.phone && (
        <Text style={styles.phone}>{doctor.phone}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FF69B4',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF69B4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF69B4',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  profession: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  phone: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

