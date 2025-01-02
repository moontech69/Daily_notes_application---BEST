import { useState, useRef, useEffect } from "react";
import { BanIcon } from "@heroicons/react/outline";
import { TrashIcon, PlayIcon, PauseIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import { Note } from "src/types/note"; 
import { createAudioURL, formatRelativeTime } from "src/utils/helpers";
import { useGetMedia } from "src/services/api/notes/getMedia";

interface NoteCardProps {
  note: Note;
  handleDelete: (id: number) => void;
}

const NoteCard = ({ note, handleDelete }: NoteCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const [initialAudioURL, setInitialAudioURL] = useState<string|null>(null);
  const { mutate: getMediaURL } = useGetMedia();
  
  useEffect(() => {
    if (note.audio) {
      getMediaURL(note.audio, {
        onSuccess: (response) => {
          setInitialAudioURL(createAudioURL(response.data.base64_audio));    
        },
        onError: () => {
          setInitialAudioURL(null);
        }
      })
    }
  }, [note.audio])

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const handleCardClick = () => {
    navigate(`/notes/${note.id}`);
  };

  return (
    <div
      className="relative bg-white border rounded-lg shadow-md flex flex-col justify-between p-4 hover:shadow-lg transition h-full min-h-[200px] cursor-pointer"
      onClick={handleCardClick}
    >
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          handleDelete(note.id);
        }}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        aria-label="Delete Note"
      >
        <TrashIcon className="w-5 h-5" />
      </button>

      <time 
        className="absolute top-2 left-1 text-xs text-gray-500 ml-1" 
        title={new Date(note.created_at).toLocaleString()}
      >
        {formatRelativeTime(note.created_at)}
      </time>

      <h2 className="text-lg font-semibold text-gray-800 mt-2 break-all line-clamp-1">{note.title}</h2>
      
      <p className="mt-2 text-sm text-gray-600 line-clamp-4 break-words flex-grow">
        {note.description}
      </p>

      {initialAudioURL ? (
        <div className="mt-auto flex items-center space-x-4 pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPause();
            }}
            className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? (
              <PauseIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
          </button>
          <span className="text-sm text-gray-600">
            {isPlaying ? "Playing..." : "Play audio"}
          </span>
          <audio
            ref={audioRef}
            src={initialAudioURL}
            onEnded={handleAudioEnd}
            className="hidden"
            data-testid="audio-element"
          />
        </div>
      ) : (
        <div className="mt-auto flex items-center space-x-4 pt-4">
          <button
            className="flex items-center justify-center w-10 h-10 bg-gray-300 text-white rounded-full shadow-md"
            aria-label="No audio"
          >
            <BanIcon className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-400">No audio</span>
        </div>
      )}
    </div>
  );
};

export default NoteCard;
