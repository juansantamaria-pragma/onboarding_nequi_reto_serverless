'use strict';
const index = require('../../index.js');
const lambdaTestUtils = require('@nequi/nequi-ci-utils').Lambda8TestUtils;
const RESPONSE_MESSAGES = require('@nequi/nequi-api-utils').RESPONSE_MESSAGES;

const loadEvent = (name) => require(`../events/${name}.json`);

const statusCode = (res) =>
  res &&
  res.ResponseMessage &&
  res.ResponseMessage.ResponseHeader &&
  res.ResponseMessage.ResponseHeader.Status &&
  res.ResponseMessage.ResponseHeader.Status.StatusCode;

// Llamado REAL a la lambda vía lambdaTestUtils.test: consulta DynamoDB en QA.
// Requiere sesión SSO activa + `envGet -env "$env"` en la misma terminal.
describe('reto_serverless/index.js: llamado real a DynamoDB', () => {

  it('retorna StatusCode SUCCESS (0)', async () => {
    const res = await lambdaTestUtils.test(index.handler, null, loadEvent('valid'));
    expect(statusCode(res)).toBe(RESPONSE_MESSAGES.SUCCESS.CODE);
    expect(res.ResponseMessage.ResponseBody.any.parametersRS).toBeDefined();
  });

  it('parámetro inexistente: retorna DATA_NOT_FOUND (20-08A)', async () => {
    const res = await lambdaTestUtils.test(index.handler, null, loadEvent('not-found'));
    expect(statusCode(res)).toBe(RESPONSE_MESSAGES.DATA_NOT_FOUND.CODE);
  });
  
});

// Body incompleto/inválido → la validación corta antes de DynamoDB (fail-fast).
describe('reto_serverless/index.js: validación de body (fail-fast)', () => {

  it('falta region: retorna BAD_PARAMETERS (20-05A)', async () => {
    const res = await lambdaTestUtils.test(index.handler, null, loadEvent('missing-region'));
    expect(statusCode(res)).toBe(RESPONSE_MESSAGES.BAD_PARAMETERS.CODE);
  });

  it('falta key: retorna BAD_PARAMETERS (20-05A)', async () => {
    const res = await lambdaTestUtils.test(index.handler, null, loadEvent('missing-key'));
    expect(statusCode(res)).toBe(RESPONSE_MESSAGES.BAD_PARAMETERS.CODE);
  });

  it('petición vacía: retorna BAD_PARAMETERS (20-05A)', async () => {
    const res = await lambdaTestUtils.test(index.handler, null, loadEvent('empty'));
    expect(statusCode(res)).toBe(RESPONSE_MESSAGES.BAD_PARAMETERS.CODE);
  });

  it('campos vacíos: retorna BAD_PARAMETERS (20-05A)', async () => {
    const res = await lambdaTestUtils.test(index.handler, null, loadEvent('empty-key'));
    expect(statusCode(res)).toBe(RESPONSE_MESSAGES.BAD_PARAMETERS.CODE);
  });
  
});
