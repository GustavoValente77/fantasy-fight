import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Luta } from '../../models/luta';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api/sincronizar-card';

  constructor(private http: HttpClient) {}

  getLutas(): Observable<Luta[]> {
    return this.http.get<Luta[]>(this.apiUrl);
  }
}