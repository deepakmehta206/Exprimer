import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CmsPage, LeadEnquiry, ResumeSubmissionPayload, SiteSettings } from '../models/cms.models';

@Injectable({ providedIn: 'root' })
export class CmsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5117/api';

  getSettings(): Observable<SiteSettings> {
    return this.http.get<SiteSettings>(`${this.apiUrl}/settings`);
  }

  getPage(slug: string): Observable<CmsPage> {
    return this.http.get<CmsPage>(`${this.apiUrl}/pages/${slug}`);
  }

  submitLead(payload: LeadEnquiry): Observable<{ id: number; message: string }> {
    return this.http.post<{ id: number; message: string }>(`${this.apiUrl}/leads`, payload);
  }

  submitResume(payload: ResumeSubmissionPayload): Observable<{ id: number; message: string }> {
    const body = new FormData();
    body.append('name', payload.name);
    body.append('email', payload.email);
    body.append('phone', payload.phone);
    body.append('role', payload.role);
    body.append('message', payload.message);
    body.append('consentAccepted', String(payload.consentAccepted));
    body.append('resume', payload.resume, payload.resume.name);
    return this.http.post<{ id: number; message: string }>(`${this.apiUrl}/resumes`, body);
  }
}
