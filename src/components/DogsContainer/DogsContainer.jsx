import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDogs } from "../../redux/actions/actions";
import { DogCard, Pagination, LoaderComponent } from "../";
import styles from "./DogsContainer.module.css";

export default function DogsContainer() {
	const dispatch = useDispatch();
	const dogs = useSelector((state) => {
		if (state.dogs.length > 0) {
			return state.dogs;
		} else {
			return ["loading"];
		}
	});
	const getCurrentPage = useSelector((state) => state.currentPage);
	const [currentPage, setCurrentPage] = useState(getCurrentPage);
	const [dogsPerPage] = useState(8);

	useEffect(() => {
		setCurrentPage(getCurrentPage);
	}, [getCurrentPage]);

	useEffect(() => {
		// just dispatch getDogs() if dogs is empty
		if (dogs.length === 0 || dogs[0] === "loading") {
			dispatch(getDogs());
		}
	}, [dispatch]);

	const indexOfLastDog = currentPage * dogsPerPage;
	const indexOfFirstDog = indexOfLastDog - dogsPerPage;
	const currentDogs = dogs.slice(indexOfFirstDog, indexOfLastDog);

	return (
		<>
			{dogs[0] === "loading" && <LoaderComponent />}
			{dogs.length > 0 &&
				dogs[0] !== "No dogs found" &&
				dogs[0] !== "loading" && (
					<>
						<div className={styles.dogsContainer}>
							{currentDogs.map((dog) => (
								<DogCard key={dog.id} dog={dog} />
							))}
						</div>
						<Pagination
							dogsPerPage={dogsPerPage}
							totalDogs={dogs.length}
							setCurrentPage={setCurrentPage}
							currentPage={currentPage}
						/>
					</>
				)}
			{dogs[0] === "No dogs found" && (
				<div className={styles.noDogs}>
					<h1>No dogs found.</h1>
				</div>
			)}
		</>
	);
}
