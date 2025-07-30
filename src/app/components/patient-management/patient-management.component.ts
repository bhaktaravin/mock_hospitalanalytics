import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  department: string;
  condition: string;
  admissionDate: Date;
  status: 'stable' | 'critical' | 'recovering' | 'discharged';
  room: string;
}

@Component({
  selector: 'app-patient-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-management.component.html',
  styleUrl: './patient-management.component.css'
})
export class PatientManagementComponent {
  patients = signal<Patient[]>([
    {
      id: 'P001',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      department: 'Cardiology',
      condition: 'Hypertension',
      admissionDate: new Date('2025-07-25'),
      status: 'stable',
      room: 'C-101'
    },
    {
      id: 'P002',
      name: 'Sarah Johnson',
      age: 32,
      gender: 'Female',
      department: 'Emergency',
      condition: 'Accident injury',
      admissionDate: new Date('2025-07-28'),
      status: 'critical',
      room: 'ER-05'
    },
    {
      id: 'P003',
      name: 'Michael Brown',
      age: 67,
      gender: 'Male',
      department: 'Orthopedics',
      condition: 'Hip replacement',
      admissionDate: new Date('2025-07-20'),
      status: 'recovering',
      room: 'O-203'
    },
    {
      id: 'P004',
      name: 'Emily Davis',
      age: 28,
      gender: 'Female',
      department: 'Pediatrics',
      condition: 'Appendicitis',
      admissionDate: new Date('2025-07-15'),
      status: 'discharged',
      room: 'P-105'
    }
  ]);

  searchTerm = signal('');
  selectedStatus = signal('all');
  selectedDepartment = signal('all');

  get filteredPatients() {
    return this.patients().filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
                           patient.id.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchesStatus = this.selectedStatus() === 'all' || patient.status === this.selectedStatus();
      const matchesDepartment = this.selectedDepartment() === 'all' || patient.department === this.selectedDepartment();
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'critical': return 'status-critical';
      case 'stable': return 'status-stable';
      case 'recovering': return 'status-recovering';
      case 'discharged': return 'status-discharged';
      default: return '';
    }
  }

  updatePatientStatus(patientId: string, newStatus: Patient['status']) {
    const currentPatients = this.patients();
    const updatedPatients = currentPatients.map(patient => 
      patient.id === patientId ? { ...patient, status: newStatus } : patient
    );
    this.patients.set(updatedPatients);
  }
}
