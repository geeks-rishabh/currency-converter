import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Currency } from '../currency-converter-home/currency-converter-home.component';
import { ApiService } from '../shared/services/api.service';

import { CurrencyDetailComponent } from './currency-detail.component';

describe('CurrencyDetailComponent', () => {
  let component: CurrencyDetailComponent;
  let fixture: ComponentFixture<CurrencyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyDetailComponent ], imports:[FormsModule, ReactiveFormsModule,HttpClientModule,RouterTestingModule],providers:[ApiService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call updateCurrency',()=>{
    let params:  Currency = {name:'', symbol:''};
component.updateCurrency(params);
  });

  it('should call getMonthName',()=>{
component.getMonthName("2022-11-01");
  });
});
