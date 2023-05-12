import { useLocation } from "react-router-dom";

export default function useIsNavigationRoute() {
	const location = useLocation();
	// if the current path is not the root path, then it is a navigation route
	const isNavigationRoute = location.pathname !== "/";

	return isNavigationRoute;
}
