import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Create.module.css";
import { Form } from "../../components";

export default function Create() {
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

	// sorting temperaments alphabetically
	temperaments.sort((a, b) => {
		if (a.name > b.name) return 1;
		if (a.name < b.name) return -1;
		return 0;
	});

	return (
		<div className={styles.createContainer}>
			<div className={styles.create}>
				<h1 className={styles.title}>Create a dog</h1>
				<Form
					image={input.image}
					input={input}
					setInput={setInput}
					temperaments={temperaments}
					selectedTemperaments={selectedTemperaments}
					setSelectedTemperaments={setSelectedTemperaments}
					type="create"
				/>
			</div>
		</div>
	);
}
