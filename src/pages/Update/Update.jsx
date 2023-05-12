import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDogDetails, cleanState } from "../../redux/actions/actions";
import styles from "./Update.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { LoaderComponent, Form } from "../../components";

export default function Update() {
	// destructuring id from params
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	// defining selected temperaments state
	const [selectedTemperaments, setSelectedTemperaments] = useState([]);
	// defining input state
	const [input, setInput] = useState({
		id: id,
		name: "",
		heightMin: "",
		heightMax: "",
		weightMin: "",
		weightMax: "",
		life_span: "",
		image: "",
		temperament: [],
	});

	// getting dog details from redux store
	const dog = useSelector((state) => state.dogDetails);
	// getting temperaments from redux store
	const temperaments = useSelector((state) => state.temperaments);

	// sorting temperaments alphabetically
	temperaments.sort((a, b) => {
		if (a.name > b.name) return 1;
		if (a.name < b.name) return -1;
		return 0;
	});

	// getting dog details from database
	useEffect(() => {
		dispatch(getDogDetails(id));
		return () => {
			// clean the dog details state when unmounting the component
			dispatch(cleanState());
		};
	}, [dispatch, id]);

	// if dog is not found or if it is found but it is not created in database, redirect to not found page
	if (dog[0] === "No dogs found" || (dog.name && !dog.createdInDb)) {
		navigate("/notfound");
	}

	useEffect(() => {
		// if temperaments and dog details are loaded, set input and selected temperaments
		if (temperaments.length && dog.name && dog.createdInDb) {
			const temperamentsIDs = [];
			// getting temperaments IDs from temperaments names in dog details
			temperaments.map((temp) => {
				if (dog.temperament.includes(temp.name)) {
					temperamentsIDs.push(temp.id);
				}
			});
			setInput({
				...input,
				name: String(dog.name),
				heightMin: String(dog.heightMin),
				heightMax: String(dog.heightMax),
				weightMin: String(dog.weightMin),
				weightMax: String(dog.weightMax),
				life_span: String(dog.life_span.replace(" years", "")),
				image: String(dog.image),
				temperament: temperamentsIDs,
			});
			const selectedTemperaments = [];
			// getting temperaments IDs from temperaments names in dog details and setting selected temperaments object
			dog.temperament.map((temp) => {
				selectedTemperaments.push({
					name: temp,
					id: temperaments.find((t) => t.name === temp).id,
				});
			});
			setSelectedTemperaments(selectedTemperaments);
		}
	}, [id, temperaments, dog]);

	return (
		<div className={styles.createContainer}>
			<div className={styles.create}>
				<h1 className={styles.title}>Update a dog</h1>
				{dog.name && (
					<Form
						image={dog.image}
						input={input}
						setInput={setInput}
						temperaments={temperaments}
						selectedTemperaments={selectedTemperaments}
						setSelectedTemperaments={setSelectedTemperaments}
						type="update"
					/>
				)}
				{!dog.name && <LoaderComponent />}
			</div>
		</div>
	);
}
