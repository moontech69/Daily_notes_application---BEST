import NoteCard from "./NoteCard";

interface NotesGridProps {
  notes: any[];
  handleDelete: (id: number) => void;
}

const NotesGrid = ({ notes, handleDelete }: NotesGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-6 p-3">
      {notes.length === 0 ? (
        <div className="col-span-full text-center text-gray-500">There is no note.</div>
      ) : (
        notes.map((note) => (
          <NoteCard key={note.id} note={note} handleDelete={handleDelete} />
        ))
      )}
    </div>
  );
};

export default NotesGrid;
