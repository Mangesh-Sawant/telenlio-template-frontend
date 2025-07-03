// FILE: src/app/services/template.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template } from '../models/template'; // Assuming this model has at least _id and title

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl = 'http://localhost:8000/templates';

  constructor(private http: HttpClient) { }

  // --- NEW: Method to get all templates for the logged-in user ---
  // The backend returns a list of dictionaries, so we type it as any[]
  // but it should conform to a list of Template-like objects.
  getAllTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  // The type here matches the expected POST body (TemplateCreate model)
  createTemplate(templateData: { title: string, html: string, css: string, example_data: any }): Observable<{ message: string, template_id: string }> {
    return this.http.post<{ message: string, template_id: string }>(`${this.apiUrl}/`, templateData);
  }

  // The response type matches the full Template model
  getTemplateById(templateId: string): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/${templateId}`);
  }

  // The updates can be partial, but fields must match the model
  updateTemplate(templateId: string, updates: Partial<Template>): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/${templateId}`, updates);
  }

  // --- NEW: Method to delete a specific template ---
  deleteTemplate(templateId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${templateId}`);
  }
}
