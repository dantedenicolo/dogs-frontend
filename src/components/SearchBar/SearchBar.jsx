import styles from "./SearchBar.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDogByName, setCurrentSearch } from "../../redux/actions/actions";

export default function SearchBar() {
	const currentSearch = useSelector((state) => state.currentSearch);
	const [search, setSearch] = useState(currentSearch);
	const [isDisabled, setIsDisabled] = useState(true);
	const dispatch = useDispatch();

	const handleChange = (e) => {
		setSearch(e.target.value);
		setIsDisabled(false);
	};

	const handleSearch = (e) => {
		e.preventDefault();
		window.history.replaceState(null, null, window.location.pathname);
		dispatch(getDogByName(search));
		dispatch(setCurrentSearch(search));
		setIsDisabled(true);
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
