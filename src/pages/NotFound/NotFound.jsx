import styles from "./NotFound.module.css";
import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<div className={styles.container}>
			<img src="https://i.imgur.com/qIufhof.png" alt="404" />
			<h1>404</h1>
			<h2>Page not found</h2>
			<Link to="/home">Go back to home</Link>
		</div>
	);
}
