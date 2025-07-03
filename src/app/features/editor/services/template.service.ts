import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template } from '../models/template'; // Using the updated model

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl = 'http://localhost:8000/templates';

  constructor(private http: HttpClient) { }

  // The type here matches the expected POST body (TemplateCreate model)
  createTemplate(templateData: { title: string, html: string, css: string, example_data: any }): Observable<{ message: string, template_id: string }> {
    return this.http.post<{ message: string, template_id: string }>(this.apiUrl + '/', templateData);
  }

  // The response type matches the full Template model
  getTemplateById(templateId: string): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/${templateId}`);
  }

  // The updates can be partial, but fields must match the model
  updateTemplate(templateId: string, updates: Partial<Template>): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/${templateId}`, updates);
  }
}
