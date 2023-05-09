import { Routes, Route } from "react-router-dom";
import { Home, Landing } from "./pages";
import { Nav } from "./components";
import { useIsNavigationRoute } from "./hooks";

function App() {
	const isNavigationRoute = useIsNavigationRoute();
	return (
		<div className="App">
			{isNavigationRoute && <Nav />}
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/home" element={<Home />} />
			</Routes>
		</div>
	);
}

export default App;
