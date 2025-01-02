import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import AudioRecorder from "./AudioRecorder";
interface NoteFormProps {
  initialValues?: {
    title: string | null;
    description: string | null;
    created_at: string | null;
    audio: string | null;
  };
  onSubmit: (values: { title: string; description: string; audio: Blob | null }) => void;
}

const NoteForm = ({ initialValues, onSubmit }: NoteFormProps) => {
  const navigate = useNavigate();
  const [setRecord, provideSetRecord] = useState<any>(null);

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      created_at: initialValues?.created_at || "",
      audio: initialValues?.audio || null,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit({ ...values, audio: audioBlob });
    },
  });

  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);
  

  const isEditing = !!initialValues;

  const handleBack = () => {
    navigate('/notes');
    setRecord(false);
  }

  return (
    <div className="mt-10 lg:mt-24 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🎙️ {isEditing? "Edit": "Create"} Your Note</h2>
      <form 
        onSubmit={formik.handleSubmit} 
        className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg"
        data-testid="note-form"
      >
        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
            Give your note a title* ✏️
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formik.values.title}
            onChange={formik.handleChange}
            placeholder="E.g., My Daily Reflection"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
            Add some details* 💬
          </label>
          <textarea
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            placeholder="E.g., Today I learned about..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows={5}
            required
          ></textarea>
        </div>

        <AudioRecorder
          initialAudio={initialValues?.audio}
          onAudioChange={(audioBlob) => setAudioBlob(audioBlob)}
          provideSetRecord={provideSetRecord}
        />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            Save Note
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
