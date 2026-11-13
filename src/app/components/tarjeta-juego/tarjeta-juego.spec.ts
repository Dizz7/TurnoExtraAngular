
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaJuego } from './tarjeta-juego';
import { JUEGOS } from '../../data/juegos';

describe('TarjetaJuego', () => {
  let component: TarjetaJuego;
  let fixture: ComponentFixture<TarjetaJuego>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaJuego]
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaJuego);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('juego', JUEGOS[0]);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería recibir correctamente los datos del juego', () => {
    expect(component.juego.nombre).toBe('Wingspan');
    expect(component.juego.precio).toBe(54990);
  });

 it('debería emitir el juego al agregarlo al carrito', () => {
  let juegoEmitido: (typeof JUEGOS)[number] | null = null;

  const suscripcion = component.agregarCarrito.subscribe(juego => {
    juegoEmitido = juego;
  });

  component.agregarAlCarrito();

  expect(juegoEmitido).toEqual(JUEGOS[0]);

  suscripcion.unsubscribe();
  });
});