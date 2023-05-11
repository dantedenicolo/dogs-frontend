import styles from "./DogCard.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	setCurrentPageGlobal,
	setCurrentFilterByCreated,
	setCurrentFilterByTemperament,
	setCurrentOrderByWeight,
	setCurrentOrderByName,
	orderDogsByName,
	orderDogsByWeight,
	filterDogsByTemperamentAndCreated,
	deleteDog,
	getDogs,
	getDogByName,
} from "../../redux/actions/actions";

export default function DogCard(props) {
	const { id, name, image, temperament, weightMin, weightMax, createdInDb } =
		props.dog;

	const weightMinNum = Number(weightMin) || 0;
	const weightMaxNum = Number(weightMax) || 0;
	const weightAvg = (weightMinNum + weightMaxNum) / 2;

	const dispatch = useDispatch();
	const filterByCreated = useSelector((state) => state.currentFilterByCreated);
	const filterByTemperament = useSelector(
		(state) => state.currentFilterByTemperament
	);
	const orderByWeight = useSelector((state) => state.currentOrderByWeight);
	const orderByName = useSelector((state) => state.currentOrderByName);
	const currentSearch = useSelector((state) => state.currentSearch);

	const handleFilterTemp = (e) => {
		e.preventDefault();
		dispatch(setCurrentPageGlobal(1));
		dispatch(setCurrentFilterByCreated("default"));
		dispatch(setCurrentFilterByTemperament(e.target.innerText));
		dispatch(filterDogsByTemperamentAndCreated(e.target.innerText, "default"));
		dispatch(setCurrentOrderByWeight("default"));
		dispatch(setCurrentOrderByName("default"));
	};

	const handleDeleteDog = (e) => {
		e.preventDefault();
		if (window.confirm("Are you sure you want to delete this dog?")) {
			dispatch(deleteDog(id)).then(() => {
				dispatch(getDogs()).then(() => {
					if (currentSearch !== "") {
						dispatch(getDogByName(currentSearch)).then(() => {
							dispatch(
								filterDogsByTemperamentAndCreated(
									filterByTemperament,
									filterByCreated
								)
							);
							dispatch(orderDogsByWeight(orderByWeight));
							dispatch(orderDogsByName(orderByName));
						});
					} else {
						dispatch(
							filterDogsByTemperamentAndCreated(
								filterByTemperament,
								filterByCreated
							)
						);
						dispatch(orderDogsByWeight(orderByWeight));
						dispatch(orderDogsByName(orderByName));
					}
				});
			});
		} else {
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
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = "https://i.imgur.com/FbCzXDP.png";
						}}
					/>

					<div className={styles.dogInfo}>
						<h3>{name}</h3>
						<h4>Temperaments:</h4>

						{temperament === "unknown" ? (
							<p className={styles.temperament}>Unknown</p>
						) : (
							temperament && (
								<div className={styles.temperaments}>
									{temperament
										.join(", ")
										.split(", ")
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
