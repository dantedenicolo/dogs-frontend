import styles from "./DogCard.module.css";
import { Link } from "react-router-dom";

export default function DogCard(props) {
	const { id, name, image, temperament, weightMin, weightMax } = props.dog;

	const weightAvg = (parseInt(weightMin) + parseInt(weightMax)) / 2;

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
										.map((temp) => (
											<p className={styles.temperament}>{temp}</p>
										))}
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
