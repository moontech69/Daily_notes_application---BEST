import "@testing-library/jest-dom";
import { screen, fireEvent } from "@testing-library/react";
import AudioRecorder from "./AudioRecorder";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import React from "react";

const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
		// logger: {
		//   log: console.log,
		//   warn: console.warn,
		//   error: () => {},
		// }
	});

export function renderWithClient(ui: React.ReactElement) {
	const testQueryClient = createTestQueryClient();
	const { rerender, ...result } = render(
		<QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
	);
	return {
		...result,
		rerender: (rerenderUi: React.ReactElement) =>
			rerender(
				<QueryClientProvider client={testQueryClient}>
					{rerenderUi}
				</QueryClientProvider>
			),
	};
}

jest.mock("react-mic", () => ({
	ReactMic: () => <div data-testid="react-mic">Mic Visualization</div>,
}));

jest.mock("src/services/api/notes/getMedia", () => ({
	useGetMedia: () => ({
		mutate: (url: string, { onSuccess }: any) => {
			onSuccess({ data: { base64_audio: "aGVsbG8=" } });
		},
	}),
}));

describe("AudioRecorder", () => {
	const mockOnAudioChange = jest.fn();
	const mockProvideSetRecord = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		URL.createObjectURL = jest.fn(() => "blob:mock-url");
	});

	test("renders initial state correctly", () => {
		renderWithClient(
			<AudioRecorder
				onAudioChange={mockOnAudioChange}
				provideSetRecord={mockProvideSetRecord}
			/>
		);

		expect(screen.getByText("Record your audio 🎤")).toBeInTheDocument();
		expect(screen.getByText("Start Recording")).toBeInTheDocument();
		expect(screen.queryByText("Finish recording")).not.toBeInTheDocument();
	});

	test("shows correct buttons when recording starts", () => {
		renderWithClient(
			<AudioRecorder
				onAudioChange={mockOnAudioChange}
				provideSetRecord={mockProvideSetRecord}
			/>
		);

		fireEvent.click(screen.getByText("Start Recording"));

		expect(screen.queryByText("Start Recording")).not.toBeInTheDocument();
		expect(screen.getByText("Pause")).toBeInTheDocument();
		expect(screen.getByText("Finish recording")).toBeInTheDocument();
	});

	test("shows correct buttons when recording is paused", () => {
		renderWithClient(
			<AudioRecorder
				onAudioChange={mockOnAudioChange}
				provideSetRecord={mockProvideSetRecord}
			/>
		);

		fireEvent.click(screen.getByText("Start Recording"));
		fireEvent.click(screen.getByText("Pause"));

		expect(screen.getByText("Resume")).toBeInTheDocument();
	});

	test("displays initial audio when provided", () => {
		renderWithClient(
			<AudioRecorder
				initialAudio="test-audio-url"
				onAudioChange={mockOnAudioChange}
				provideSetRecord={mockProvideSetRecord}
			/>
		);

		const audioElement = screen.getByTestId("audio-player");
		expect(audioElement).toHaveAttribute("src", "blob:mock-url");
	});

	test("handles stop recording", () => {
		renderWithClient(
			<AudioRecorder
				onAudioChange={mockOnAudioChange}
				provideSetRecord={mockProvideSetRecord}
			/>
		);

		fireEvent.click(screen.getByText("Start Recording"));
		fireEvent.click(screen.getByText("Finish recording"));

		expect(screen.getByText("Start Recording")).toBeInTheDocument();
		expect(screen.queryByText("Finish recording")).not.toBeInTheDocument();
	});
});
