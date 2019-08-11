import { DimensionContext } from './DimensionContext'
import { CrossFilterContext } from './CrossFilterContext'
import { useEffect, useContext, useRef, useState, createContext, default as React } from 'react'

const noop = (d) => d

export const GroupContext = createContext()
export const Group = (props) => {
  const cfContext = useContext(CrossFilterContext)
  const context = useContext(DimensionContext)
  const [group, setGroup] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    let group = context.dimension.group(props.map || noop)
    if (props.reduce instanceof Object) {
      let { add, remove, initial } = props.reduce
      if (add && remove && initial) {
        group.reduce(add, remove, initial)
      }
    } else if (props.sum instanceof Function) {
      group.reduceSum(props.reduce)
    }
    setGroup(group)
    cfContext.__register('group', props.name, ref, group)
    return () => {
      cfContext.__unregister(props.name)
      group.dispose()
    }
  }, [])

  if (!group) {
    return null
  }

  const locals = {
    group
  }

  return (
    <GroupContext.Provider ref={ref} value={locals}>
      {props.children}
    </GroupContext.Provider>
  )
}
