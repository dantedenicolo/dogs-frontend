import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	createDog,
	getTemperaments,
	filterDogsByTemperamentAndCreated,
	orderDogsByWeight,
	orderDogsByName,
	getDogByName,
} from "../../redux/actions/actions";
import styles from "./Create.module.css";
import { useNavigate } from "react-router-dom";
import { Form } from "../../components";

export default function Create() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// defining errors state with initial value so that the form is disabled at first
	const [errors, setErrors] = useState({ initial: "initial" });
	// defining selected temperaments state
	const [selectedTemperaments, setSelectedTemperaments] = useState([]);
	// defining input state
	const [input, setInput] = useState({
		name: "",
		heightMin: "",
		heightMax: "",
		weightMin: "",
		weightMax: "",
		life_span: "",
		image: "",
		temperament: [],
	});
	// getting temperaments from redux store
	const temperaments = useSelector((state) => state.temperaments);
	// getting current search, filters and orders from redux store
	const filterByCreated = useSelector((state) => state.currentFilterByCreated);
	const filterByTemperament = useSelector(
		(state) => state.currentFilterByTemperament
	);
	const orderByWeight = useSelector((state) => state.currentOrderByWeight);
	const orderByName = useSelector((state) => state.currentOrderByName);
	const currentSearch = useSelector((state) => state.currentSearch);

	// getting temperaments from database
	useEffect(() => {
		dispatch(getTemperaments());
	}, [dispatch]);

	// sorting temperaments alphabetically
	temperaments.sort((a, b) => {
		if (a.name > b.name) return 1;
		if (a.name < b.name) return -1;
		return 0;
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		// if there are no errors, dispatch createDog action
		if (Object.keys(errors).length === 0) {
			dispatch(createDog(input)).then((res) => {
				if (res && res.error) {
					// if there is an error from the server, alert it
					return alert("Error creating dog: " + res.message);
				}
				// if there is no error, alert success
				alert("Dog created successfully!");
				// dispatch current search, filters and orders
				dispatch(getDogByName(currentSearch)).then(() => {
					dispatch(
						filterDogsByTemperamentAndCreated(
							filterByTemperament,
							filterByCreated
						)
					);
					dispatch(orderDogsByWeight(orderByWeight));
					dispatch(orderDogsByName(orderByName));
					// navigate to home
					navigate("/home");
				});
			});
		} else {
			// if there are errors, alert it
			alert("Please, check the form for errors.");
		}
	};

	return (
		<div className={styles.createContainer}>
			<div className={styles.create}>
				<h1 className={styles.title}>Create a dog</h1>
				<Form
					handleSubmit={handleSubmit}
					selectedTemperaments={selectedTemperaments}
					temperaments={temperaments}
					image={input.image}
					input={input}
					setInput={setInput}
					setSelectedTemperaments={setSelectedTemperaments}
					errors={errors}
					setErrors={setErrors}
					formTitle={"Create"}
				/>
			</div>
		</div>
	);
}
