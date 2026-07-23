'use strict';
const { mockClient } = require('aws-sdk-client-mock');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
const index = require('../../index.js');
const lambdaTestUtils = require('@nequi/nequi-ci-utils').Lambda8TestUtils;

let ddbMock;

describe('reto_serverless/index.js', () => {

  beforeEach(() => { ddbMock = mockClient(DynamoDBDocumentClient); });
  afterEach(() => ddbMock.restore());

  it('index.js: Success test', async () => {
    ddbMock.on(GetCommand).resolves({
      Item: { key: 'onboardingTest', region: 'C001', value: 'true' }
    });
    try {
      let response = await lambdaTestUtils.test(index.handler, 'test/success.json');
      expect(response).toBeDefined();
      // Validar la estructura y/o contenido de la respuesta exitosa
    } catch (error) {
      console.log('ERROR: ', error);
      expect(error).not.toBeDefined();
    }
  });
});
