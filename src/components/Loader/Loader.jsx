import Loader from "../../assets/images/loader.gif";
import styles from "./Loader.module.css";

export default function LoaderComponent() {
	return (
		<div className={styles.loading}>
			<img src={Loader} alt="Loading..." />
		</div>
	);
}
