import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../service/restapi.service';
import { UIUtil } from '../util/ui-util';

import {
  STRIPE_PAY_NO_SECURE,
} from '../constants/ApiURLConst';
import { ApiResponse } from '../model/apiresponse';

@Component({
  selector: 'app-fast-checkout',
  templateUrl: './fast-checkout.component.html',
  styleUrls: ['./fast-checkout.component.css']
})
export class FastCheckoutComponent implements OnInit {

  paymentIntentRequest:any={
    amount:10,
    currency:'GBP',
    cardDetail:{
      cardNumber: '4242424242424242',
      expMonth: '10',
      expYear: '2023',
      cvv: '123'
    }
  }

  status="idle";
  
  constructor(
    private restApi: RestApiService,
    private uiUtil: UIUtil,
  ) { }

  ngOnInit(): void {
  }

  onSubmit():void{
    this.status = "loading... waittt....";
    this.restApi.postItem(STRIPE_PAY_NO_SECURE,
      JSON.stringify(this.paymentIntentRequest),
      (response: any) => {
        alert('check console for actual'+response );
        console.log(response);
        this.status = response.text;
      },
      (errorResponse: any) => {
        alert('check console for actual :: ' +errorResponse, );
        console.log(errorResponse);
        this.status = errorResponse.text;
      }
    );
  }

}
