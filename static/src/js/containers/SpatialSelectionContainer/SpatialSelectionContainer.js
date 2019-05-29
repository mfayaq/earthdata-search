/* eslint-disable no-underscore-dangle */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import SpatialSelection from '../../components/SpatialSelection/SpatialSelection'

const mapDispathToProps = dispatch => ({
  onChangeMap: query => dispatch(actions.changeMap(query)),
  onChangeQuery: query => dispatch(actions.changeQuery(query))
})

const mapStateToProps = state => ({
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  pathname: state.router.location.pathname,
  pointSearch: state.query.collection.spatial.point,
  polygonSearch: state.query.collection.spatial.polygon
})

export const SpatialSelectionContainer = (props) => {
  const {
    boundingBoxSearch,
    mapRef,
    onChangeMap,
    onChangeQuery,
    pathname,
    pointSearch,
    polygonSearch
  } = props

  const isProjectPage = pathname.startsWith('/project')

  return (
    <SpatialSelection
      boundingBoxSearch={boundingBoxSearch}
      isProjectPage={isProjectPage}
      mapRef={mapRef}
      onChangeMap={onChangeMap}
      onChangeQuery={onChangeQuery}
      pointSearch={pointSearch}
      polygonSearch={polygonSearch}
    />
  )
}

SpatialSelectionContainer.defaultProps = {
  boundingBoxSearch: '',
  mapRef: {},
  pointSearch: '',
  polygonSearch: ''
}

SpatialSelectionContainer.propTypes = {
  boundingBoxSearch: PropTypes.string,
  mapRef: PropTypes.shape({}),
  onChangeMap: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  pointSearch: PropTypes.string,
  polygonSearch: PropTypes.string
}

export default connect(mapStateToProps, mapDispathToProps)(SpatialSelectionContainer)
