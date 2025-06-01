import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import {DeleteIcon} from "./icons/DeleteIcon";
import {CopyIcon} from "./icons/CopyIcon";

interface Note {
  id: number;
  text: string;
  time: string;
}

const App: React.FC = () => {
  const isInit = useRef(true)
  const [notes, setNotes] = useState<Note[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // Загрузка записей из localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('meetingNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Сохранение записей в localStorage
  useEffect(() => {
    if (isInit.current) {
      isInit.current = false;
      return;
    }

    localStorage.setItem('meetingNotes', JSON.stringify(notes));
  }, [notes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const newNote: Note = {
        id: Date.now(),
        text: inputValue,
        time: new Date().toLocaleTimeString(),
      };
      setNotes((prevNotes) => [...prevNotes, newNote]);
      setInputValue('');
    }
  };

  const handleDelete = (id: number) => {
    setNotes((prevNotes) => prevNotes.filter(note => note.id !== id));
  };

  const handleEdit = (id: number) => {
    setEditingNoteId(id);
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setEditingText(noteToEdit.text);
    }
  };

  const handleSaveEdit = (id: number) => {
    setNotes((prevNotes) =>
        prevNotes.map(note => (note.id === id ? { ...note, text: editingText } : note))
    );
    setEditingNoteId(null);
    setEditingText('');
  };

  const onKeyPressEdit = (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSaveEdit(id)
    }
  }

  const handleDeleteAll = () => {
    setNotes([]);
  };

  const handleCopyAll = () => {
    const allNotesText = notes.map(note => `${note.time}: ${note.text}`).join('\n');
    navigator.clipboard.writeText(allNotesText).then(() => {
      alert('Все записи скопированы в буфер обмена!');
    }).catch(err => {
      console.error('Ошибка при копировании: ', err);
    });
  };

  return (
      <div className="App">
        <div className="header">
          <h1>Протокол встречи</h1>
          <button onClick={handleDeleteAll} className="header__button">
            <DeleteIcon/>
          </button>
          <button onClick={handleCopyAll} className="header__button">
            <CopyIcon/>
          </button>
        </div>
        <ul className="list">
          {notes.map(note => (
              <li key={note.id} className={"list__item"}>
                <span >{note.time} </span>
                {editingNoteId === note.id ? (
                  <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={() => handleSaveEdit(note.id)}
                      onKeyPress={(e) => onKeyPressEdit(e, note.id)}
                      autoFocus
                      className={'list__itemEdit'}
                  />
                ) : (
                  <>
                    <span  onClick={() => handleEdit(note.id)}>{note.text}</span>
                  </>
                )}
                <button className={"list__itemButton"} onClick={() => handleDelete(note.id)}><DeleteIcon/></button>
              </li>
          ))}
        </ul>
        <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Введите запись и нажмите Enter"
            className={'input'}
        />
      </div>
  );
};

export default App;