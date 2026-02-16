import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AppointmentNumberResponse {
  appointmentNumber: string;
  chamberName: string;
}

export interface Patient {
  serialNumber: number;
  patientName: string;
  status: string;
  statusBgColor: string;
  estimatedTime: string; // Keep for backward compatibility
  appointmentTime?: string; // Actual appointment slot time
  appointmentId: number;
  statusCode: string;
}

export interface Doctor {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  profilePicture?: string;
}

export interface Chamber {
  id: number;
  name: string;
  appointmentNumber: string;
  address: string;
  videoUrl?: string;
  isActive: boolean;
}

export interface LiveDataResponse {
  chamber: Chamber;
  doctor: Doctor;
  patients: Patient[];
  breakStatus: boolean;
  timestamp: string;
}

class ApiService {
  /**
   * Get appointment number for display
   */
  async getAppointmentNumber(
    chamberId?: number
  ): Promise<AppointmentNumberResponse> {
    const params = chamberId ? { chamberId } : {};
    const response = await apiClient.get('/tv/appointment-number', { params });
    return response.data;
  }

  /**
   * Get patient list for TV display
   */
  async getPatientList(chamberId?: number): Promise<Patient[]> {
    const params = chamberId ? { chamberId } : {};
    const response = await apiClient.get('/tv/patient-list', { params });
    return response.data;
  }

  /**
   * Get complete live data for TV display
   */
  async getLiveData(chamberId?: number): Promise<LiveDataResponse> {
    const params = chamberId ? { chamberId } : {};
    const response = await apiClient.get('/tv/live-data', { params });
    return response.data;
  }

  /**
   * Get break status
   */
  async getBreakStatus(chamberId?: number): Promise<boolean> {
    const params = chamberId ? { chamberId } : {};
    const response = await apiClient.get('/tv/break-status', { params });
    return response.data;
  }

  /**
   * Get active chamber
   */
  async getActiveChamber(chamberId?: number): Promise<Chamber> {
    const params = chamberId ? { chamberId } : {};
    const response = await apiClient.get('/tv/active-chamber', { params });
    return response.data;
  }
}

export const apiService = new ApiService();

