import styles from "./DogCard.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	setCurrentPageGlobal,
	setCurrentFilterByTemperament,
	orderDogsByName,
	orderDogsByWeight,
	filterDogsByTemperamentAndCreated,
	deleteDog,
	getDogByName,
} from "../../redux/actions/actions";

export default function DogCard(props) {
	// destructure props to get the dog's info
	const { id, name, image, temperament, weightMin, weightMax, createdInDb } =
		props.dog;

	// transform the weight to a number and calculate the average (if any of the weights is unknown or NaN, it will be 0)
	const weightMinNum = Number(weightMin) || 0;
	const weightMaxNum = Number(weightMax) || 0;
	const weightAvg = (weightMinNum + weightMaxNum) / 2;

	const dispatch = useDispatch();
	// get current filters and orders from redux store so that they persist when unmounting the component
	const filterByCreated = useSelector((state) => state.currentFilterByCreated);
	const filterByTemperament = useSelector(
		(state) => state.currentFilterByTemperament
	);
	const orderByWeight = useSelector((state) => state.currentOrderByWeight);
	const orderByName = useSelector((state) => state.currentOrderByName);
	// get current search from redux store so that it persists when unmounting the component
	const currentSearch = useSelector((state) => state.currentSearch);

	// filter the dogs by temperament for tags
	const handleFilterTemp = (e) => {
		e.preventDefault();
		// set the current page to 1 to avoid bugs
		dispatch(setCurrentPageGlobal(1));
		// dispatch an action to update the current filter by temperament
		dispatch(setCurrentFilterByTemperament(e.target.innerText));
		// dispatch an action to filter the dogs by the selected temperament and the current created filter
		dispatch(
			filterDogsByTemperamentAndCreated(e.target.innerText, filterByCreated)
		);
		// apply the current orders
		dispatch(orderDogsByWeight(orderByWeight));
		dispatch(orderDogsByName(orderByName));
	};

	const handleDeleteDog = (e) => {
		e.preventDefault();
		// ask the user for confirmation before deleting the dog
		if (window.confirm("Are you sure you want to delete this dog?")) {
			// dispatch an action to delete the dog
			dispatch(deleteDog(id)).then(() => {
				// dispatch an action to get all the dogs again
				dispatch(getDogByName(currentSearch)).then(() => {
					// apply the current filters
					dispatch(
						filterDogsByTemperamentAndCreated(
							filterByTemperament,
							filterByCreated
						)
					);
					// apply the current orders
					dispatch(orderDogsByWeight(orderByWeight));
					dispatch(orderDogsByName(orderByName));
				});
			});
		} else {
			// if the user cancels the deletion, do nothing
			return;
		}
	};

	return (
		<>
			<Link to={`/dogs/${id}`}>
				<div className={styles.dogCard} key={id}>
					<img
						src={image.url || image}
						alt={name}
						// if the image fails to load, show a default image
						onError={(e) => {
							e.target.onerror = null; // prevent infinite loop
							e.target.src = "https://i.imgur.com/FbCzXDP.png";
						}}
					/>

					<div className={styles.dogInfo}>
						<h3>{name}</h3>
						<h4>Temperaments:</h4>

						{temperament === "unknown" ? (
							// if the temperament is unknown, show as Unknown
							<p className={styles.temperament}>Unknown</p>
						) : (
							// if the temperament is not unknown, show the temperament tags
							temperament && (
								<div className={styles.temperaments}>
									{temperament
										.join(", ")
										.split(", ")
										// show only the first 8 temperaments
										.slice(0, 8)
										.map((temp) => (
											<p
												key={temp}
												className={styles.temperament}
												onClick={handleFilterTemp}
											>
												{temp}
											</p>
										))}
									{temperament.length > 8 && (
										// if there are more than 8 temperaments, show a "..." tag that links to the dog's page
										<Link to={`/dogs/${id}`} className={styles.temperament}>
											...
										</Link>
									)}
								</div>
							)
						)}
						<h4>Weight Average:</h4>
						<p className={styles.weight}>{weightAvg} kg</p>
						{createdInDb && (
							// if the dog was created in the database, show the Edit and Delete buttons
							<div className={styles.createdInDbContainer}>
								<Link to={`/update/${id}`} className={styles.edit}>
									Edit
								</Link>
								<button className={styles.delete} onClick={handleDeleteDog}>
									Delete
								</button>
							</div>
						)}
					</div>
				</div>
			</Link>
		</>
	);
}
