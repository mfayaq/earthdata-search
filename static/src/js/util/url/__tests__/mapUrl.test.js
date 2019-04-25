import { decodeUrlParams, encodeUrlQuery } from '../url'
import projections from '../../map/projections'

import emptyDecodedResult from './url.test'

describe('url#decodeUrlParams', () => {
  test('decodes map correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: {
          blueMarble: true,
          trueColor: false,
          landWaterMap: false
        },
        latitude: 0,
        longitude: 0,
        overlays: {
          referenceFeatures: true,
          coastlines: false,
          referenceLabels: true
        },
        projection: projections.geographic,
        zoom: 2
      }
    }
    expect(decodeUrlParams('?m=0%210%212%211%210%210%2C2')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  describe('map', () => {
    const defaultProps = {
      pathname: '/path/here',
      map: {
        base: {
          blueMarble: true,
          trueColor: false,
          landWaterMap: false
        },
        latitude: '0',
        longitude: '0',
        overlays: {
          referenceFeatures: true,
          coastlines: false,
          referenceLabels: true
        },
        projection: projections.geographic,
        zoom: '2'
      }
    }

    test('does not encode the default map state', () => {
      expect(encodeUrlQuery(defaultProps)).toEqual('/path/here')
    })

    test('encodes map correctly', () => {
      const props = {
        ...defaultProps,
        map: {
          ...defaultProps.map,
          base: {
            blueMarble: false,
            trueColor: false,
            landWaterMap: true
          },
          latitude: 10,
          longitude: 15,
          overlays: {
            referenceFeatures: true,
            coastlines: false,
            referenceLabels: false
          },
          zoom: 0
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?m=10%2115%210%211%212%210')
    })
  })
})