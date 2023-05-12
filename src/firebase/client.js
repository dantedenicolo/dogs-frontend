import firebase from "firebase/compat/app";
import "firebase/compat/storage";

// define firebase config object
const firebaseConfig = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
	measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// initialize firebase app if not already initialized
!firebase.apps.length && firebase.initializeApp(firebaseConfig);

export const uploadImage = (file) => {
	// create a random file name with the current timestamp + file name
	const randomFileName = `${Date.now()}-${file.name}`;
	// define where to store the file in firebase storage
	const ref = firebase.storage().ref(`/images/${randomFileName}`);
	// upload the file to the defined storage location
	const task = ref.put(file);
	// return the task object
	return task;
};
