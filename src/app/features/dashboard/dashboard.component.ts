import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  templates = [
    {
      name: 'Invoice Template',
      created: 'Jan 15, 2024, 03:30 PM',
      modified: 'Jan 20, 2024, 09:00 AM',
      exports: 5
    },
    {
      name: 'Business Letter',
      created: 'Jan 10, 2024, 02:30 PM',
      modified: 'Jan 18, 2024, 07:50 AM',
      exports: 3
    },
    {
      name: 'Report Template',
      created: 'Jan 5, 2024, 04:30 PM',
      modified: 'Jan 22, 2024, 10:15 AM',
      exports: 8
    }
  ];
}
