// FILE: src/app/features/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core'; // Import OnInit
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe for formatting dates
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { TemplateService } from '../editor/services/template.service'; // Import TemplateService

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // Add DatePipe to imports for use in the template
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit { // Implement OnInit
  // Initialize templates as an empty array. It will be populated from the API.
  templates: any[] = [];
  isLoading = true; // Add a loading state for better UX

  constructor(
    private router: Router,
    private authService: AuthService,
    private templateService: TemplateService // Inject TemplateService
  ) {}

  ngOnInit(): void {
    // This lifecycle hook is the perfect place to fetch initial data.
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.isLoading = true;
    this.templateService.getAllTemplates().subscribe({
      next: (data) => {
        this.templates = data;
        this.isLoading = false;
        console.log('Templates loaded:', this.templates);
      },
      error: (err) => {
        console.error('Failed to load templates', err);
        alert('Could not load your templates. Please try again.');
        this.isLoading = false;
      }
    });
  }

  onDeleteTemplate(templateId: string, templateTitle: string): void {
    // Ask for confirmation before deleting
    if (confirm(`Are you sure you want to delete the template "${templateTitle}"? This action cannot be undone.`)) {
      this.templateService.deleteTemplate(templateId).subscribe({
        next: () => {
          // On successful deletion, remove the template from the local array
          // for an immediate UI update without a full reload.
          this.templates = this.templates.filter(t => t._id !== templateId);
          alert('Template deleted successfully.');
        },
        error: (err) => {
          console.error('Failed to delete template', err);
          alert('Could not delete the template. Please try again.');
        }
      });
    }
  }

  onClickLogOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
