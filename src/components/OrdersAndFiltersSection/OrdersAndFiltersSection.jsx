import styles from "./OrdersAndFiltersSection.module.css";
import { Order, Filter } from "../../components";

export default function OrdersAndFiltersSection() {
	return (
		<div className={styles.container}>
			<Order />
			<Filter />
		</div>
	);
}
