import { Link } from "react-router-dom";
import styles from "./Nav.module.css";
import Logo from "../../assets/images/logo.png";

export default function Nav() {
	return (
		<nav>
			<div className={styles.container}>
				<img src={Logo} alt="logo" className={styles.logo} />
				<ul className={styles.navLinks}>
					<li>
						<Link to="/home">Home</Link>
					</li>
					<li>
						<Link to="/create">Create</Link>
					</li>
					<li className={styles.leave}>
						<Link to="/">Leave</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}
