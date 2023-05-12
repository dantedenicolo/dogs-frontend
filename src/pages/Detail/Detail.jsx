import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./Detail.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	cleanState,
	getDogDetails,
	setCurrentPageGlobal,
	setCurrentFilterByTemperament,
	orderDogsByName,
	orderDogsByWeight,
	filterDogsByTemperamentAndCreated,
} from "../../redux/actions/actions";
import { LoaderComponent } from "../../components";
import LoaderGif from "../../assets/images/loader.gif";

export default function Detail() {
	// destructuring id from params
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// getting dog details from redux store
	const dog = useSelector((state) => state.dogDetails);
	// getting current filters and orders from redux store
	const currentFilterByCreated = useSelector(
		(state) => state.currentFilterByCreated
	);
	const currentOrderByWeight = useSelector(
		(state) => state.currentOrderByWeight
	);
	const currentOrderByName = useSelector((state) => state.currentOrderByName);

	// get dog details from database
	useEffect(() => {
		dispatch(getDogDetails(id));
		return () => {
			// clean the dog details state when unmounting the component
			dispatch(cleanState());
		};
	}, [dispatch, id]);

	// if the dog is not found, redirect to not found page
	useEffect(() => {
		if (dog[0] === "No dogs found") {
			navigate("/notfound");
		}
	}, [dog]);

	// destructuring dog details
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

	// if the image is inside an object, get the url, otherwise, get the image
	const imageSrc = image && image.url ? image.url : image ? image : LoaderGif;

	// filter the dogs by temperament for tags
	const handleFilterTemp = (e) => {
		e.preventDefault();
		// set the current page to 1 to avoid bugs
		dispatch(setCurrentPageGlobal(1));
		// set the current filter by temperament to the selected temperament
		dispatch(setCurrentFilterByTemperament(e.target.innerText));
		// filter the dogs by temperament and created
		dispatch(
			filterDogsByTemperamentAndCreated(
				e.target.innerText,
				currentFilterByCreated
			)
		);
		// order the dogs by weight and name
		dispatch(orderDogsByWeight(currentOrderByWeight));
		dispatch(orderDogsByName(currentOrderByName));
		// navigate to home page
		navigate("/home");
	};

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
								// if the image fails to load, set the src to a default image
								e.target.onerror = null; // remove the onerror attribute to avoid infinite loop
								e.target.src = "https://i.imgur.com/FbCzXDP.png";
							}}
						/>
						<div className={styles.info}>
							<h3>Temperaments:</h3>
							<div className={styles.temperaments}>
								{temperament === "unknown" ? (
									// if the temperament is unknown, display Unknown
									<p className={styles.temperament}>Unknown</p>
								) : (
									temperament &&
									temperament
										.join(", ")
										.split(", ")
										.map((temp) => (
											// map through the temperaments and display them as tags
											<Link
												to={`/home`}
												key={temp}
												className={styles.temperament}
												onClick={handleFilterTemp}
											>
												{temp}
											</Link>
										))
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
