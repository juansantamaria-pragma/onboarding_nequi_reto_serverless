const nequiUtils = require('@nequi/nequi-utils')
const nequiApiUtils = require('@nequi/nequi-api-utils')
const responseUtils = nequiApiUtils.ResponseAPIUtils
const RESPONSE_MESSAGES = nequiApiUtils.RESPONSE_MESSAGES
const env = nequiUtils.Environment
const lambdaUtils = nequiUtils.Lambda8

const {
  service
} = require('../services/service')

module.exports = async function processBusiness (event) {
  return await callService(event)
}

const callService = async (event) => {
  try {
    // Implementar Logica de negocio
    return await service(event)
  } catch (error) {
    if (!!error && !!error.output) {
      throw error
    } else {
      throw lambdaUtils.buildOutput(true, true,
        getOutput(event, RESPONSE_MESSAGES.TECHNICAL_ERROR.CODE,
          RESPONSE_MESSAGES.TECHNICAL_ERROR.DESCRIPTION),
        'Sistema que fallo', 'proceso o función', error)
    }
  }
}

const getOutput = (event, code, description, body) => {
  return responseUtils.buildResponseFromRequest(event, code, description, body)
}
