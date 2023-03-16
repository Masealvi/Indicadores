import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FichaIndicador} from '../interfaces/fichaIndicador';
import { IndicadorGraficos } from '../interfaces/indicadorGrafico';


@Injectable({
  providedIn: 'root'
})
export class GrafhicsService {
  private baseEndPoint = environment.baseUrl;
  private baseFichaEndPoint=environment.baseFicha;

  constructor( private http: HttpClient) { }

  public getAllIndicator(): Observable<any> {
    return this.http.get<any>(`${this.baseEndPoint}/indicador/`);
  }
  public getIndicatorByCode(code: string): Observable<IndicadorGraficos> {
    return this.http.get<IndicadorGraficos>(`${this.baseEndPoint}/indicador/${code}`);
  }
  public getIndicatorByCodeTable(code: string): Observable<any> {
    return this.http.get<any>(`${this.baseEndPoint}/indicador/table/${code}`);
  }
  public getFileIndicator(code : string): Observable<FichaIndicador> {
    return this.http.get<FichaIndicador>(`${this.baseFichaEndPoint}/indicador?codigo-indicador=${code}`);
  }


  
}
