import { useDispatch, useSelector } from 'react-redux'
import {
  orderDogsByName,
  orderDogsByWeight,
  setCurrentOrderByName,
  setCurrentOrderByWeight
} from '../../redux/actions/actions'
import styles from './Order.module.css'

export default function Order () {
  const dispatch = useDispatch()
  // get current orders from redux store so that they persist when unmounting the component
  const currentOrderByName = useSelector(state => state.currentOrderByName)
  const currentOrderByWeight = useSelector(state => state.currentOrderByWeight)

  const handleOrderByName = e => {
    // dispatch an action to order the dogs by name
    dispatch(orderDogsByName(e.target.value))
    // dispatch an action to update the current order by name
    dispatch(setCurrentOrderByName(e.target.value))
    // apply the current order by weight
    dispatch(orderDogsByWeight(currentOrderByWeight))
  }

  const handleOrderByWeight = e => {
    // apply the current order by name
    dispatch(orderDogsByName(currentOrderByName))
    // dispatch an action to order the dogs by weight
    dispatch(orderDogsByWeight(e.target.value))
    // dispatch an action to update the current order by weight
    dispatch(setCurrentOrderByWeight(e.target.value))
  }

  const handleReset = () => {
    // dispatch an action to order dogs by default values (asc in name because it's ordered like that by default)
    dispatch(orderDogsByName('asc'))
    dispatch(orderDogsByWeight('any'))
    // dispatch an action to update the current orders and set them to default
    dispatch(setCurrentOrderByName('default'))
    dispatch(setCurrentOrderByWeight('default'))
  }

  return (
    <div className={styles.orderContainer}>
      <div className={styles.order}>
        <h5 className={styles.title}>Order by:</h5>
        <select
          name='orderByName'
          id='orderByName'
          className={styles.select}
          onChange={handleOrderByName}
        >
          <option
            value='any'
            disabled
            selected={currentOrderByName === 'default'}
          >
            Name
          </option>
          <option value='asc' selected={currentOrderByName === 'asc'}>
            A-Z
          </option>
          <option value='desc' selected={currentOrderByName === 'desc'}>
            Z-A
          </option>
        </select>
        <select
          name='orderByWeight'
          id='orderByWeight'
          className={styles.select}
          onChange={handleOrderByWeight}
        >
          <option
            value='any'
            disabled
            selected={currentOrderByWeight === 'default'}
          >
            Weight
          </option>
          <option value='asc' selected={currentOrderByWeight === 'asc'}>
            Weight: Low to High
          </option>
          <option value='desc' selected={currentOrderByWeight === 'desc'}>
            Weight: High to Low
          </option>
        </select>
        <button className={styles.reset} onClick={handleReset}>
          &#10005;
        </button>
      </div>
    </div>
  )
}
