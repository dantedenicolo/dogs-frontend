import {
	GET_DOGS,
	GET_TEMPERAMENTS,
	GET_DOG_BY_NAME,
	GET_DOG_DETAILS,
	CREATE_DOG,
	FILTER_DOGS_BY_TEMPERAMENT_AND_CREATED,
	ORDER_DOGS_BY_NAME,
	ORDER_DOGS_BY_WEIGHT,
	CLEAN_STATE,
	SET_CURRENT_PAGE,
	SET_CURRENT_FILTER_BY_CREATED,
	SET_CURRENT_FILTER_BY_TEMPERAMENT,
	SET_CURRENT_ORDER_BY_NAME,
	SET_CURRENT_ORDER_BY_WEIGHT,
	SET_CURRENT_SEARCH,
	RESET_STATE,
	RESET_FILTERS_AND_ORDER,
	UPDATE_DOG,
	DELETE_DOG,
} from "../actions/types";

// Define an initial global state for the app
const initialState = {
	dogs: [],
	temperaments: [],
	dogDetails: [],
	dogFilters: [],
	currentPage: 1,
	currentSearch: "",
	currentFilterByTemperament: "default",
	currentFilterByCreated: "default",
	currentOrderByWeight: "default",
	currentOrderByName: "default",
};

// Define the reducer function
export default function reducer(state = initialState, action) {
	switch (action.type) {
		// If the action type is GET_DOGS, return the new state with the dogs array updated
		case GET_DOGS:
			return {
				...state,
				dogs: action.payload,
				dogFilters: action.payload,
			};
		// If the action type is GET_TEMPERAMENTS, return the new state with the temperaments array updated
		case GET_TEMPERAMENTS:
			return {
				...state,
				temperaments: action.payload,
			};
		// If the action type is GET_DOG_BY_NAME, return the new state with the dogs array updated
		case GET_DOG_BY_NAME:
			return {
				...state,
				dogs: action.payload,
				dogFilters: action.payload,
			};
		// If the action type is GET_DOG_DETAILS, return the new state with the dogDetails array updated
		case GET_DOG_DETAILS:
			return {
				...state,
				dogDetails: action.payload,
			};
		// If the action type is CREATE_DOG, just return the state
		case CREATE_DOG:
			return {
				...state,
			};

		// If the action type is FILTER_DOGS_BY_TEMPERAMENT_AND_CREATED, return the new state with the dogs filtered by temperament and created
		case FILTER_DOGS_BY_TEMPERAMENT_AND_CREATED:
			// Define a new array with all the dogs
			const allDogs = [...state.dogFilters];
			// Define a new array with the dogs filtered
			const filteredDogs = [];

			// If the action payload is "any" or "default", return the state with all the dogs
			if (
				(action.payload.tempers === "any" ||
					action.payload.tempers === "default") &&
				(action.payload.created === "any" ||
					action.payload.created === "default")
			) {
				return {
					...state,
					dogs: allDogs,
				};
				// If the action payload is has a value for created but not for tempers, return the new state with the dogs filtered by created
			} else if (
				(action.payload.tempers === "any" ||
					action.payload.tempers === "default") &&
				action.payload.created !== "any" &&
				action.payload.created !== "default"
			) {
				allDogs.forEach((dog) => {
					// if the payload is "created", return the new state with the dogs created in the database
					if (action.payload.created === "created") {
						if (dog.createdInDb) {
							filteredDogs.push(dog);
						}
						// else, return the new state with the dogs not created in the database
					} else {
						if (!dog.createdInDb) {
							filteredDogs.push(dog);
						}
					}
				});
				// If the action payload is has a value for tempers but not for created, return the new state with the dogs filtered by temperament
			} else if (
				action.payload.tempers !== "any" &&
				action.payload.tempers !== "default" &&
				(action.payload.created === "any" ||
					action.payload.created === "default")
			) {
				allDogs.forEach((dog) => {
					// check for the dogs that have the selected temperament
					if (dog.temperament?.includes(action.payload.tempers)) {
						filteredDogs.push(dog);
					}
				});
				// If the action payload is has a value for tempers and for created, return the new state with the dogs filtered by temperament and created
			} else {
				allDogs.forEach((dog) => {
					// check for the dogs that have the selected temperament
					if (dog.temperament?.includes(action.payload.tempers)) {
						// check for the dogs that are created in the database and push them according to the payload
						if (action.payload.created === "created") {
							if (dog.createdInDb) {
								filteredDogs.push(dog);
							}
						} else {
							if (!dog.createdInDb) {
								filteredDogs.push(dog);
							}
						}
					}
				});
			}

			// If the filteredDogs array is empty, push a message
			if (filteredDogs.length === 0) {
				filteredDogs.push("No dogs found");
			}
			// Return the new state with the dogs filtered by temperament and created
			return {
				...state,
				dogs: filteredDogs,
			};

		// If the action type is ORDER_DOGS_BY_NAME, return the new state with the dogs ordered by name
		case ORDER_DOGS_BY_NAME:
			// Define a new array with all the dogs
			const allDogsByName = [...state.dogs];

			// If the action payload is "any" or "default", return the state with all the dogs
			if (action.payload === "any" || action.payload === "default") {
				return {
					...state,
					dogs: allDogsByName,
				};
			}
			const dogsByName =
				// If the action payload is "asc", return the new state with the dogs ordered by name ascending
				action.payload === "asc"
					? allDogsByName.sort((a, b) => {
							if (a.name > b.name) return 1;
							if (a.name < b.name) return -1;
							return 0;
					  })
					: // Else, return the new state with the dogs ordered by name descending
					  allDogsByName.sort((a, b) => {
							if (a.name > b.name) return -1;
							if (a.name < b.name) return 1;
							return 0;
					  });

			// If the dogsByName array is empty, push a message
			if (dogsByName.length === 0) {
				dogsByName.push("No dogs found");
			}
			// Return the new state with the dogs ordered by name
			return {
				...state,
				dogs: dogsByName,
			};

		case ORDER_DOGS_BY_WEIGHT:
			// Define a new array with all the dogs
			const allDogsByWeight = [...state.dogs];

			// Transform the weightMin and weightMax values to numbers (if they are not numbers, return 0)
			const weightMin = (dog) => {
				return Number(dog.weightMin) || 0;
			};
			const weightMax = (dog) => {
				return Number(dog.weightMax) || 0;
			};
			// Calculate the average weight of the dog
			const weightAvg = (dog) => {
				return (weightMin(dog) + weightMax(dog)) / 2;
			};

			// If the action payload is "any" or "default", return the state with all the dogs
			if (action.payload === "any" || action.payload === "default") {
				return {
					...state,
					dogs: allDogsByWeight,
				};
			}

			const dogsByWeight =
				// If the action payload is "asc", return the new state with the dogs ordered by weight average ascending
				action.payload === "asc"
					? allDogsByWeight.sort((a, b) => {
							if (weightAvg(a) > weightAvg(b)) return 1;
							if (weightAvg(a) < weightAvg(b)) return -1;
							return 0;
					  })
					: // Else, return the new state with the dogs ordered by weight average descending
					  allDogsByWeight.sort((a, b) => {
							if (weightAvg(a) > weightAvg(b)) return -1;
							if (weightAvg(a) < weightAvg(b)) return 1;
							return 0;
					  });

			// If the dogsByWeight array is empty, push a message
			if (dogsByWeight.length === 0) {
				dogsByWeight.push("No dogs found");
			}
			// Return the new state with the dogs ordered by weight
			return {
				...state,
				dogs: dogsByWeight,
			};
		// If the action type is CLEAN_STATE, return the new state with the dogDetails array empty
		case CLEAN_STATE:
			return {
				...state,
				dogDetails: [],
			};
		// If the action type is SET_CURRENT_PAGE, return the new state with the currentPage updated
		case SET_CURRENT_PAGE:
			return {
				...state,
				currentPage: action.payload,
			};
		// If the action type is SET_CURRENT_SEARCH, return the new state with the currentSearch updated
		case SET_CURRENT_SEARCH:
			return {
				...state,
				currentSearch: action.payload,
			};
		// If the action type is SET_CURRENT_FILTER_BY_TEMPERAMENT, return the new state with the currentFilterByTemperament updated
		case SET_CURRENT_FILTER_BY_TEMPERAMENT:
			return {
				...state,
				currentFilterByTemperament: action.payload,
			};
		// If the action type is SET_CURRENT_FILTER_BY_CREATED, return the new state with the currentFilterByCreated updated
		case SET_CURRENT_FILTER_BY_CREATED:
			return {
				...state,
				currentFilterByCreated: action.payload,
			};
		// If the action type is SET_CURRENT_ORDER_BY_NAME, return the new state with the currentOrderByName updated
		case SET_CURRENT_ORDER_BY_NAME:
			return {
				...state,
				currentOrderByName: action.payload,
			};
		// If the action type is SET_CURRENT_ORDER_BY_WEIGHT, return the new state with the currentOrderByWeight updated
		case SET_CURRENT_ORDER_BY_WEIGHT:
			return {
				...state,
				currentOrderByWeight: action.payload,
			};
		// If the action type is RESET_STATE, return the initial state
		case RESET_STATE:
			return initialState;
		// If the action type is RESET_FILTERS_AND_ORDER, return the new state with the filters and order reseted
		case RESET_FILTERS_AND_ORDER:
			return {
				...state,
				currentFilterByTemperament: "default",
				currentFilterByCreated: "default",
				currentOrderByWeight: "default",
				currentOrderByName: "default",
			};
		// If the action type is UPDATE_DOG, just return the state
		case UPDATE_DOG:
			return {
				...state,
			};
		// If the action type is DELETE_DOG, just return the state
		case DELETE_DOG:
			return {
				...state,
			};

		// If the action type is not defined, just return the state
		default:
			return state;
	}
}
