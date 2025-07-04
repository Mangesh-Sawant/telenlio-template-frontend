// FILE: src/app/features/dashboard/dashboard.component.ts

import {Component, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../core/auth.service';
import {TemplateService} from '../editor/services/template.service';
import {EXAMPLE_TEMPLATES} from '../../core/data/example-template';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  masterTemplates: any[] = [];
  filteredTemplates: any[] = [];
  isLoading = true;
  exampleTemplates = EXAMPLE_TEMPLATES;
  searchTerm: string = '';
  sortOrder: 'newest' | 'oldest' | 'alphabetical' = 'newest';

  constructor(
    private router: Router,
    private authService: AuthService,
    private templateService: TemplateService) {
  }

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.isLoading = true;
    this.templateService.getAllTemplates().subscribe({
      next: (data) => {
        this.masterTemplates = data;
        this.applyFilters();
        this.isLoading = false;
        console.log('Templates loaded:', this.masterTemplates);
      },
      error: (err) => {
        console.error('Failed to load templates', err);
        alert('Could not load your templates. Please try again.');
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    // 1. Start with a copy of the master list to apply filters to.
    let templates = [...this.masterTemplates];

    // 2. Apply search filter first.
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      templates = templates.filter(template =>
        template.title.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // 3. Apply the simplified sorting/ordering logic.
    switch (this.sortOrder) {
      case 'newest':
        // --- FIX ---
        // Do nothing. The 'templates' array is already in the correct "newest first" order
        // as received from the API.
        break;

      case 'oldest':
        // --- FIX ---
        // Simply reverse the array to get "oldest first".
        templates.reverse();
        break;

      case 'alphabetical':
        // This sorting logic is still correct.
        templates.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    // 4. Update the list that is displayed in the template.
    this.filteredTemplates = templates;
  }

  onDeleteTemplate(templateId: string, templateTitle: string): void {
    if (confirm(`Are you sure you want to delete the template "${templateTitle}"? This action cannot be undone.`)) {
      this.templateService.deleteTemplate(templateId).subscribe({
        next: () => {
          this.masterTemplates = this.masterTemplates.filter(t => t._id !== templateId);
          this.applyFilters();
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

  openExampleTemplateByIndex(index: number): void {
    const selectedTemplate = EXAMPLE_TEMPLATES[index];
    localStorage.setItem('example_template', JSON.stringify(selectedTemplate));
    this.router.navigate(['/editor/new']);
  }
}
