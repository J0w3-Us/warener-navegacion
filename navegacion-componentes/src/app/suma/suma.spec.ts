import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Suma } from './suma';

describe('Suma', () => {
  let component: Suma;
  let fixture: ComponentFixture<Suma>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Suma]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Suma);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
