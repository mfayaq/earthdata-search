import request from 'request-promise'

import { stringify } from 'qs'

import { getClientId } from '../../../sharedUtils/getClientId'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { prepareGranuleAccessParams } from '../../../sharedUtils/prepareGranuleAccessParams'
import { readCmrResults } from '../util/cmr/readCmrResults'

export const constructOrderPayload = async (
  accessMethod,
  granuleParams,
  accessTokenWithClient,
  earthdataEnvironment
) => {
  const {
    model,
    option_definition: optionDefinition
  } = accessMethod

  const sharedOptions = {
    quantity: 1,
    option_selection: {
      id: optionDefinition.id,
      option_definition_name: optionDefinition.name,
      content: model
    }
  }

  const preparedGranuleParams = prepareGranuleAccessParams(granuleParams)

  const granuleResponse = await request.get({
    uri: `${getEarthdataConfig(earthdataEnvironment).cmrHost}/search/granules.json`,
    qs: preparedGranuleParams,
    headers: {
      'Echo-Token': accessTokenWithClient,
      'Client-Id': getClientId().background
    },
    json: true,
    resolveWithFullResponse: true
  })

  const granuleResponseBody = readCmrResults('search/granules.json', granuleResponse)

  console.log(`Asking ECHO Rest for order information pertaining to ${JSON.stringify(granuleResponseBody.map(granule => granule.id), null, 4)}`)

  // Array to hold granules that belong to the order, that we'll return from this method
  const granuleOrderOptions = []

  // Ensure that only orders that apply to the requested option definition are selected
  const optionInformationUrl = `${getEarthdataConfig(earthdataEnvironment).echoRestRoot}/order_information.json`
  const optionInformationResponse = await request.post({
    uri: optionInformationUrl,
    form: stringify({
      catalog_item_id: granuleResponseBody.map(granule => granule.id)
    }, {
      indices: false,
      arrayFormat: 'brackets'
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Echo-Token': accessTokenWithClient,
      'Client-Id': getClientId().background
    },
    json: true,
    resolveWithFullResponse: true
  })

  const { body: orderInformationBody } = optionInformationResponse

  console.log(`Received ${JSON.stringify(orderInformationBody, null, 4)}`)

  orderInformationBody.forEach((orderInfoObj) => {
    const { order_information: orderInformation = {} } = orderInfoObj
    const {
      catalog_item_ref: catalogItemRef,
      option_definition_refs: optionDefinitions = []
    } = orderInformation

    // Get the name of all the option definitions associated with this granule
    const supportedOptionDefinitions = optionDefinitions.map(optionDef => optionDef.name)

    // If this granule is assocated with the requested option definition add to the response array
    if (supportedOptionDefinitions.includes(optionDefinition.name)) {
      granuleOrderOptions.push({
        order_item: {
          catalog_item_id: catalogItemRef.id,
          ...sharedOptions
        }
      })
    } else {
      console.log(`${catalogItemRef.id} does not support ${optionDefinition.name} (${optionDefinition.id})`)
    }
  })

  return granuleOrderOptions
}
