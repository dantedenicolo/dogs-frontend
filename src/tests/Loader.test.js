import React from "react";
import { screen, render } from "@testing-library/react";

import { LoaderComponent } from "../components";

describe("DogCard", () => {
	test("renders DogCard component", () => {
		render(<LoaderComponent />);
		expect(screen.getByAltText("Loading...")).toBeInTheDocument();
	});
});
