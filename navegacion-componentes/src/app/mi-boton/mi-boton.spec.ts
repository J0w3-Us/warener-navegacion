import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiBoton } from './mi-boton';

describe('MiBoton', () => {
  let component: MiBoton;
  let fixture: ComponentFixture<MiBoton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiBoton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiBoton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
