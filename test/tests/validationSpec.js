'use strict';
const handler = require('../../src/handler/handler');
const RESPONSE_MESSAGES = require('@nequi/nequi-api-utils').RESPONSE_MESSAGES;

const loadEvent = (name) =>
  JSON.parse(JSON.stringify(require(`../events/${name}.json`)));

const statusCode = (res) =>
  res &&
  res.ResponseMessage &&
  res.ResponseMessage.ResponseHeader &&
  res.ResponseMessage.ResponseHeader.Status &&
  res.ResponseMessage.ResponseHeader.Status.StatusCode;

describe('reto_serverless: body incompleto (validación de schema)', () => {

  it('falta region: retorna BAD_PARAMETERS (20-05A)', async () => {
    const res = await handler(loadEvent('missing-region'), {});
    expect(statusCode(res)).toBe(RESPONSE_MESSAGES.BAD_PARAMETERS.CODE);
  });

  it('falta key: retorna BAD_PARAMETERS (20-05A)', async () => {
    const res = await handler(loadEvent('missing-key'), {});
    expect(statusCode(res)).toBe(RESPONSE_MESSAGES.BAD_PARAMETERS.CODE);
  });

  it('petición vacía: retorna BAD_PARAMETERS (20-05A)', async () => {
    const res = await handler(loadEvent('empty'), {});
    expect(statusCode(res)).toBe(RESPONSE_MESSAGES.BAD_PARAMETERS.CODE);
  });
});
