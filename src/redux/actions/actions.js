import axios from "axios";
import { BACKEND_URL } from "../../utils/constants";

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
} from "./types";

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
		console.log(error);
	}
};

export const getTemperaments = () => async (dispatch) => {
	try {
		// GET request to the server
		const response = await axios.get(`${BACKEND_URL}/temperaments`);
		dispatch({
			type: GET_TEMPERAMENTS,
			payload: response.data,
		});
	} catch (error) {
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
		console.log(error);
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
		return { error: true, message: error.response.data.message };
	}
};

export const filterDogsByTemperamentAndCreated =
	(tempers, created) => (dispatch) => {
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
	console.log(page);
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
