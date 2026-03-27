describe('Flujo inicial', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('muestra pantalla inicial', async () => {
    await expect(element(by.id('pantallaInicio'))).toBeVisible();
  });

  it('presiona siguiente', async () => {
    await element(by.id('btnSiguiente')).tap();
  });
});