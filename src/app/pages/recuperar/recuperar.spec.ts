import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Recuperar } from './recuperar';
import { Auth } from '../../services/auth';
import { cuentasDePrueba } from '../../testing/almacen-pruebas';
describe('Formulario de recuperación', () => {
  it('intercepta el envío y muestra el código de demostración sin recargar', async () => {
    TestBed.configureTestingModule({providers:[provideRouter([]),...cuentasDePrueba()]});
    await TestBed.inject(Auth).preparado;
    const fixture=TestBed.createComponent(Recuperar); fixture.detectChanges();
    fixture.componentInstance.correo.setValue('cliente@turnoextra.demo');
    const evento=new Event('submit',{bubbles:true,cancelable:true});
    fixture.nativeElement.querySelector('form').dispatchEvent(evento);
    await fixture.whenStable(); fixture.detectChanges();
    expect(evento.defaultPrevented).toBeTrue();
    expect(fixture.componentInstance.codigoDemo).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Código de demostración:');
  });
});
