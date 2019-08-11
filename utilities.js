import { CrossFilterContext } from './providers/CrossFilterContext'
import { useContext, useState } from 'react'

const noop = (d) => d

export const useDimension = function (id) {
  const context = useContext(CrossFilterContext)
  const dim = context.lookup('dimension', id)
  const [limit, setLimit] = useState(0)
  const [offset, setOffset] = useState(0)
  const [order, toggleOrder] = useState(false)
  let values = order ? dim.top(limit, offset) : dim.bottom(limit, offset)

  return { values, setFilter: dim.filter, setLimit, setOffset, toggleOrder }
}

export const useGroup = function (id) {
  const context = useContext(CrossFilterContext)
  const dim = context.lookup('group', id)
  const [limit, setLimit] = useState(0)
  const [order, setOrder] = useState(noop)
  let values = order ? dim.top(limit) : dim.bottom(limit)

  return { values, setFilter: dim.filter, setLimit, setOrder }
}
