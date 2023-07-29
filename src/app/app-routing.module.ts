import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdditionalChargeComponent } from './additional-charge/additional-charge.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  {
    path:'',
    component:CheckoutComponent
  },
  {
    path:'payment',
    component:PaymentComponent
  },
  {
    path:'additional',
    component:AdditionalChargeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
