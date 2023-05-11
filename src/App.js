import { Routes, Route } from "react-router-dom";
import { Home, Landing, Detail, Create, NotFound, Update } from "./pages";
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
				<Route path="/dogs/:id" element={<Detail />} />
				<Route path="/create" element={<Create />} />
				<Route path="/update/:id" element={<Update />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
}

export default App;
