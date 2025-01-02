import { useState, useEffect } from "react";
import { ReactMic } from "react-mic";
import { useGetMedia } from "src/services/api/notes/getMedia";
import { createAudioURL } from "src/utils/helpers";

interface AudioRecorderProps {
	initialAudio?: string | null;
	onAudioChange: (audioBlob: Blob | null) => void;
	provideSetRecord: any;
}

const AudioRecorder = ({
	initialAudio,
	onAudioChange,
	provideSetRecord,
}: AudioRecorderProps) => {
	const { mutate: getMediaURL } = useGetMedia();

	const [record, setRecord] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [isFinished, setIsFinished] = useState(false);
	const [audioBlobs, setAudioBlobs] = useState<Blob[]>([]);

	const [initialAudioURL, setInitialAudioURL] = useState<string | null>(null);
	const [finalAudioBlob, setFinalAudioBlob] = useState<Blob | null>(null);

	const handleStartRecording = () => {
		setRecord(true);
		setIsPaused(false);
		setAudioBlobs([]);
		setFinalAudioBlob(null);
	};

	const handleStopRecording = () => {
		setRecord(false);
		setIsPaused(false);
		setIsFinished(true);
	};

	useEffect(() => {
		provideSetRecord(setRecord);
	}, [provideSetRecord]);

	useEffect(() => {
		if (initialAudio) {
			getMediaURL(initialAudio, {
				onSuccess: (response) => {
					setInitialAudioURL(createAudioURL(response.data.base64_audio));
				},
				onError: () => {
					setInitialAudioURL(null);
				},
			});
		}
	}, [initialAudio]);

	useEffect(() => {
		if (isFinished) {
			const combinedBlob = new Blob(audioBlobs, { type: "audio/webm" });
			setFinalAudioBlob(combinedBlob);
			onAudioChange(combinedBlob); // Pass the updated audio back to the parent
			setIsFinished(false);
		}
	}, [audioBlobs]);

	const handlePauseRecording = () => {
		if (record) {
			setRecord(false);
			setIsPaused(true);
		}
	};

	const handleResumeRecording = () => {
		if (isPaused) {
			setRecord(true);
			setIsPaused(false);
		}
	};

	const handleOnStop = (recordedBlob: any) => {
		setAudioBlobs((prev) => [...prev, recordedBlob.blob]);
	};

	return (
		<div className="mb-6">
			<label className="block text-lg font-medium text-gray-700 mb-2">
				Record your audio 🎤
			</label>
			<div className="relative w-full max-w-xl h-32 bg-gray-100 rounded-md shadow-inner overflow-hidden">
				<ReactMic
					record={record}
					onStop={handleOnStop}
					strokeColor="#4F46E5"
					backgroundColor="#E5E7EB"
					visualSetting="frequencyBars"
					className="absolute inset-0"
				/>
			</div>
			<div className="flex space-x-4 mt-4">
				{!record && !isPaused && (
					<button
						type="button"
						onClick={handleStartRecording}
						className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
					>
						Start Recording
					</button>
				)}
				{record && (
					<button
						type="button"
						onClick={handlePauseRecording}
						className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600"
					>
						Pause
					</button>
				)}
				{isPaused && (
					<button
						type="button"
						onClick={handleResumeRecording}
						className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
					>
						Resume
					</button>
				)}
				{(record) && (
					<button
						type="button"
						onClick={handleStopRecording}
						className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
					>
						Finish recording
					</button>
				)}
			</div>
			{finalAudioBlob && (
				<audio
					controls
					src={URL.createObjectURL(finalAudioBlob)}
					crossOrigin="anonymous"
					className="mt-4 w-full"
				/>
			)}
			{!finalAudioBlob && initialAudioURL && (
				<audio
					controls
					data-testid="audio-player"
					src={initialAudioURL}
					crossOrigin="anonymous"
					className="mt-4 w-full"
				/>
			)}
		</div>
	);
};

export default AudioRecorder;
