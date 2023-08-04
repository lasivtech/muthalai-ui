import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastCheckoutComponent } from './fast-checkout.component';

describe('FastCheckoutComponent', () => {
  let component: FastCheckoutComponent;
  let fixture: ComponentFixture<FastCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FastCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FastCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
