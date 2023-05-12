import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	getTemperaments,
	filterDogsByTemperamentAndCreated,
	setCurrentPageGlobal,
	setCurrentFilterByCreated,
	setCurrentFilterByTemperament,
	orderDogsByName,
	orderDogsByWeight,
} from "../../redux/actions/actions";
import styles from "./Filter.module.css";

export default function Filter() {
	const dispatch = useDispatch();
	// get current filters from redux store so that they persist when unmounting the component
	const currentFilterByTemperament = useSelector(
		(state) => state.currentFilterByTemperament
	);
	const currentFilterByCreated = useSelector(
		(state) => state.currentFilterByCreated
	);
	// set local state to current filters
	const [selectedTemperament, setSelectedTemperament] = useState(
		currentFilterByTemperament
	);
	const [selectedCreated, setSelectedCreated] = useState(
		currentFilterByCreated
	);
	// get all the temperaments from redux store
	const temperaments = useSelector((state) => state.temperaments);
	// get current orders from redux store so that they persist when unmounting the component
	const orderByWeight = useSelector((state) => state.currentOrderByWeight);
	const orderByName = useSelector((state) => state.currentOrderByName);

	useEffect(() => {
		// dispatch an action to get all the temperaments when the component mounts
		dispatch(getTemperaments());
	}, [dispatch]);

	// sort the temperaments alphabetically
	temperaments.sort((a, b) => {
		if (a.name > b.name) return 1;
		if (a.name < b.name) return -1;
		return 0;
	});

	const handleFilterByTemperament = (e) => {
		// set local state to the selected temperament
		setSelectedTemperament(e.target.value);
		// dispatch an action to filter the dogs by the selected temperament and the current created filter
		dispatch(
			filterDogsByTemperamentAndCreated(e.target.value, selectedCreated)
		);
		// set the current page to 1 to avoid bugs
		dispatch(setCurrentPageGlobal(1));
		// dispatch an action to update the current filter by temperament
		dispatch(setCurrentFilterByTemperament(e.target.value));
		// apply the current orders
		dispatch(orderDogsByWeight(orderByWeight));
		dispatch(orderDogsByName(orderByName));
	};

	const handleFilterByCreated = (e) => {
		// set local state to the selected created filter
		setSelectedCreated(e.target.value);
		// dispatch an action to filter the dogs by the current temperament filter and the selected created filter
		dispatch(
			filterDogsByTemperamentAndCreated(selectedTemperament, e.target.value)
		);
		// set the current page to 1 to avoid bugs
		dispatch(setCurrentPageGlobal(1));
		// dispatch an action to update the current filter by created
		dispatch(setCurrentFilterByCreated(e.target.value));
		// apply the current orders
		dispatch(orderDogsByWeight(orderByWeight));
		dispatch(orderDogsByName(orderByName));
	};

	return (
		<div className={styles.filterContainer}>
			<div className={styles.filter}>
				<h5 className={styles.title}>Filter by:</h5>
				<select
					name="temperaments"
					id="temperaments"
					className={styles.select}
					onChange={handleFilterByTemperament}
				>
					<option
						value="any"
						disabled
						selected={currentFilterByTemperament === "default"}
					>
						Temperament
					</option>
					<option value="any">All</option>
					{temperaments &&
						temperaments.map((temperament) => (
							<option
								key={temperament.id}
								value={temperament.name}
								selected={currentFilterByTemperament === temperament.name}
							>
								{temperament.name}
							</option>
						))}
				</select>
				<select
					name="created"
					id="created"
					className={styles.select}
					onChange={handleFilterByCreated}
				>
					<option
						value="any"
						disabled
						selected={currentFilterByCreated === "default"}
					>
						Created
					</option>
					<option value="any" selected={currentFilterByCreated === "any"}>
						All
					</option>
					<option
						value="created"
						selected={currentFilterByCreated === "created"}
					>
						Created in DB
					</option>
					<option value="api" selected={currentFilterByCreated === "api"}>
						API
					</option>
				</select>
			</div>
		</div>
	);
}
