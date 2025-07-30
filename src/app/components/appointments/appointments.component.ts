import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  department: string;
  date: Date;
  time: string;
  duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'emergency' | 'surgery';
  notes?: string;
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent {
  appointments = signal<Appointment[]>([
    {
      id: 'A001',
      patientName: 'John Smith',
      doctorName: 'Dr. Amanda Wilson',
      department: 'Cardiology',
      date: new Date('2025-07-29'),
      time: '09:00',
      duration: 30,
      status: 'confirmed',
      type: 'consultation',
      notes: 'Annual checkup'
    },
    {
      id: 'A002',
      patientName: 'Sarah Johnson',
      doctorName: 'Dr. James Chen',
      department: 'Surgery',
      date: new Date('2025-07-29'),
      time: '14:30',
      duration: 120,
      status: 'scheduled',
      type: 'surgery',
      notes: 'Appendectomy procedure'
    },
    {
      id: 'A003',
      patientName: 'Michael Brown',
      doctorName: 'Dr. Lisa Rodriguez',
      department: 'Orthopedics',
      date: new Date('2025-07-30'),
      time: '11:00',
      duration: 45,
      status: 'in-progress',
      type: 'follow-up',
      notes: 'Post-surgery follow-up'
    },
    {
      id: 'A004',
      patientName: 'Emily Davis',
      doctorName: 'Dr. Amanda Wilson',
      department: 'Cardiology',
      date: new Date('2025-07-30'),
      time: '16:00',
      duration: 30,
      status: 'completed',
      type: 'consultation'
    }
  ]);

  selectedDate = signal(new Date().toISOString().split('T')[0]);
  selectedDepartment = signal('all');
  selectedStatus = signal('all');

  // New appointment form
  showNewAppointmentForm = signal(false);
  newAppointment = signal<Partial<Appointment>>({
    patientName: '',
    doctorName: '',
    department: '',
    date: new Date(),
    time: '',
    duration: 30,
    type: 'consultation',
    notes: ''
  });

  get filteredAppointments() {
    return this.appointments().filter(appointment => {
      const appointmentDate = appointment.date.toISOString().split('T')[0];
      const matchesDate = appointmentDate === this.selectedDate();
      const matchesDepartment = this.selectedDepartment() === 'all' || 
                               appointment.department === this.selectedDepartment();
      const matchesStatus = this.selectedStatus() === 'all' || 
                           appointment.status === this.selectedStatus();
      
      return matchesDate && matchesDepartment && matchesStatus;
    });
  }

  get todayAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments().filter(app => 
      app.date.toISOString().split('T')[0] === today
    );
  }

  get appointmentStats() {
    const today = this.todayAppointments;
    return {
      total: today.length,
      confirmed: today.filter((a: Appointment) => a.status === 'confirmed').length,
      inProgress: today.filter((a: Appointment) => a.status === 'in-progress').length,
      completed: today.filter((a: Appointment) => a.status === 'completed').length
    };
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'scheduled': return 'status-scheduled';
      case 'confirmed': return 'status-confirmed';
      case 'in-progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'consultation': return '🩺';
      case 'follow-up': return '📋';
      case 'emergency': return '🚨';
      case 'surgery': return '⚕️';
      default: return '📅';
    }
  }

  updateAppointmentStatus(appointmentId: string, newStatus: Appointment['status']) {
    const currentAppointments = this.appointments();
    const updatedAppointments = currentAppointments.map(appointment =>
      appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
    );
    this.appointments.set(updatedAppointments);
  }

  onStatusChange(appointmentId: string, event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.updateAppointmentStatus(appointmentId, target.value as Appointment['status']);
    }
  }

  toggleNewAppointmentForm() {
    this.showNewAppointmentForm.update(show => !show);
    if (!this.showNewAppointmentForm()) {
      this.resetNewAppointmentForm();
    }
  }

  addNewAppointment() {
    const newApp = this.newAppointment();
    if (newApp.patientName && newApp.doctorName && newApp.department && newApp.time) {
      const appointment: Appointment = {
        id: `A${Date.now()}`,
        patientName: newApp.patientName!,
        doctorName: newApp.doctorName!,
        department: newApp.department!,
        date: newApp.date || new Date(),
        time: newApp.time!,
        duration: newApp.duration || 30,
        status: 'scheduled',
        type: newApp.type as Appointment['type'] || 'consultation',
        notes: newApp.notes
      };

      const currentAppointments = this.appointments();
      this.appointments.set([...currentAppointments, appointment]);
      this.toggleNewAppointmentForm();
    }
  }

  private resetNewAppointmentForm() {
    this.newAppointment.set({
      patientName: '',
      doctorName: '',
      department: '',
      date: new Date(),
      time: '',
      duration: 30,
      type: 'consultation',
      notes: ''
    });
  }
}
