// FILE: src/app/services/template.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template } from '../models/template';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl = 'http://localhost:8000/templates';

  constructor(private http: HttpClient) { }

  getAllTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  createTemplate(templateData: { title: string, html: string, css: string, example_data: any }): Observable<{ message: string, template_id: string }> {
    return this.http.post<{ message: string, template_id: string }>(`${this.apiUrl}/`, templateData);
  }

  getTemplateById(templateId: string): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/${templateId}`);
  }

  updateTemplate(templateId: string, updates: Partial<Template>): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/${templateId}`, updates);
  }

  deleteTemplate(templateId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${templateId}`);
  }

  // --- NEW: Method to render and download a PDF ---
  renderPdf(templateId: string, data: any): Observable<Blob> {
    // The backend expects the data for rendering in the POST body.
    // The `responseType: 'blob'` is crucial for handling the file download.
    return this.http.post(`${this.apiUrl}/${templateId}/render`, data, {
      responseType: 'blob'
    });
  }
}
