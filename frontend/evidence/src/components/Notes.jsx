import { useState, useEffect, useContext } from "react";
import { FaEdit, FaStickyNote, FaTrash } from "react-icons/fa";
import { getNotes, createNote, updateNote, deleteNote } from "../api/notes";
import { AuthContext } from "../context/AuthContext";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noteId, setNoteId] = useState(null); // for edit
  const { token } = useContext(AuthContext);

  // Fetch notes from backend
  useEffect(() => {
    if (token) fetchNotes();
    // eslint-disable-next-line
  }, [token]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await getNotes(token);
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setNotes([]);
    }
    setLoading(false);
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    setLoading(true);
    try {
      if (noteId) {
        await updateNote(noteId, { title, content }, token);
      } else {
        await createNote({ title, content }, token);
      }
      await fetchNotes();
    } catch (err) {
      console.error(err);
    }
    setTitle("");
    setContent("");
    setEditIdx(null);
    setNoteId(null);
    setModalOpen(false);
    setLoading(false);
  };

  const handleEdit = (idx) => {
    setTitle(notes[idx].title);
    setContent(notes[idx].content);
    setEditIdx(idx);
    setNoteId(notes[idx].id);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setTitle("");
    setContent("");
    setEditIdx(null);
    setNoteId(null);
    setModalOpen(true);
  };

  const handleDelete = async (idx) => {
    if (window.confirm("Delete this note?")) {
      setLoading(true);
      try {
        await deleteNote(notes[idx].id, token);
        await fetchNotes();
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
      if (editIdx === idx) {
        setTitle("");
        setContent("");
        setEditIdx(null);
        setNoteId(null);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-2 py-5">
      <h2 className="text-3xl font-bold mb-8 flex items-center text-center text-indigo-200">
        <span className="inline-block mr-2">
          <FaStickyNote />
        </span>
        My Notes
      </h2>
      <button
        onClick={handleAddNew}
        className="mb-6 px-6 py-2 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg"
      >
        Add Note
      </button>

      {/* Modal for Add/Edit Note */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white/10 rounded-xl p-6 shadow-lg w-full max-w-md relative border border-indigo-700">
            <button
              className="absolute top-2 right-3 text-indigo-200 text-xl font-bold hover:text-white"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <form onSubmit={handleAddOrEdit}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded bg-white/20 text-white placeholder-indigo-300 border border-indigo-700 outline-none"
              />
              <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="w-full mb-3 px-4 py-2 rounded bg-white/20 text-white placeholder-indigo-300 border border-indigo-700 outline-none resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg"
              >
                {editIdx !== null ? "Update Note" : "Add Note"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ul className="space-y-4">
        {notes.length === 0 && (
          <li className="text-gray-300 text-center">No notes yet.</li>
        )}
        {Array.isArray(notes) &&
          notes.map((note, idx) => (
            <li
              key={idx}
              className="bg-white/10 rounded-xl p-3 shadow flex justify-between"
            >
              <div className="flex flex-col ">
                <div className="font-bold text-indigo-200 text-lg mb-1">
                  {note.title || "Untitled"}
                </div>
                <div className="text-white mb-3 whitespace-pre-wrap break-words">
                  {note.content}
                </div>
              </div>

              <div className="flex gap-3 ">
                <button
                  className="rounded text-white font-semibold hover:bg-indigo-800"
                  onClick={() => handleEdit(idx)}
                >
                  <FaEdit />
                </button>
                <button
                  className="rounded text-white font-semibold hover:bg-red-800"
                  onClick={() => handleDelete(idx)}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Notes;
