import { useDispatch, useSelector } from "react-redux";
import {
	orderDogsByName,
	orderDogsByWeight,
	setCurrentOrderByName,
	setCurrentOrderByWeight,
} from "../../redux/actions/actions";
import styles from "./Order.module.css";

export default function Order() {
	const dispatch = useDispatch();
	const currentOrderByName = useSelector((state) => state.currentOrderByName);
	const currentOrderByWeight = useSelector(
		(state) => state.currentOrderByWeight
	);

	const handleOrderByName = (e) => {
		window.history.replaceState(null, null, window.location.pathname);
		dispatch(orderDogsByName(e.target.value));
		dispatch(setCurrentOrderByName(e.target.value));
		dispatch(setCurrentOrderByWeight(currentOrderByWeight));
	};

	const handleOrderByWeight = (e) => {
		window.history.replaceState(null, null, window.location.pathname);
		dispatch(orderDogsByWeight(e.target.value));
		dispatch(setCurrentOrderByWeight(e.target.value));
		dispatch(setCurrentOrderByName(currentOrderByName));
	};

	return (
		<div className={styles.orderContainer}>
			<div className={styles.order}>
				<h5 className={styles.title}>Order by:</h5>
				<select
					name="orderByName"
					id="orderByName"
					className={styles.select}
					onChange={handleOrderByName}
				>
					<option
						value="any"
						disabled
						selected={currentOrderByName === "default"}
					>
						Name
					</option>
					<option value="asc" selected={currentOrderByName === "asc"}>
						A-Z
					</option>
					<option value="desc" selected={currentOrderByName === "desc"}>
						Z-A
					</option>
				</select>
				<select
					name="orderByWeight"
					id="orderByWeight"
					className={styles.select}
					onChange={handleOrderByWeight}
				>
					<option
						value="any"
						disabled
						selected={currentOrderByWeight === "default"}
					>
						Weight
					</option>
					<option value="asc" selected={currentOrderByWeight === "asc"}>
						Weight: Low to High
					</option>
					<option value="desc" selected={currentOrderByWeight === "desc"}>
						Weight: High to Low
					</option>
				</select>
			</div>
		</div>
	);
}
