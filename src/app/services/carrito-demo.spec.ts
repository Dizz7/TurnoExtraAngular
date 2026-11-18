import { CarritoDemo } from './carrito-demo';
import { JUEGOS } from '../data/juegos';

describe('CarritoDemo', () => {
  it('ignora juegos agotados sin borrar la última selección', () => {
    const carrito = new CarritoDemo();
    carrito.agregar(JUEGOS[0]);
    carrito.agregar({ ...JUEGOS[1], stock: 0 });
    expect(carrito.cantidadCarrito()).toBe(1);
    expect(carrito.ultimoJuegoAgregado()).toBe('Wingspan');
  });
});
