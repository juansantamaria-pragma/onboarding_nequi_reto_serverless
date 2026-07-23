const nequiUtils = require('@nequi/nequi-utils')
const nequiApiUtils = require('@nequi/nequi-api-utils')
const responseUtils = nequiApiUtils.ResponseAPIUtils
const RESPONSE_MESSAGES = nequiApiUtils.RESPONSE_MESSAGES
const lambdaUtils = nequiUtils.Lambda8
const Validator = require('jsonschema').Validator

const schema = require('./schema')

module.exports = async (event) => {
  const validator = new Validator()
  const validatorResponse = validator.validate(event, schema).errors
  if (validatorResponse.length > 0) {
    throw lambdaUtils.buildOutput(true, false,
      getOutput(event, RESPONSE_MESSAGES.BAD_PARAMETERS.CODE,
        RESPONSE_MESSAGES.BAD_PARAMETERS.DESCRIPTION),
      'reto_serverless', 'validator')
  }
}

const getOutput = (event, code, description, body) => {
  return responseUtils.buildResponseFromRequest(event, code, description, body)
}
