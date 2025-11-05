import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectivaIncorporada } from './directiva-incorporada';

describe('DirectivaIncorporada', () => {
  let component: DirectivaIncorporada;
  let fixture: ComponentFixture<DirectivaIncorporada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectivaIncorporada]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectivaIncorporada);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
