import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { ApiResponse } from '../model/apiresponse';
import { RestApiService } from '../service/restapi.service';
import { UIUtil } from '../util/ui-util';
import { ActivatedRoute } from '@angular/router';


import {
  CREATE_STRIPE_PAYMENT_CONFIRMATION_URL,
  CREATE_STRIPE_PAYMENT_INTENT_URL,
} from '../constants/ApiURLConst';

declare var Stripe; // stripe.StripeStatic;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  public paymentIntentRequest: any={
    emailId:null,
    amount:0,
    currency:'USD'
  };
  public paymentIntentObj: any;

  public currencySymbol: string = '£'; //TODO
  public amount: number;

  @ViewChild('cardElement') cardElement: ElementRef;

  public stripe: any;
  public card: any;
  public cardErrors: any;
  public isPaid: boolean = false;

  loading = false;

  constructor(
    private restApi: RestApiService,
    private uiUtil: UIUtil,
    private route: ActivatedRoute,
  ) {
    
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log('coming???');
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { orderby: "price" }
        this.paymentIntentRequest.emailId = params.emailId;
        this.paymentIntentRequest.amount = params.amount;
        this.loadStripePaymentIntent();
      }
    );
    
  }

  loadStripePaymentIntent(): void {
    console.log(this.paymentIntentRequest);
    this.restApi.postItem(
      CREATE_STRIPE_PAYMENT_INTENT_URL,
      JSON.stringify(this.paymentIntentRequest),
      (response: any) => {
        console.log(response);
        this.paymentIntentObj = response;
        this.amount = this.paymentIntentObj.paymentIntent.amount;
        this.createStripePaymentUI();
      },(error:any)=>{
        console.log(error);
      }
    );
  }

  createStripePaymentUI(): void {
    this.stripe = Stripe(this.paymentIntentObj.publicKey);
    const elements = this.stripe.elements();
    var style = {
      base: {
        color: '#32325d',
      },
    };
    this.card = elements.create('card', style);
    this.card.mount(this.cardElement.nativeElement);
    this.card.addEventListener('change', ({ error }) => {
      this.cardErrors = error && error.message;
    });
  }


  makePayment(): void {
    this.stripe
      .confirmCardPayment(this.paymentIntentObj.paymentIntent.clientSecret, {
        payment_method: {
          card: this.card,
        },
        setup_future_usage: 'off_session',
      })
      .then((result: any) => {
        if (result.error) {
          alert('card error'+result.error.message );
          this.cardErrors = result.error.message;
        } else {
          this.confirmStripePayment(this.paymentIntentObj.paymentIntent);
        }
      });
  }

  confirmStripePayment(paymentIntent: any): void {
    var confirmPaymentRequest: any = {
      paymentIntentId: paymentIntent.paymentIntentId,
      serviceType: this.paymentIntentRequest.serviceType,
      planId: this.paymentIntentRequest.planId,
    };

    this.restApi.postItem(
      CREATE_STRIPE_PAYMENT_CONFIRMATION_URL,
      JSON.stringify(confirmPaymentRequest),
      (response: any) => {
        alert('Payment done');
        console.log(response);
        this.uiUtil.showSuccessMessage(
          'Payment Succces, Transaction Id ' +
            response.responseObject.paymentIntentId
        );
        console.log(response);
        this.isPaid = true;
      },
      (errorResponse: ApiResponse) => {
        alert('payment failed :: '+ errorResponse.messageList[0].message)
        this.uiUtil.showErrorMessage(errorResponse.messageList[0].message);
      }
    );
  }



}
