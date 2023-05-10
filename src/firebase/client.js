import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
	apiKey: "AIzaSyAcGT0VmQdjg5wu3pixJXpq8h2gvz6UZ24",
	authDomain: "dogsbreeds-231d9.firebaseapp.com",
	projectId: "dogsbreeds-231d9",
	storageBucket: "dogsbreeds-231d9.appspot.com",
	messagingSenderId: "676808227684",
	appId: "1:676808227684:web:00ce1c18be7c7c1dbf1871",
	measurementId: "G-0GNNNLNDSG",
};

!firebase.apps.length && firebase.initializeApp(firebaseConfig);

export const uploadImage = (file) => {
	const randomFileName = `${Date.now()}-${file.name}`;
	const ref = firebase.storage().ref(`/images/${randomFileName}`);
	const task = ref.put(file);
	return task;
};
