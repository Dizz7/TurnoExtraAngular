import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaJuego } from './tarjeta-juego';

describe('TarjetaJuego', () => {
  let component: TarjetaJuego;
  let fixture: ComponentFixture<TarjetaJuego>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaJuego],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaJuego);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
