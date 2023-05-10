import styles from "./DogCard.module.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
	setCurrentPageGlobal,
	setCurrentFilterByCreated,
	setCurrentFilterByTemperament,
	setCurrentOrderByWeight,
	setCurrentOrderByName,
	filterDogsByTemperamentAndCreated,
} from "../../redux/actions/actions";

export default function DogCard(props) {
	const { id, name, image, temperament, weightMin, weightMax } = props.dog;

	const weightAvg = (parseInt(weightMin) + parseInt(weightMax)) / 2;

	const dispatch = useDispatch();

	const handleFilterTemp = (e) => {
		e.preventDefault();
		dispatch(setCurrentPageGlobal(1));
		dispatch(setCurrentFilterByCreated("default"));
		dispatch(setCurrentFilterByTemperament(e.target.innerText));
		dispatch(filterDogsByTemperamentAndCreated(e.target.innerText, "default"));
		dispatch(setCurrentOrderByWeight("default"));
		dispatch(setCurrentOrderByName("default"));
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
					</div>
				</div>
			</Link>
		</>
	);
}
