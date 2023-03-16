import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndicadorMultilateralService {
  private baseEndPoint = environment.baseUrl;

  constructor(private http: HttpClient,) { }

  public getIndicatorMultilateralByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.baseEndPoint}/multilateral/${code}`);
  }
}