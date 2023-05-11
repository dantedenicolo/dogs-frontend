import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDog } from "../../redux/actions/actions";
import styles from "./Update.module.css";
import { uploadImage } from "../../firebase/client";
import imageCompression from "browser-image-compression";
import { useValidate } from "../../hooks";
import { useParams } from "react-router-dom";
import { LoaderComponent } from "../../components";
import { Link } from "react-router-dom";

export default function Update() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const [dog, setDog] = useState({});
	const [temperaments, setTemperaments] = useState([]);

	useEffect(() => {
		fetch(`http://localhost:3001/temperaments`)
			.then((res) => res.json())
			.then((data) => {
				setTemperaments(data);
			});
	}, []);

	useEffect(() => {
		if (temperaments.length) {
			fetch(`http://localhost:3001/dogs/${id}`)
				.then((res) => res.json())
				.then((data) => {
					if (!data.id) {
						return (window.location.href = "/notfound");
					}
					if (!data.createdInDb) {
						return (window.location.href = "/notfound");
					}
					setDog(data);
					const temperamentsIDs = [];
					temperaments.map((temp) => {
						if (data.temperament.includes(temp.name)) {
							temperamentsIDs.push(temp.id);
						}
					});
					setInput({
						...input,
						name: String(data.name),
						heightMin: String(data.heightMin),
						heightMax: String(data.heightMax),
						weightMin: String(data.weightMin),
						weightMax: String(data.weightMax),
						life_span: String(data.life_span.replace(" years", "")),
						image: String(data.image),
						temperament: temperamentsIDs,
					});
					const selectedTemperaments = [];
					data.temperament.map((temp) => {
						selectedTemperaments.push({
							name: temp,
							id: temperaments.find((t) => t.name === temp).id,
						});
					});
					setSelectedTemperaments(selectedTemperaments);
				});
		}
	}, [id, temperaments]);

	const [selectedTemperaments, setSelectedTemperaments] = useState([]);
	const [isDisabled, setIsDisabled] = useState(true);

	temperaments.sort((a, b) => {
		if (a.name > b.name) return 1;
		if (a.name < b.name) return -1;
		return 0;
	});
	const [imageURL, setImageURL] = useState(dog.image);

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

	const [errors, setErrors] = useState({ initial: "initial" });

	useEffect(() => {
		if (Object.keys(errors).length === 0) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [errors]);

	const handleInputChange = (e) => {
		setInput({
			...input,
			[e.target.name]: e.target.value,
		});
		setErrors(
			useValidate({
				...input,
				[e.target.name]: e.target.value,
			})
		);
	};

	const handleSelectChange = (e) => {
		if (
			input.temperament.includes(e.target.value) ||
			selectedTemperaments.some((temp) => temp.id === e.target.value)
		) {
			e.target.selectedIndex = 0;
			return alert("This temperament is already selected");
		}
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
		setErrors(
			useValidate({
				...input,
				[e.target.name]: e.target.value,
			})
		);
		e.target.selectedIndex = 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (Object.keys(errors).length === 0) {
			dispatch(updateDog(input)).then((res) => {
				if (res && res.error) {
					return alert("Error updating dog: " + res.message);
				}
				alert("Dog updated successfully!");
				window.location.replace("/home");
			});
		} else {
			alert("Please, check the form for errors.");
		}
	};

	const handleChangeImage = async (e) => {
		const file = e.target.files[0];
		const options = {
			maxSizeMB: 1,
			maxWidthOrHeight: 1920,
		};

		if (!file) {
			setImageURL(null);
			return;
		}
		if (
			!file.type.includes("image/png") &&
			!file.type.includes("image/jpeg") &&
			!file.type.includes("image/jpg")
		) {
			alert("Only images in PNG, JPEG or JPG format are allowed");
			return;
		}

		if (file.size > 5000000) {
			alert("The image must be less than 5MB");
			return;
		}

		try {
			const compressedFile = await imageCompression(file, options);
			const task = uploadImage(compressedFile);
			task.on(
				"state_changed",
				(snapshot) => {
					const percentage =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				},
				(error) => {
					console.log(error);
				},
				() => {
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
			console.log(error);
		}
	};

	const handleDelete = (e) => {
		e.preventDefault();
		setSelectedTemperaments(
			selectedTemperaments.filter((temp) => temp.id !== Number(e.target.id))
		);
		setInput({
			...input,
			temperament: input.temperament.filter(
				(temperament) => temperament !== Number(e.target.id)
			),
		});
		setErrors(
			useValidate({
				...input,
				temperament: input.temperament.filter(
					(temperament) => temperament !== Number(e.target.id)
				),
			})
		);
	};

	return (
		<div className={styles.createContainer}>
			<div className={styles.create}>
				<h1 className={styles.title}>Update a dog</h1>
				{input.name && (
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
								<p className={styles.label}>Imagen:</p>
								<label htmlFor="image" className={styles.labelImg}>
									Subir imagen
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
									onError={(e) => {
										e.target.onerror = null;
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
								value="Update"
								className={styles.button}
								disabled={isDisabled}
							/>
						</div>
					</form>
				)}
				{!input.name && <LoaderComponent />}
			</div>
		</div>
	);
}
