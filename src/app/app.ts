import { Component, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { PatientManagementComponent } from './components/patient-management/patient-management.component';
import { StaffManagementComponent } from './components/staff-management/staff-management.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PatientManagementComponent, StaffManagementComponent, NotificationsComponent, AppointmentsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  protected readonly title = signal('healthcare-dashboard');
  
  // Navigation state
  currentView = signal<'dashboard' | 'patients' | 'staff' | 'appointments'>('dashboard');

  setView(view: 'dashboard' | 'patients' | 'staff' | 'appointments') {
    this.currentView.set(view);
  }

  ngAfterViewInit() {
    // Only create charts when dashboard view is active
    if (this.currentView() === 'dashboard') {
      this.createAdmissionsChart();
      this.createCapacityChart();
    }
  }

  private createAdmissionsChart() {
    const ctx = document.getElementById('admissionsChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Patient Admissions',
            data: [12, 19, 15, 25, 22, 18, 24],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#f0f0f0'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }
  }

  private createCapacityChart() {
    const ctx = document.getElementById('capacityChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['ICU', 'Emergency', 'General', 'Surgery', 'Pediatrics'],
          datasets: [{
            data: [85, 92, 67, 78, 45],
            backgroundColor: [
              '#ff6b6b',
              '#4ecdc4',
              '#45b7d1',
              '#96ceb4',
              '#feca57'
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            }
          }
        }
      });
    }
  }

  createChartsIfNeeded() {
    // Create charts when switching to dashboard view
    setTimeout(() => {
      this.createAdmissionsChart();
      this.createCapacityChart();
    }, 100);
  }
}
