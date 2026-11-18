
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TarjetaJuego } from './tarjeta-juego';
import { Juego, JUEGOS } from '../../data/juegos';

describe('TarjetaJuego', () => {
  let component: TarjetaJuego;
  let fixture: ComponentFixture<TarjetaJuego>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaJuego],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaJuego);
    component = fixture.componentInstance;

    // Asignar un juego de ejemplo al componente.
    fixture.componentRef.setInput('juego', JUEGOS[0]);
    fixture.detectChanges();
  });

  // Prueba 1: creación del componente.
  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // Prueba 2: recepción de los datos del juego.
  it('debería recibir correctamente los datos del juego', () => {
    expect(component.juego.nombre).toBe('Wingspan');
    expect(component.juego.precio).toBe(54990);
  });

  // Prueba 3: emisión del evento agregarCarrito.
  it('debería emitir el juego al agregarlo al carrito', () => {
    const juegosEmitidos: Juego[] = [];

    const suscripcion = component.agregarCarrito.subscribe(
      (juego: Juego) => {
        juegosEmitidos.push(juego);
      }
    );

    // Simular la acción de agregar al carrito.
    component.agregarAlCarrito();

    // Verificar que se emitió exactamente un juego.
    expect(juegosEmitidos.length).toBe(1);

    // Verificar que corresponde al juego esperado.
    expect(juegosEmitidos[0]).toEqual(JUEGOS[0]);

    suscripcion.unsubscribe();
  });
});
