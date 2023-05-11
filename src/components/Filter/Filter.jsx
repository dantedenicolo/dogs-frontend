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
	const currentFilterByTemperament = useSelector(
		(state) => state.currentFilterByTemperament
	);
	const currentFilterByCreated = useSelector(
		(state) => state.currentFilterByCreated
	);
	const [selectedTemperament, setSelectedTemperament] = useState(
		currentFilterByTemperament
	);
	const [selectedCreated, setSelectedCreated] = useState(
		currentFilterByCreated
	);
	const temperaments = useSelector((state) => state.temperaments);
	const orderByWeight = useSelector((state) => state.currentOrderByWeight);
	const orderByName = useSelector((state) => state.currentOrderByName);

	useEffect(() => {
		dispatch(getTemperaments());
	}, [dispatch]);

	temperaments.sort((a, b) => {
		if (a.name > b.name) return 1;
		if (a.name < b.name) return -1;
		return 0;
	});

	const handleFilterByTemperament = (e) => {
		setSelectedTemperament(e.target.value);
		dispatch(
			filterDogsByTemperamentAndCreated(e.target.value, selectedCreated)
		);
		dispatch(setCurrentPageGlobal(1));
		dispatch(setCurrentFilterByTemperament(e.target.value));
		dispatch(orderDogsByWeight(orderByWeight));
		dispatch(orderDogsByName(orderByName));
	};

	const handleFilterByCreated = (e) => {
		setSelectedCreated(e.target.value);
		dispatch(
			filterDogsByTemperamentAndCreated(selectedTemperament, e.target.value)
		);
		dispatch(setCurrentPageGlobal(1));
		dispatch(setCurrentFilterByCreated(e.target.value));
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
