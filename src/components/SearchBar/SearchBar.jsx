import styles from "./SearchBar.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	getDogByName,
	setCurrentSearch,
	setCurrentPageGlobal,
	filterDogsByTemperamentAndCreated,
	orderDogsByWeight,
	orderDogsByName,
} from "../../redux/actions/actions";

export default function SearchBar() {
	// get current search from redux store so that it persists when unmounting the component
	const currentSearch = useSelector((state) => state.currentSearch);
	// set local state to current search
	const [search, setSearch] = useState(currentSearch);
	// set local state to true so that the search button is disabled when the component mounts
	const [isDisabled, setIsDisabled] = useState(true);
	const dispatch = useDispatch();
	// get current filters and orders from redux store so that they persist when unmounting the component
	const filterByTemperament = useSelector(
		(state) => state.currentFilterByTemperament
	);
	const filterByCreated = useSelector((state) => state.currentFilterByCreated);
	const orderByWeight = useSelector((state) => state.currentOrderByWeight);
	const orderByName = useSelector((state) => state.currentOrderByName);

	const handleChange = (e) => {
		// set local state to the value of the input
		setSearch(e.target.value);
		// enable the search button
		setIsDisabled(false);
	};

	const handleSearch = (e) => {
		e.preventDefault();
		// dispatch an action to get the dog by name
		dispatch(getDogByName(search)).then(() => {
			// set the current page to 1 to avoid bugs
			dispatch(setCurrentPageGlobal(1));
			// apply the current filters and orders
			dispatch(
				filterDogsByTemperamentAndCreated(filterByTemperament, filterByCreated)
			);
			dispatch(orderDogsByWeight(orderByWeight));
			dispatch(orderDogsByName(orderByName));
			dispatch(setCurrentSearch(search));
			// disable the search button
			setIsDisabled(true);
		});
	};

	// reset the search
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
