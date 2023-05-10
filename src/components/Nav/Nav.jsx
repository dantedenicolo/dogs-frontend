import { Link } from "react-router-dom";
import styles from "./Nav.module.css";
import Logo from "../../assets/images/logo.png";
import { useDispatch } from "react-redux";
import { resetState } from "../../redux/actions/actions";

export default function Nav() {
	const dispatch = useDispatch();

	const handleLeave = () => {
		dispatch(resetState());
	};

	return (
		<nav>
			<div className={styles.container}>
				<Link to="/home">
					<img src={Logo} alt="logo" className={styles.logo} />
				</Link>
				<ul className={styles.navLinks}>
					<li>
						<Link to="/home">Home</Link>
					</li>
					<li>
						<Link to="/create">Create</Link>
					</li>
					<li>
						<Link to="/" className={styles.leave} onClick={handleLeave}>
							Leave
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}
