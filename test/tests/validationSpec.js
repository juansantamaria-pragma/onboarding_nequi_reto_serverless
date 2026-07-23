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

  const incompleteCases = [
    'missing-region',
    'missing-key',
    'empty'
  ];

  incompleteCases.forEach((name) => {
    it(`${name}: retorna BAD_PARAMETERS (20-05A)`, async () => {
      const res = await handler(loadEvent(name), {});
      expect(statusCode(res)).toBe(RESPONSE_MESSAGES.BAD_PARAMETERS.CODE);
    });
  });
});
