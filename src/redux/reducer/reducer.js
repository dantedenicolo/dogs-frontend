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
			} else if (
				(action.payload.tempers === "any" ||
					action.payload.tempers === "default") &&
				action.payload.created !== "any" &&
				action.payload.created !== "default"
			) {
				allDogs.forEach((dog) => {
					if (action.payload.created === "created") {
						if (dog.createdInDb) {
							filteredDogs.push(dog);
						}
					} else {
						if (!dog.createdInDb) {
							filteredDogs.push(dog);
						}
					}
				});
			} else if (
				action.payload.tempers !== "any" &&
				action.payload.tempers !== "default" &&
				(action.payload.created === "any" ||
					action.payload.created === "default")
			) {
				allDogs.forEach((dog) => {
					if (dog.temperament?.includes(action.payload.tempers)) {
						filteredDogs.push(dog);
					}
				});
			} else {
				allDogs.forEach((dog) => {
					if (dog.temperament?.includes(action.payload.tempers)) {
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

			if (action.payload === "any") {
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
			const weightAvg = (dog) => {
				return (parseInt(dog.weightMin) + parseInt(dog.weightMax)) / 2;
			};

			if (action.payload === "any") {
				return {
					...state,
					dogs: allDogsByWeight,
				};
			}

			const dogsByWeight =
				// If the action payload is "asc", return the new state with the dogs ordered by weight ascending
				action.payload === "asc"
					? allDogsByWeight.sort((a, b) => {
							if (weightAvg(a) > weightAvg(b)) return 1;
							if (weightAvg(a) < weightAvg(b)) return -1;
							return 0;
					  })
					: // Else, return the new state with the dogs ordered by weight descending
					  allDogsByWeight.sort((a, b) => {
							if (weightAvg(a) > weightAvg(b)) return -1;
							if (weightAvg(a) < weightAvg(b)) return 1;
							return 0;
					  });

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
		// If the action type is RESET_FILTERS_AND_ORDER, return the new state with the dogs array updated
		case RESET_FILTERS_AND_ORDER:
			return {
				...state,
				currentFilterByTemperament: "default",
				currentFilterByCreated: "default",
				currentOrderByWeight: "default",
				currentOrderByName: "default",
			};

		default:
			return state;
	}
}
