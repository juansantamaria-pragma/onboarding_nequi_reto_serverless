'use strict';
const index = require('../../index.js');
const RESPONSE_MESSAGES = require('@nequi/nequi-api-utils').RESPONSE_MESSAGES;

const loadEvent = (name) =>
  JSON.parse(JSON.stringify(require(`../events/${name}.json`)));

const statusCode = (res) =>
  res &&
  res.ResponseMessage &&
  res.ResponseMessage.ResponseHeader &&
  res.ResponseMessage.ResponseHeader.Status &&
  res.ResponseMessage.ResponseHeader.Status.StatusCode;

// Llamado REAL a la lambda: index.handler consulta DynamoDB en QA.
// Requiere credenciales vigentes en .env.
describe('reto_serverless/index.js (llamado real a DynamoDB)', () => {

  it('petición válida: retorna SUCCESS con el parámetro', async () => {
    const res = await index.handler(loadEvent('valid'), {});
    expect(statusCode(res)).toBe(RESPONSE_MESSAGES.SUCCESS.CODE);
    expect(res.ResponseMessage.ResponseBody.any.parametersRS).toBeDefined();
  });

  it('parámetro inexistente: retorna DATA_NOT_FOUND', async () => {
    const res = await index.handler(loadEvent('not-found'), {});
    expect(statusCode(res)).toBe(RESPONSE_MESSAGES.DATA_NOT_FOUND.CODE);
  });
});
