const nequiUtils = require('@nequi/nequi-utils')
const nequiApiUtils = require('@nequi/nequi-api-utils')
const nequiDynamo = require('@nequi/nequi-aws-dynamodb')
const responseUtils = nequiApiUtils.ResponseAPIUtils
const RESPONSE_MESSAGES = nequiApiUtils.RESPONSE_MESSAGES
const env = nequiUtils.Environment
const lambdaUtils = nequiUtils.Lambda8

const service = async (event) => {
  const traceID = event.traceID
  try {
    const tableName = env.getEnv('PARAMETERS_TABLE')
    const { key, region } = event.RequestMessage.RequestBody.any.parametersRQ

    lambdaUtils.log(`service consulta DynamoDB [trace:${traceID}]`,
      { tableName, key, region }, true)

    const clientId = await resolveClient()
    const data = await nequiDynamo.getItem(tableName, { key, region }, clientId)

    if (!data || !data.Item) {
      throw lambdaUtils.buildOutput(true, false,
        getOutput(event, RESPONSE_MESSAGES.DATA_NOT_FOUND.CODE,
          RESPONSE_MESSAGES.DATA_NOT_FOUND.DESCRIPTION),
        'reto_serverless', 'getItem')
    }

    return data.Item
  } catch (error) {
    if (!!error && !!error.output) {
      throw error
    }
    lambdaUtils.log(`service error [trace:${traceID}]`, error, true)
    throw lambdaUtils.buildOutput(true, true,
      getOutput(event, RESPONSE_MESSAGES.TECHNICAL_ERROR.CODE,
        RESPONSE_MESSAGES.TECHNICAL_ERROR.DESCRIPTION),
      'Sistema que fallo', 'proceso o función', error)
  }
}

const resolveClient = async () => {
  const AccessKeyId = env.getEnv('AWS_ACCESS_KEY_ID')
  const SecretAccessKey = env.getEnv('AWS_SECRET_ACCESS_KEY')
  if (!AccessKeyId || !SecretAccessKey) {
    return 'default'
  }
  await nequiDynamo.setClient('qa', {
    AccessKeyId,
    SecretAccessKey,
    SessionToken: env.getEnv('AWS_SESSION_TOKEN')
  })
  return 'qa'
}

const getOutput = (event, code, description, body) => {
  return responseUtils.buildResponseFromRequest(event, code, description, body)
}

module.exports = {
  service: service
}
