import crossfilter from 'crossfilter2'
import { useEffect, useState, createContext, default as React } from 'react'

export const CrossFilterContext = createContext()
export const CrossFilter = (props) => {
  let [clock, setClock] = useState(0)
  let [cf, setCrossFilter] = useState(null)
  let [currentSet, updateSet] = useState(new Set())
  let { lookup, register, unregister } = useRegistry()

  if (cf) {
    let newSet = new Set(props.records || [])
    if (currentSet !== newSet && newSet.size > currentSet.size) {
      var difference = new Set([...newSet].filter(x => !currentSet.has(x)))
      cf.add([...difference])
      updateSet(new Set(cf.all()))
    }
  }

  useEffect(() => {
    // TODO: Toss crossfilter into a webworker, no reason for it to be on the main thread.
    let cf = crossfilter(props.records || [])
    setCrossFilter(cf)
    const disposeHandler = cf.onChange(function (eventType) {
      if (eventType === 'filtered') {
        // TODO: If changes aren't in current filter, don't render.
        setClock(clock++)
      }
    })
    return () => disposeHandler()
  }, [])

  const state = {
    __clock: clock,
    __register: register,
    __unregister: unregister,
    lookup: lookup,
    crossfilter: cf
  }

  if (!cf) {
    return null
  }
  return (
    <CrossFilterContext.Provider value={state}>
      {props.children}
    </CrossFilterContext.Provider>
  )
}

export const useRegistry = () => {
  let [registry, updateRegistry] = useState({})

  return {
    register: (type, id, ref, obj) => {
      registry[id] = { ref, obj, type }
      updateRegistry(registry)
    },
    unregister: (id) => {
      delete registry[id]
      updateRegistry(registry)
    },
    lookup: (type, id) => {
      if (id == null) {
        id = type
        type = null
      }

      if (registry[id] &&
        (type !== null && registry[id].type === type)) {
        return registry[id]
      } else if (type === null) {
        return registry[id]
      }
    }
  }
}
