import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendCodeService {
  onChangeIndicador$ = new Subject<any>();
  constructor() { }
}
