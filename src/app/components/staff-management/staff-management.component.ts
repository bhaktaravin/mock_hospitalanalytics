import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  shift: 'morning' | 'afternoon' | 'night';
  status: 'on-duty' | 'off-duty' | 'break' | 'emergency';
  phone: string;
  email: string;
}

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-management.component.html',
  styleUrl: './staff-management.component.css'
})
export class StaffManagementComponent {
  staff = signal<Staff[]>([
    {
      id: 'S001',
      name: 'Dr. Amanda Wilson',
      role: 'Cardiologist',
      department: 'Cardiology',
      shift: 'morning',
      status: 'on-duty',
      phone: '+1-555-0101',
      email: 'a.wilson@hospital.com'
    },
    {
      id: 'S002',
      name: 'Nurse Maria Rodriguez',
      role: 'Head Nurse',
      department: 'Emergency',
      shift: 'night',
      status: 'on-duty',
      phone: '+1-555-0102',
      email: 'm.rodriguez@hospital.com'
    },
    {
      id: 'S003',
      name: 'Dr. James Chen',
      role: 'Surgeon',
      department: 'Surgery',
      shift: 'afternoon',
      status: 'emergency',
      phone: '+1-555-0103',
      email: 'j.chen@hospital.com'
    },
    {
      id: 'S004',
      name: 'Lisa Thompson',
      role: 'Technician',
      department: 'Radiology',
      shift: 'morning',
      status: 'break',
      phone: '+1-555-0104',
      email: 'l.thompson@hospital.com'
    }
  ]);

  searchTerm = signal('');
  selectedDepartment = signal('all');
  selectedShift = signal('all');
  selectedStatus = signal('all');

  get filteredStaff() {
    return this.staff().filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
                           member.role.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchesDepartment = this.selectedDepartment() === 'all' || member.department === this.selectedDepartment();
      const matchesShift = this.selectedShift() === 'all' || member.shift === this.selectedShift();
      const matchesStatus = this.selectedStatus() === 'all' || member.status === this.selectedStatus();
      
      return matchesSearch && matchesDepartment && matchesShift && matchesStatus;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'on-duty': return 'status-on-duty';
      case 'off-duty': return 'status-off-duty';
      case 'break': return 'status-break';
      case 'emergency': return 'status-emergency';
      default: return '';
    }
  }

  updateStaffStatus(staffId: string, newStatus: Staff['status']) {
    const currentStaff = this.staff();
    const updatedStaff = currentStaff.map(member => 
      member.id === staffId ? { ...member, status: newStatus } : member
    );
    this.staff.set(updatedStaff);
  }

  getShiftIcon(shift: string): string {
    switch (shift) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'night': return '🌙';
      default: return '⏰';
    }
  }
}
