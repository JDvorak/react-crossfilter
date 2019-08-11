import { CrossFilterContext } from './CrossFilterContext'
import { useEffect, useContext, useRef, useState, createContext, default as React } from 'react'

const noop = (d) => d

export const DimensionContext = createContext()
export const Dimension = (props) => {
  const { accessor, isArray, name } = props
  const context = useContext(CrossFilterContext)
  const [dimension, setDimension] = useState(null)
  const ref = useRef(null)

  if (!context) {
    throw new Error('Dimension requires a CrossFilter Provider as parent.')
  }

  useEffect(() => {
    const dim = context.crossfilter.dimension(accessor || noop, isArray)
    setDimension(dim)
    context.__register('dimension', name, ref, dim)
    return () => {
      context.__unregister(name)
      dim.dispose()
    }
  }, [])

  if (!dimension) {
    return null
  }

  const locals = {
    dimension,
    setFilter: dimension.setFilter
  }

  return (
    <DimensionContext.Provider ref={ref} value={locals}>
      {props.children}
    </DimensionContext.Provider>
  )
}
