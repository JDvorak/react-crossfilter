import '@babel/register'
import 'jsdom-global/register'
import test from 'tape'
import React from 'react'
import { shallow, mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {
  useGroup,
  useDimension,
  GroupContext,
  Group,
  CrossFilterContext,
  CrossFilter,
  DimensionContext,
  Dimension
} from './'

configure({ adapter: new Adapter() })

// test('useGroup', (t) => {
//   t.plan(0)
// })

test('CrossFilter', (t) => {
  t.plan(1)
  const records = [{ a: 1, b: 2 }]
  const wrapper = mount(<CrossFilter records={records}><img /></CrossFilter>)
  t.equal(wrapper.contains(<img />), true, 'Should pass children.')
})

test('Dimension', (t) => {
  t.plan(1)
  const wrapper = mount(<CrossFilter><Dimension><img /></Dimension></CrossFilter>)
  t.equal(wrapper.contains(<img />), true, 'Should pass children.')
})

test('Group', (t) => {
  t.plan(1)
  const wrapper = mount(<CrossFilter><Dimension><Group><img /></Group></Dimension></CrossFilter>)
  t.equal(wrapper.contains(<img />), true, 'Should pass children.')
})
