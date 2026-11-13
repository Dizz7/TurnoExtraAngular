
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)]
    }).compileComponents();
  });

  it('debería crear la aplicación', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('debería mostrar el encabezado y el pie de página', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelector('app-header')).not.toBeNull();
    expect(elemento.querySelector('app-footer')).not.toBeNull();
  });
});
