import './App.css';
import { useState, useEffect } from "react";

  interface Todo {
    id: number;
    description: string;
    completed: boolean;
    completedAt: string | null;
  }

function App() {
  const [todoDescription, setTodoDescription] = useState('');
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingDescription, setEditingDescription] = useState('');

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      const parsedTodos = JSON.parse(storedTodos);
      setTodoList(parsedTodos); // Cargar la lista de TODOs
    }
  }, []); // Este useEffect se ejecuta solo una vez, al cargar la página

  // Guardar los TODOs en localStorage cada vez que cambie la lista
  useEffect(() => {
    if (todoList.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todoList));
    }
  }, [todoList]); // Cerrar el segundo useEffect

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoDescription(e.target.value);
  };

  const handleClick = () => {
    if (todoDescription.trim() === '') return;
  
    const newTodo: Todo = {
      id: Date.now(),
      description: todoDescription,
      completed: false,
      completedAt: null,
    };
  
    setTodoList([newTodo, ...todoList]); // Agregar al principio
    setTodoDescription('');
  };

  const handleDeleteTodo = (id: number) => {
    const updatedTodos = todoList.filter(todo => todo.id !== id);
    setTodoList(updatedTodos);
  };

  const handleUpdateTodo = (id: number) => {
    const updatedTodos = todoList.map(todo => {
      if (todo.id === id) {
        return { ...todo, description: editingDescription };
      }
      return todo;
    });
  
    setTodoList(updatedTodos);
    setEditingId(null);
    setEditingDescription('');
  };

  const handleToggleComplete = (id: number) => {
    const updatedTodos = todoList.map(todo => {
      if (todo.id === id) {
        const isNowCompleted = !todo.completed;
        return {
          ...todo,
          completed: isNowCompleted,
          completedAt: isNowCompleted ? new Date().toLocaleString() : null,
        };
      }
      return todo;
    });
  
    // Ordenar: incompletos arriba, completados abajo
    const sortedTodos = [
      ...updatedTodos.filter(todo => !todo.completed),
      ...updatedTodos.filter(todo => todo.completed),
    ];
  
    setTodoList(sortedTodos);
  };

  return (
    <div style={{ border: '1px solid red', padding: 10 }}>
      <div>
        <input
          type='text'
          value={todoDescription}
          onChange={handleChange}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleClick}>Add Item</button>
      </div>
  
      <div style={{ marginTop: 20 }}>TODOs Here:</div>
     <ul>
  {todoList.map((todo) => (
    <li key={todo.id} style={{ marginBottom: 5 }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => handleToggleComplete(todo.id)}
        style={{ marginRight: 10 }}
      />

      {editingId === todo.id ? (
        <>
          <input
            type="text"
            value={editingDescription}
            onChange={(e) => setEditingDescription(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <button
            onClick={() => handleUpdateTodo(todo.id)}
            style={{ marginRight: 5 }}
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditingId(null);
              setEditingDescription('');
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.description}
          </span>

          {todo.completed && (
            <span style={{ fontSize: 12, color: 'gray', marginLeft: 10 }}>
              (Done: {todo.completedAt})
            </span>
          )}

          <button
            onClick={() => {
              setEditingId(todo.id);
              setEditingDescription(todo.description);
            }}
            style={{ marginLeft: 10 }}
            disabled={todo.completed}
          >
            Edit
          </button>

          <button
            onClick={() => handleDeleteTodo(todo.id)}
            style={{ marginLeft: 5 }}
          >
            Delete
          </button>
        </>
      )}
    </li>
  ))}
</ul>
</div>
);
}

export default App;