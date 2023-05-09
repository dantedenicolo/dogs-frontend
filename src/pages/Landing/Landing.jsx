import Logo from "../../assets/images/logo.png";
import styles from "./Landing.module.css";
import { Link } from "react-router-dom";

export default function Landing() {
	return (
		<>
			<div className={styles.container}>
				<img src={Logo} alt="logo" className={styles.logo} />
				<h1 className={styles.title}>Welcome to Dogs Breeds!</h1>
				<Link to="/home">
					<button className={styles.button}>Start</button>
				</Link>
			</div>
		</>
	);
}
