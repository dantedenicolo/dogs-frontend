import { useLocation } from "react-router-dom";

export default function useIsNavigationRoute() {
	const location = useLocation();
	const isNavigationRoute = location.pathname !== "/";

	return isNavigationRoute;
}
