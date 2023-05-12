import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDogs } from "../../redux/actions/actions";
import { DogCard, Pagination, LoaderComponent } from "../";
import styles from "./DogsContainer.module.css";

export default function DogsContainer() {
	const dispatch = useDispatch();
	// get dogs from redux store
	const dogs = useSelector((state) => {
		if (state.dogs.length > 0) {
			// when the dogs are loaded, return them
			return state.dogs;
		} else {
			// when the dogs are not loaded, return "loading"
			return ["loading"];
		}
	});
	// get current page from redux store
	const currentPage = useSelector((state) => state.currentPage);
	// define how many dogs per page
	const dogsPerPage = 8;

	useEffect(() => {
		// just dispatch getDogs() if dogs is empty
		if (dogs.length === 0 || dogs[0] === "loading") {
			// get all the dogs
			dispatch(getDogs());
		}
	}, [dispatch]);

	// get the index of first and last dog of the current page to slice the dogs array
	const indexOfLastDog = currentPage * dogsPerPage;
	const indexOfFirstDog = indexOfLastDog - dogsPerPage;
	// slice the dogs array to get the dogs of the current page
	const currentDogs = dogs.slice(indexOfFirstDog, indexOfLastDog);

	return (
		<>
			{/* if dogs are loading, show a loader */}
			{dogs[0] === "loading" && <LoaderComponent />}
			{/* if dogs are loaded and there are dogs, show the dogs */}
			{dogs.length > 0 &&
				dogs[0] !== "No dogs found" &&
				dogs[0] !== "loading" && (
					<>
						<div className={styles.dogsContainer}>
							{currentDogs.map((dog) => (
								// map function that creates a DogCard component for each dog
								<DogCard key={dog.id} dog={dog} />
							))}
						</div>
						{/* create a pagination component passing props to it */}
						<Pagination
							dogsPerPage={dogsPerPage}
							totalDogs={dogs.length}
							currentPage={currentPage}
						/>
					</>
				)}
			{/* if dogs are loaded and there are no dogs, show a message */}
			{dogs[0] === "No dogs found" && (
				<div className={styles.noDogs}>
					<h1>No dogs found.</h1>
				</div>
			)}
		</>
	);
}
