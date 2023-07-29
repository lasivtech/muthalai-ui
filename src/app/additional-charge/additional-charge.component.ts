import { Component, OnInit } from '@angular/core';
import {
  CREATE_STRIPE_PAYMENT_ADDITIOINALPAY_URL,
  CREATE_STRIPE_PAYMENT_INTENT_URL,
} from '../constants/ApiURLConst';
import { ApiResponse } from '../model/apiresponse';
import { RestApiService } from '../service/restapi.service';
import { UIUtil } from '../util/ui-util';
@Component({
  selector: 'app-additional-charge',
  templateUrl: './additional-charge.component.html',
  styleUrls: ['./additional-charge.component.css']
})
export class AdditionalChargeComponent implements OnInit {

  payRequest:any={
    customerId:null,
    amount:0,
    currency:'USD'
  }
  constructor(
    private restApi: RestApiService,
    private uiUtil: UIUtil,
  ) { }

  ngOnInit(): void {
  }
  
  confirmPayment():void{
    this.restApi.postItem(
      CREATE_STRIPE_PAYMENT_ADDITIOINALPAY_URL,
      JSON.stringify(this.payRequest),
      (response: any) => {
        console.log(response);
        alert('all good');
        this.uiUtil.showSuccessMessage(
          'Payment Succces, Transaction Id ' +
            response.responseObject.paymentIntentId
        );
        console.log(response);
      },
      (errorResponse: ApiResponse) => {
        this.uiUtil.showErrorMessage(errorResponse.messageList[0].message);
      }
    );
  }

}
