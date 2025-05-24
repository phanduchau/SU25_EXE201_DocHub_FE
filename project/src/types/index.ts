export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  availability: {
    day: string;
    slots: { start: string; end: string }[];
  }[];
  hospital?: string;
  experience?: number;
  consultationFee?: number;
  education?: string[];
  languages?: string[];
  about?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'in-person' | 'video' | 'chat';
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

export interface Specialty {
  id: string;
  name: string;
  icon: string;
}

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}