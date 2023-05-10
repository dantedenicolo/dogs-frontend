import { useParams } from "react-router-dom";
import styles from "./Detail.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cleanState, getDogDetails } from "../../redux/actions/actions";
import { LoaderComponent } from "../../components";
import LoaderGif from "../../assets/images/loader.gif";
import { Link } from "react-router-dom";

export default function Detail() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const dog = useSelector((state) => state.dogDetails);

	useEffect(() => {
		dispatch(getDogDetails(id));
		return () => {
			dispatch(cleanState());
		};
	}, [dispatch, id]);

	const {
		name,
		image,
		temperament,
		weightMin,
		weightMax,
		heightMin,
		heightMax,
		life_span,
	} = dog;

	const imageSrc = image && image.url ? image.url : image ? image : LoaderGif;

	return (
		<>
			{!dog.name ? (
				<LoaderComponent />
			) : (
				<div className={styles.detailContainer}>
					<div className={styles.detail}>
						<h1 className={styles.name}>{name}</h1>
						<img
							src={imageSrc}
							alt={name}
							className={styles.image}
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = "https://i.imgur.com/FbCzXDP.png";
							}}
						/>
						<div className={styles.info}>
							<h3>Temperaments:</h3>
							<div className={styles.temperaments}>
								{temperament === "unknown" ? (
									<p className={styles.temperament}>Unknown</p>
								) : (
									temperament &&
									temperament
										.join(", ")
										.split(", ")
										.map((temp) => <p className={styles.temperament}>{temp}</p>)
								)}
							</div>
							<h3>
								Weight:{" "}
								<span className={styles.span}>
									{weightMin} - {weightMax} kg
								</span>
							</h3>
							<h3>
								Height:{" "}
								<span className={styles.span}>
									{heightMin} - {heightMax} cm
								</span>
							</h3>
							<h3>
								Life Span: <span className={styles.span}>{life_span}</span>
							</h3>
						</div>
					</div>
					<Link to={"/home"}>
						<button className={styles.button}>Back</button>
					</Link>
				</div>
			)}
		</>
	);
}
