import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IndicadorChildToParentService } from '../services/graficas/indicador-child-to-parent.service';
import { KEY_PARAM } from './config/config';

@Component({
  selector: 'app-tab-main-n',
  templateUrl: './tab-main-n.component.html',
  styleUrls: ['./tab-main-n.component.css']
})
export class TabMainNComponent implements OnInit {
  onChangeIndicadorSub: Subscription;
  

  private urlBaseGraphic: string = '/indicador-nacional/graphics/indicator/';
  private urlBaseTable: string = '/indicador-nacional/table/indicator/';
  private urlBaseSheet: string='/indicador-nacional/sheet/indicator/';
  graphic: string = "";
  table: string = "";
  sheet: string="";
  constructor(private childToParentService: IndicadorChildToParentService) {
    this.onChangeIndicadorSub = this.childToParentService.onChangeIndicador$.subscribe($event => {
      this.getRouterParam();//$event.
    }); 
   }

  ngOnInit(): void {
    this.getRouterParam();
  }
  ngOnDestroy(): void {
    if (this.onChangeIndicadorSub) {
      this.onChangeIndicadorSub.unsubscribe();
    }
  }

  getRouterParam() {
    let local: any = localStorage.getItem(KEY_PARAM);
    if (local != null) {
      let code: any = JSON.parse(local);
      this.graphic = this.urlBaseGraphic + code.graphic;
      this.table = this.urlBaseTable + code.graphic;
      this.sheet = this.urlBaseSheet + code.graphic;
      
      console.log("change url: " + code.graphic);
    }
  }
}
