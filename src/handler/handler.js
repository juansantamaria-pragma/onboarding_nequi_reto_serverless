const { randomUUID } = require('crypto')
const lambdaUtils = require('@nequi/nequi-utils').Lambda8
const nequiApiUtils = require('@nequi/nequi-api-utils')
const responseUtils = nequiApiUtils.ResponseAPIUtils
const RESPONSE_MESSAGES = nequiApiUtils.RESPONSE_MESSAGES

const validateSchema = require('../config/schema/validateSchema')
const processBusiness = require('../business/business')

module.exports = async function defaultHandler (event, context) {
  const traceID = randomUUID()
  event.traceID = traceID
  lambdaUtils.log(`reto_serverless entrada [trace:${traceID}]`, event, true)
  try {
    await validateSchema(event)
    const response = await processBusiness(event)
    return await lambdaUtils.finish(lambdaUtils.buildOutput(true, false,
      getOutput(event, RESPONSE_MESSAGES.SUCCESS.CODE,
        RESPONSE_MESSAGES.SUCCESS.DESCRIPTION, { parametersRS: response })
      ))
  } catch (error) {
    lambdaUtils.log(`reto_serverless error [trace:${traceID}]`, error, true)
    return await lambdaUtils.finish(error)
  }
}

const getOutput = (event, code, description, body) => {
  return responseUtils.buildResponseFromRequest(event, code, description, body)
}
