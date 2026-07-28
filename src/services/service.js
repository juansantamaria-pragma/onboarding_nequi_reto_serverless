const nequiUtils = require('@nequi/nequi-utils')
const nequiApiUtils = require('@nequi/nequi-api-utils')
const nequiDynamo = require('@nequi/nequi-aws-dynamodb')
const responseUtils = nequiApiUtils.ResponseAPIUtils
const RESPONSE_MESSAGES = nequiApiUtils.RESPONSE_MESSAGES
const env = nequiUtils.Environment
const lambdaUtils = nequiUtils.Lambda8

const service = async (event) => {
  try {
    const tableName = env.getEnv('PARAMETERS_TABLE')
    const { key, region } = event.RequestMessage.RequestBody.any.parametersRQ

    const data = await nequiDynamo.getItem(tableName, { key, region })

    if (!data || !data.Item) {
      throw lambdaUtils.buildOutput(true, false,
        getOutput(event, RESPONSE_MESSAGES.DATA_NOT_FOUND.CODE,
          RESPONSE_MESSAGES.DATA_NOT_FOUND.DESCRIPTION),
        'DynamoDB', tableName)
    }

    return data.Item
  } catch (error) {
    if (!!error && !!error.output) {
      throw error
    }
    
    throw lambdaUtils.buildOutput(true, true,
      getOutput(event, RESPONSE_MESSAGES.TECHNICAL_ERROR.CODE,
        RESPONSE_MESSAGES.TECHNICAL_ERROR.DESCRIPTION),
      'DynamoDB', 'getItem',error)
  }
}

const getOutput = (event, code, description, body) => {
  return responseUtils.buildResponseFromRequest(event, code, description, body)
}

module.exports = {
  service: service
}
