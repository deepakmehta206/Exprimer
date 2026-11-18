import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CmsPage, LeadEnquiry, SiteSettings } from '../models/cms.models';

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
}
