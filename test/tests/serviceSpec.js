'use strict';
const { mockClient } = require('aws-sdk-client-mock');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { service } = require('../../src/services/service');
const RESPONSE_MESSAGES = require('@nequi/nequi-api-utils').RESPONSE_MESSAGES;

let ddbMock;

const buildEvent = () => JSON.parse(JSON.stringify(require('../success.json')));

const statusCode = (error) =>
  error &&
  error.output &&
  error.output.ResponseMessage &&
  error.output.ResponseMessage.ResponseHeader &&
  error.output.ResponseMessage.ResponseHeader.Status &&
  error.output.ResponseMessage.ResponseHeader.Status.StatusCode;

describe('src/services/service.js', () => {
  beforeEach(() => { ddbMock = mockClient(DynamoDBDocumentClient); });
  afterEach(() => ddbMock.restore());

  it('éxito: retorna el Item consultado en DynamoDB', async () => {
    const item = { key: 'onboardingTest', region: 'C001', value: 'true' };
    ddbMock.on(GetCommand).resolves({ Item: item });

    const result = await service(buildEvent());

    expect(result).toEqual(item);
  });

  it('no encontrado: lanza output DATA_NOT_FOUND cuando no hay Item', async () => {
    ddbMock.on(GetCommand).resolves({});

    try {
      await service(buildEvent());
      fail('debió lanzar DATA_NOT_FOUND');
    } catch (error) {
      expect(statusCode(error)).toBe(RESPONSE_MESSAGES.DATA_NOT_FOUND.CODE);
    }
  });

  it('error técnico: lanza output TECHNICAL_ERROR si DynamoDB falla', async () => {
    ddbMock.on(GetCommand).rejects(new Error('boom'));

    try {
      await service(buildEvent());
      fail('debió lanzar TECHNICAL_ERROR');
    } catch (error) {
      expect(statusCode(error)).toBe(RESPONSE_MESSAGES.TECHNICAL_ERROR.CODE);
    }
  });
});
