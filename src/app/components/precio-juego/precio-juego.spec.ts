import { TestBed } from '@angular/core/testing';
import { PrecioJuego } from './precio-juego';
import { JUEGOS } from '../../data/juegos';

describe('PrecioJuego', () => {
  it('muestra pesos chilenos sin precio anterior ni descuento si no hay oferta', () => {
    const fixture = TestBed.createComponent(PrecioJuego);
    fixture.componentRef.setInput('juego', JUEGOS[0]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.product-price').textContent).toContain('$54.990');
    expect(fixture.nativeElement.querySelector('.old-price')).toBeNull();
    expect(fixture.nativeElement.querySelector('.discount-badge')).toBeNull();
  });

  it('muestra precio anterior y descuento redondeado para ofertas', () => {
    const fixture = TestBed.createComponent(PrecioJuego);
    fixture.componentRef.setInput('juego', JUEGOS[1]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.old-price').textContent).toContain('$29.990');
    expect(fixture.nativeElement.querySelector('.discount-badge').textContent).toContain('15%');
  });
});
