import styles from "./Home.module.css";
import {
	DogsContainer,
	OrdersAndFiltersSection,
	SearchBar,
} from "../../components";

export default function Home() {
	return (
		<div>
			<SearchBar />
			<OrdersAndFiltersSection />
			<DogsContainer />
		</div>
	);
}
