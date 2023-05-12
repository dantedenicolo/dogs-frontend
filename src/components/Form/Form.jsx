import styles from "./Form.module.css";
import { useState, useEffect } from "react";
import { useValidate } from "../../hooks";
import { useDispatch, useSelector } from "react-redux";
import {
	createDog,
	updateDog,
	getDogByName,
	filterDogsByTemperamentAndCreated,
	orderDogsByWeight,
	orderDogsByName,
	setCurrentSearch,
	getTemperaments,
} from "../../redux/actions/actions";
import imageCompression from "browser-image-compression";
import { uploadImage } from "../../firebase/client";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Form({
	selectedTemperaments,
	temperaments,
	image,
	input,
	setInput,
	setSelectedTemperaments,
	type,
}) {
	// defining isDisabled state with initial value so that the form is disabled at first
	const [isDisabled, setIsDisabled] = useState(true);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// getting current search, filters and orders from redux store
	const currentSearch = useSelector((state) => state.currentSearch);
	const filterByTemperament = useSelector(
		(state) => state.currentFilterByTemperament
	);
	const filterByCreated = useSelector((state) => state.currentFilterByCreated);
	const orderByWeight = useSelector((state) => state.currentOrderByWeight);
	const orderByName = useSelector((state) => state.currentOrderByName);

	// defining errors state with initial value so that the form is disabled at first
	const [errors, setErrors] = useState({ initial: "initial" });

	useEffect(() => {
		// if there are no errors, enable the form
		if (Object.keys(errors).length === 0) {
			setIsDisabled(false);
		} else {
			// if there are errors, disable the form
			setIsDisabled(true);
		}
	}, [errors]);

	// getting temperaments from database
	useEffect(() => {
		dispatch(getTemperaments());
	}, [dispatch]);

	// defining imageURL state
	const [imageURL, setImageURL] = useState(image);

	const handleInputChange = (e) => {
		// update every input on its change
		setInput({
			...input,
			[e.target.name]: e.target.value,
		});
		// validate every input on its change
		setErrors(
			useValidate({
				...input,
				[e.target.name]: e.target.value,
			})
		);
	};

	const handleSelectChange = (e) => {
		// if the selected temperament is already selected, alert the user
		if (
			input.temperament.includes(Number(e.target.value)) ||
			selectedTemperaments.some(
				(temp) => Number(temp.id) === Number(e.target.value)
			)
		) {
			e.target.selectedIndex = 0;
			return alert("This temperament is already selected");
		}
		// update the input and selectedTemperaments state
		setInput({
			...input,
			temperament: [...input.temperament, e.target.value],
		});
		setSelectedTemperaments([
			...selectedTemperaments,
			{
				name: e.target.options[e.target.selectedIndex].getAttribute("tempname"),
				id: e.target.value,
			},
		]);
		// validate the input
		setErrors(
			useValidate({
				...input,
				[e.target.name]: e.target.value,
			})
		);
		// reset the select
		e.target.selectedIndex = 0;
	};

	const handleChangeImage = async (e) => {
		// set file to the selected file
		const file = e.target.files[0];
		// set options for image compression
		const options = {
			maxSizeMB: 1,
			maxWidthOrHeight: 1920,
		};

		// if there is no file, set imageURL to null and return
		if (!file) {
			setImageURL(null);
			return;
		}

		// if the file is not an image, alert the user and return
		if (
			!file.type.includes("image/png") &&
			!file.type.includes("image/jpeg") &&
			!file.type.includes("image/jpg")
		) {
			alert("Only images in PNG, JPEG or JPG format are allowed");
			return;
		}

		// if the file is bigger than 5MB, alert the user and return
		if (file.size > 5000000) {
			alert("The image must be less than 5MB");
			return;
		}

		try {
			// compress the image with the options set before
			const compressedFile = await imageCompression(file, options);
			// upload the image to firebase storage
			const task = uploadImage(compressedFile);
			task.on(
				"state_changed",
				(snapshot) => {
					console.log("Image uploading...");
				},
				(error) => {
					// if there is an error, console.log it
					console.log(error);
				},
				() => {
					// when the image is uploaded, get the url and set it to imageURL and input.image
					task.snapshot.ref.getDownloadURL().then((url) => {
						setImageURL(url);
						setInput({
							...input,
							image: url,
						});
					});
				}
			);
		} catch (error) {
			// if there is an error, console.log it
			console.log(error);
		}
	};

	const handleDelete = (e) => {
		e.preventDefault();
		// delete the selected temperament from the selectedTemperaments state
		setSelectedTemperaments(
			selectedTemperaments.filter(
				(temp) => Number(temp.id) !== Number(e.target.id)
			)
		);
		// delete the selected temperament from the input.temperament state
		setInput({
			...input,
			temperament: input.temperament.filter(
				(temperament) => Number(temperament) !== Number(e.target.id)
			),
		});
		// validate the input
		setErrors(
			useValidate({
				...input,
				temperament: input.temperament.filter(
					(temperament) => Number(temperament) !== Number(e.target.id)
				),
			})
		);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// if there are no errors, update dog
		if (Object.keys(errors).length === 0) {
			dispatch(type === "create" ? createDog(input) : updateDog(input)).then(
				(res) => {
					if (res && res.error) {
						// if there is an error from the server, alert it
						return alert(
							(type === "create"
								? "Error creating dog"
								: "Error updating dog") +
								": " +
								res.message
						);
					}
					// if there is no error, alert success
					alert(
						type === "create"
							? "Dog created successfully!"
							: "Dog updated successfully!"
					);
					// dispatch current search, filters and orders to update home page
					dispatch(getDogByName(currentSearch)).then(() => {
						dispatch(
							filterDogsByTemperamentAndCreated(
								filterByTemperament,
								filterByCreated
							)
						);
						dispatch(orderDogsByWeight(orderByWeight));
						dispatch(orderDogsByName(orderByName));
						dispatch(setCurrentSearch(currentSearch));
						// navigate to home page
						navigate("/home");
					});
				}
			);
		} else {
			// if there are errors, alert it
			alert("Please, check the form for errors.");
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className={styles.form}>
				<div className={styles.inputContainer}>
					<label htmlFor="name" className={styles.label}>
						Name:
					</label>
					<input
						type="text"
						name="name"
						id="name"
						placeholder="Enter a name..."
						value={input.name}
						onChange={handleInputChange}
						className={styles.input}
					/>
					{errors.name && <p className={styles.error}>{errors.name}</p>}
				</div>
				<div className={styles.inputContainer}>
					<label htmlFor="heightMin" className={styles.label}>
						Height Min (cm):
					</label>
					<div className={styles.rangeContainer}>
						<p className={styles.minmax}>1</p>
						<input
							type="range"
							name="heightMin"
							min="1"
							max={input.heightMax ? Number(input.heightMax) : "128"}
							value={input.heightMin || "1"}
							onChange={handleInputChange}
							className={styles.input}
						/>
						<p className={styles.minmax}>{input.heightMax || "128"}</p>
					</div>
					{input.heightMin && (
						<p className={styles.rangevalue}>{input.heightMin}</p>
					)}
					{errors.heightMin && (
						<p className={styles.error}>{errors.heightMin}</p>
					)}
				</div>
				<div className={styles.inputContainer}>
					<label htmlFor="heightMax" className={styles.label}>
						Height Max (cm):
					</label>
					<div className={styles.rangeContainer}>
						<p className={styles.minmax}>{input.heightMin || "2"}</p>
						<input
							type="range"
							name="heightMax"
							min={input.heightMin ? Number(input.heightMin) : "2"}
							max="129"
							value={input.heightMax || "129"}
							onChange={handleInputChange}
							className={styles.input}
						/>
						<p className={styles.minmax}>129</p>
					</div>
					{input.heightMax && (
						<p className={styles.rangevalue}>{input.heightMax}</p>
					)}
					{errors.heightMax && (
						<p className={styles.error}>{errors.heightMax}</p>
					)}
				</div>
				<div className={styles.inputContainer}>
					<label htmlFor="weightMin" className={styles.label}>
						Weight Min (kg):
					</label>
					<div className={styles.rangeContainer}>
						<p className={styles.minmax}>1</p>
						<input
							type="range"
							name="weightMin"
							min="1"
							max={input.weightMax ? Number(input.weightMax) : "198"}
							value={input.weightMin || "1"}
							onChange={handleInputChange}
							className={styles.input}
						/>
						<p className={styles.minmax}>{input.weightMax || "198"}</p>
					</div>
					{input.weightMin && (
						<p className={styles.rangevalue}>{input.weightMin}</p>
					)}
					{errors.weightMin && (
						<p className={styles.error}>{errors.weightMin}</p>
					)}
				</div>
				<div className={styles.inputContainer}>
					<label htmlFor="weightMax" className={styles.label}>
						Weight Max (kg):
					</label>
					<div className={styles.rangeContainer}>
						<p className={styles.minmax}>{input.weightMin || "2"}</p>
						<input
							type="range"
							name="weightMax"
							min={input.weightMin ? Number(input.weightMin) : "2"}
							max="199"
							value={input.weightMax || "199"}
							onChange={handleInputChange}
							className={styles.input}
						/>
						<p className={styles.minmax}>199</p>
					</div>
					{input.weightMax && (
						<p className={styles.rangevalue}>{input.weightMax}</p>
					)}
					{errors.weightMax && (
						<p className={styles.error}>{errors.weightMax}</p>
					)}
				</div>
				<div className={styles.inputContainer}>
					<label htmlFor="life_span" className={styles.label}>
						Life span (years):
					</label>
					<div className={styles.rangeContainer}>
						<p className={styles.minmax}>1</p>
						<input
							type="range"
							name="life_span"
							min="1"
							max="35"
							value={input.life_span || "1"}
							onChange={handleInputChange}
							className={styles.input}
						/>
						<p className={styles.minmax}>35</p>
					</div>
					{input.life_span && (
						<p className={styles.rangevalue}>{input.life_span}</p>
					)}
					{errors.life_span && (
						<p className={styles.error}>{errors.life_span}</p>
					)}
				</div>
				<div className={styles.inputContainer}>
					<p className={styles.label}>Image:</p>
					<label htmlFor="image" className={styles.labelImg}>
						Upload image
					</label>
					<input
						type="file"
						name="image"
						id="image"
						accept="image/png, image/jpeg, image/jpg"
						onChange={handleChangeImage}
						className={styles.file}
					/>
					<p className={styles.previewTxt}>Preview:</p>
					<img
						src={input.image}
						className={styles.preview}
						// if the image fails to load, set the src to a default image
						onError={(e) => {
							e.target.onerror = null; // remove the onerror attribute to avoid infinite loop
							e.target.src = "https://i.imgur.com/FbCzXDP.png";
						}}
					/>
				</div>
				<div className={styles.inputContainer}>
					<label htmlFor="temperament" className={styles.label}>
						Temperament:
					</label>
					<select
						name="temperament"
						id="temperament"
						className={styles.select}
						onChange={handleSelectChange}
					>
						<option value="any" disabled selected>
							Temperament
						</option>
						{temperaments &&
							temperaments.map((temperament) => (
								<option
									key={temperament.id}
									value={temperament.id}
									tempname={temperament.name}
								>
									{temperament.name}
								</option>
							))}
					</select>
					{errors.temperament && (
						<p className={styles.error}>{errors.temperament}</p>
					)}
				</div>
				<div className={styles.temperaments}>
					{selectedTemperaments &&
						selectedTemperaments.map((temp) => (
							<>
								<p className={styles.temperament}>
									{temp.name}{" "}
									<span
										className={styles.delete}
										onClick={handleDelete}
										id={temp.id}
									>
										X
									</span>
								</p>
							</>
						))}
				</div>
				<input
					type="submit"
					value={type === "create" ? "Create" : "Update"}
					className={styles.button}
					disabled={isDisabled}
				/>
				<Link to="/home">
					<button className={styles.back}>Back</button>
				</Link>
			</div>
		</form>
	);
}
