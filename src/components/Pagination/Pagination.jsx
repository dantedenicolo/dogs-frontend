import styles from "./Pagination.module.css";
import { setCurrentPageGlobal } from "../../redux/actions/actions";
import { useDispatch } from "react-redux";

export default function Pagination({
	totalDogs, // totalDogs is the total number of dogs
	dogsPerPage, // dogsPerPage is the number of dogs per page
	currentPage, // currentPage defines which page is currently active
}) {
	// pageNumbers is an array of numbers from 1 to the total number of pages
	const pageNumbers = [];
	const dispatch = useDispatch();

	// for loop that calculates the total number of pages and pushes them to the pageNumbers array
	for (let i = 1; i <= Math.ceil(totalDogs / dogsPerPage); i++) {
		pageNumbers.push(i);
	}

	// handlePrevious is a function that sets the current page to the previous page
	const handlePrevious = () => {
		// just works if currentPage is greater than 1
		if (currentPage > 1) {
			const newCurrentPage = Number(currentPage) - 1;
			// dispatch an action to update the current page in the redux store
			dispatch(setCurrentPageGlobal(newCurrentPage));
		}
	};

	// handleNext is a function that sets the current page to the next page
	const handleNext = () => {
		// just works if currentPage is less than the total number of pages
		if (currentPage < pageNumbers.length) {
			const newCurrentPage = Number(currentPage) + 1;
			// dispatch an action to update the current page in the redux store
			dispatch(setCurrentPageGlobal(newCurrentPage));
		}
	};

	// handleSetCurrentPage is a function that sets the current page to the page that is passed as an argument
	const handleSetCurrentPage = (number) => () => {
		const newCurrentPage = Number(number);
		// dispatch an action to update the current page in the redux store
		dispatch(setCurrentPageGlobal(newCurrentPage));
	};

	return (
		<div className={styles.pagination}>
			{/* if currentPage is greater than 1, then enable the previous button */}
			<button onClick={handlePrevious} disabled={currentPage === 1}>
				Previous
			</button>
			{/* map function that creates a button for each page */}
			{pageNumbers.map((number) => (
				<button
					key={number}
					onClick={handleSetCurrentPage(number)}
					className={currentPage === number ? styles.active : ""}
				>
					{number}
				</button>
			))}
			{/* if currentPage is less than the total number of pages, then enable the next button */}
			<button
				onClick={handleNext}
				disabled={currentPage === pageNumbers.length}
			>
				Next
			</button>
		</div>
	);
}
