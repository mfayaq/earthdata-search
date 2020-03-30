import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Badge } from 'react-bootstrap'

import AutocompleteDisplay from '../AutocompleteDisplay'
import { Button } from '../../Button/Button'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    selected: [],
    onRemoveAutocompleteValue: jest.fn()
  }

  const enzymeWrapper = shallow(<AutocompleteDisplay {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AutocompleteDisplay component', () => {
  describe('with no props', () => {
    test('should render self without display', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.type()).toBe(null)
    })
  })

  describe('with selected', () => {
    test('should render the selected suggestion', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        selected: [{
          type: 'mock_type',
          value: 'mock value'
        }]
      })

      const badge = enzymeWrapper.find(Badge)

      expect(badge.props().pill).toBeTruthy()

      expect(enzymeWrapper.find('.autocomplete-display__type').text()).toEqual('Mock Type')
      expect(enzymeWrapper.find('.autocomplete-display__value').text()).toEqual('mock value')
    })
  })

  describe('#onRemoveAutocompleteValue', () => {
    test('clicking the remove button calls onRemoveAutocompleteValue', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.setProps({
        selected: [{
          type: 'mock_type',
          value: 'mock value'
        }]
      })

      const button = enzymeWrapper.find(Button)

      button.simulate('click')

      expect(props.onRemoveAutocompleteValue).toHaveBeenCalledTimes(1)
    })
  })
})