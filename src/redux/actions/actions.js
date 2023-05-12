import axios from "axios";

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
} from "./types";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const getDogs = () => async (dispatch) => {
	try {
		// GET request to the server
		const response = await axios.get(`${BACKEND_URL}/dogs`);

		// Dispatch the action with the response data
		dispatch({
			type: GET_DOGS,
			payload: response.data,
		});
	} catch (error) {
		// if there is an error, console.log it
		console.log(error);
		console.log("back", BACKEND_URL);
	}
};

export const getTemperaments = () => async (dispatch) => {
	try {
		// GET request to the server
		const response = await axios.get(`${BACKEND_URL}/temperaments`);
		// Dispatch the action with the response data
		dispatch({
			type: GET_TEMPERAMENTS,
			payload: response.data,
		});
	} catch (error) {
		// if there is an error, console.log it
		console.log(error);
	}
};

export const getDogByName = (name) => async (dispatch) => {
	try {
		// GET request to the server
		const response = await axios.get(`${BACKEND_URL}/dogs?name=${name}`);
		// Dispatch the action with the response data
		dispatch({
			type: GET_DOG_BY_NAME,
			payload: response.data,
		});
	} catch (error) {
		// if no dogs are found, dispatch the action with the payload ["No dogs found"]
		dispatch({
			type: GET_DOG_BY_NAME,
			payload: ["No dogs found"],
		});
	}
};

export const getDogDetails = (id) => async (dispatch) => {
	try {
		// GET request to the server
		const response = await axios.get(`${BACKEND_URL}/dogs/${id}`);
		// Dispatch the action with the response data
		dispatch({
			type: GET_DOG_DETAILS,
			payload: response.data,
		});
	} catch (error) {
		// if no dogs are found, dispatch the action with the payload ["No dogs found"]
		dispatch({
			type: GET_DOG_DETAILS,
			payload: ["No dogs found"],
		});
	}
};

export const createDog = (dog) => async (dispatch) => {
	try {
		// POST request to the server
		const response = await axios.post(`${BACKEND_URL}/dogs`, dog);
		// Dispatch the action with the response data
		dispatch({
			type: CREATE_DOG,
			payload: response.data,
		});
	} catch (error) {
		// if there is an error, return an object with the error and the message
		return { error: true, message: error.response.data.message };
	}
};

export const filterDogsByTemperamentAndCreated =
	(tempers, created) => (dispatch) => {
		// Dispatch the action with the payload
		dispatch({
			type: FILTER_DOGS_BY_TEMPERAMENT_AND_CREATED,
			payload: { tempers, created },
		});
	};

export const orderDogsByName = (order) => (dispatch) => {
	// Dispatch the action with the payload
	dispatch({
		type: ORDER_DOGS_BY_NAME,
		payload: order,
	});
};

export const orderDogsByWeight = (order) => (dispatch) => {
	// Dispatch the action with the payload
	dispatch({
		type: ORDER_DOGS_BY_WEIGHT,
		payload: order,
	});
};

export const cleanState = () => (dispatch) => {
	// Dispatch the action
	dispatch({
		type: CLEAN_STATE,
	});
};

export const setCurrentPageGlobal = (page) => (dispatch) => {
	// Dispatch the action
	dispatch({
		type: SET_CURRENT_PAGE,
		payload: page,
	});
};

export const setCurrentFilterByCreated = (created) => (dispatch) => {
	// Dispatch the action
	dispatch({
		type: SET_CURRENT_FILTER_BY_CREATED,
		payload: created,
	});
};

export const setCurrentFilterByTemperament = (tempers) => (dispatch) => {
	// Dispatch the action
	dispatch({
		type: SET_CURRENT_FILTER_BY_TEMPERAMENT,
		payload: tempers,
	});
};

export const setCurrentOrderByWeight = (order) => (dispatch) => {
	// Dispatch the action
	dispatch({
		type: SET_CURRENT_ORDER_BY_WEIGHT,
		payload: order,
	});
};

export const setCurrentOrderByName = (order) => (dispatch) => {
	// Dispatch the action
	dispatch({
		type: SET_CURRENT_ORDER_BY_NAME,
		payload: order,
	});
};

export const setCurrentSearch = (search) => (dispatch) => {
	// Dispatch the action
	dispatch({
		type: SET_CURRENT_SEARCH,
		payload: search,
	});
};

export const resetState = () => (dispatch) => {
	// Dispatch the action
	dispatch({
		type: RESET_STATE,
	});
};

export const resetFiltersAndOrder = () => (dispatch) => {
	// Dispatch the action
	dispatch({
		type: RESET_FILTERS_AND_ORDER,
	});
};

export const updateDog = (dog) => async (dispatch) => {
	try {
		// PUT request to the server
		const response = await axios.put(`${BACKEND_URL}/dogs/${dog.id}`, dog);
		// Dispatch the action with the response data
		dispatch({
			type: UPDATE_DOG,
			payload: response.data,
		});
	} catch (error) {
		// if there is an error, return an object with the error and the message
		return { error: true, message: error.response.data.message };
	}
};

export const deleteDog = (id) => async (dispatch) => {
	try {
		// DELETE request to the server
		await axios.delete(`${BACKEND_URL}/dogs/${id}`);
		// Dispatch the action with the response data
		dispatch({
			type: DELETE_DOG,
			payload: id,
		});
	} catch (error) {
		// if there is an error, return an object with the error and the message
		return { error: true, message: error.response.data.message };
	}
};
