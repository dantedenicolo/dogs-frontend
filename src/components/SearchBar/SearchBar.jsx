import styles from "./SearchBar.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	getDogByName,
	setCurrentSearch,
	// resetFiltersAndOrder,
	setCurrentPageGlobal,
	filterDogsByTemperamentAndCreated,
	orderDogsByWeight,
	orderDogsByName,
} from "../../redux/actions/actions";

export default function SearchBar() {
	const currentSearch = useSelector((state) => state.currentSearch);
	const [search, setSearch] = useState(currentSearch);
	const [isDisabled, setIsDisabled] = useState(true);
	const dispatch = useDispatch();
	const filterByTemperament = useSelector(
		(state) => state.currentFilterByTemperament
	);
	const filterByCreated = useSelector((state) => state.currentFilterByCreated);
	const orderByWeight = useSelector((state) => state.currentOrderByWeight);
	const orderByName = useSelector((state) => state.currentOrderByName);

	const handleChange = (e) => {
		setSearch(e.target.value);
		setIsDisabled(false);
	};

	const handleSearch = (e) => {
		e.preventDefault();
		window.history.replaceState(null, null, window.location.pathname);
		dispatch(getDogByName(search)).then(() => {
			dispatch(setCurrentPageGlobal(1));
			dispatch(
				filterDogsByTemperamentAndCreated(filterByTemperament, filterByCreated)
			);
			dispatch(orderDogsByWeight(orderByWeight));
			dispatch(orderDogsByName(orderByName));
			dispatch(setCurrentSearch(search));
			setIsDisabled(true);
		});
	};

	const handleReset = (e) => {
		e.preventDefault();
		dispatch(getDogByName("")).then(() => {
			dispatch(setCurrentPageGlobal(1));
			dispatch(
				filterDogsByTemperamentAndCreated(filterByTemperament, filterByCreated)
			);
			dispatch(orderDogsByWeight(orderByWeight));
			dispatch(orderDogsByName(orderByName));
			dispatch(setCurrentSearch(""));
			setSearch("");
			setIsDisabled(true);
		});
	};

	return (
		<div className={styles.searchbarContainer}>
			<div className={styles.searchbar}>
				<input
					type="text"
					placeholder="Enter a dog name..."
					value={search}
					className={styles.input}
					onChange={handleChange}
				/>
				<span className={styles.reset} onClick={handleReset}>
					&#10005;
				</span>
				<input
					type="submit"
					value="Search"
					className={styles.button}
					disabled={isDisabled}
					onClick={handleSearch}
				/>
			</div>
		</div>
	);
}
