import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyConverterHomeComponent } from './currency-converter-home.component';

describe('CurrencyConverterHomeComponent', () => {
  let component: CurrencyConverterHomeComponent;
  let fixture: ComponentFixture<CurrencyConverterHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyConverterHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConverterHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
