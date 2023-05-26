import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getTemperaments,
  filterDogsByTemperamentAndCreated,
  setCurrentPageGlobal,
  setCurrentFilterByCreated,
  setCurrentFilterByTemperament,
  orderDogsByName,
  orderDogsByWeight
} from '../../redux/actions/actions'
import styles from './Filter.module.css'

export default function Filter () {
  const dispatch = useDispatch()
  // get current filters from redux store so that they persist when unmounting the component
  const selectedTemperament = useSelector(
    state => state.currentFilterByTemperament
  )
  const selectedCreated = useSelector(state => state.currentFilterByCreated)
  // get all the temperaments from redux store
  const temperaments = useSelector(state => state.temperaments)
  // get current orders from redux store so that they persist when unmounting the component
  const orderByWeight = useSelector(state => state.currentOrderByWeight)
  const orderByName = useSelector(state => state.currentOrderByName)

  useEffect(() => {
    // dispatch an action to get all the temperaments when the component mounts
    dispatch(getTemperaments())
  }, [dispatch])

  // sort the temperaments alphabetically
  temperaments.sort((a, b) => {
    if (a.name > b.name) return 1
    if (a.name < b.name) return -1
    return 0
  })

  const handleFilterByTemperament = e => {
    // dispatch an action to filter the dogs by the selected temperament and the current created filter
    dispatch(filterDogsByTemperamentAndCreated(e.target.value, selectedCreated))
    // set the current page to 1 to avoid bugs
    dispatch(setCurrentPageGlobal(1))
    // dispatch an action to update the current filter by temperament
    dispatch(setCurrentFilterByTemperament(e.target.value))
    // apply the current orders
    dispatch(orderDogsByWeight(orderByWeight))
    dispatch(orderDogsByName(orderByName))
  }

  const handleFilterByCreated = e => {
    // dispatch an action to filter the dogs by the current temperament filter and the selected created filter
    dispatch(
      filterDogsByTemperamentAndCreated(selectedTemperament, e.target.value)
    )
    // set the current page to 1 to avoid bugs
    dispatch(setCurrentPageGlobal(1))
    // dispatch an action to update the current filter by created
    dispatch(setCurrentFilterByCreated(e.target.value))
    // apply the current orders
    dispatch(orderDogsByWeight(orderByWeight))
    dispatch(orderDogsByName(orderByName))
  }

  const handleReset = () => {
    // dispatch an action to reset filters
    dispatch(filterDogsByTemperamentAndCreated('any', 'any'))
    // set current filters to default
    dispatch(setCurrentFilterByCreated('default'))
    dispatch(setCurrentFilterByTemperament('default'))
    // set the current page to 1 to avoid bugs
    dispatch(setCurrentPageGlobal(1))
    // apply the current orders
    dispatch(orderDogsByWeight(orderByWeight))
    dispatch(orderDogsByName(orderByName))
  }

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filter}>
        <h5 className={styles.title}>Filter by:</h5>
        <select
          name='temperaments'
          id='temperaments'
          className={styles.select}
          onChange={handleFilterByTemperament}
        >
          <option
            value='any'
            disabled
            selected={selectedTemperament === 'default'}
          >
            Temperament
          </option>
          <option value='any'>All</option>
          {temperaments &&
            temperaments.map(temperament => (
              <option
                key={temperament.id}
                value={temperament.name}
                selected={selectedTemperament === temperament.name}
              >
                {temperament.name}
              </option>
            ))}
        </select>
        <select
          name='created'
          id='created'
          className={styles.select}
          onChange={handleFilterByCreated}
        >
          <option value='any' disabled selected={selectedCreated === 'default'}>
            Created
          </option>
          <option value='any' selected={selectedCreated === 'any'}>
            All
          </option>
          <option value='created' selected={selectedCreated === 'created'}>
            Created in DB
          </option>
          <option value='api' selected={selectedCreated === 'api'}>
            API
          </option>
        </select>
        <button className={styles.reset} onClick={handleReset}>
          &#10005;
        </button>
      </div>
    </div>
  )
}
