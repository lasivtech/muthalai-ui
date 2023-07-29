import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  paymentIntentRequest:any={
    emailId:'yelji@yahoo.com',
    amount:10,
    currency:'USD'
  }

  loadPayment=false;

  constructor(
    private router: Router 
  ) { }

  ngOnInit(): void {
  }

  submitForm():void{

    this.router.navigate(['/payment', { emailId: this.paymentIntentRequest.emailId,amount:this.paymentIntentRequest.amount}]);

  }

}
