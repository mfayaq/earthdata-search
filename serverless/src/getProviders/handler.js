import request from 'request-promise'
import { isWarmUp } from '../util/isWarmup'
import { getClientId, getEarthdataConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getEchoToken } from '../util/urs/getEchoToken'
import { getJwtToken } from '../util/getJwtToken'

/**
 * Perform an authenticated CMR Concept Metadata search
 * @param {Object} event Details about the HTTP request that it received
 */
const getProviders = async (event) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  const jwtToken = getJwtToken(event)

  const accessToken = await getEchoToken(jwtToken)

  const url = `${getEarthdataConfig(cmrEnv()).cmrHost}/legacy-services/rest/providers.json`

  try {
    const response = await request.get({
      uri: url,
      resolveWithFullResponse: true,
      headers: {
        'Client-Id': getClientId().lambda,
        'Echo-Token': accessToken
      },
      json: true
    })

    const { body } = response

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(body)
    }
  } catch (e) {
    console.log('error', e)

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true

      },
      body: JSON.stringify({ errors: [e] })
    }
  }
}

export default getProviders