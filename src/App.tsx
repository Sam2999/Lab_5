import './App.css';
import { useState, useEffect } from "react";


interface Todo {
  description: string;
}

function App() {
  const [todoDescription, setTodoDescription] = useState('');
  const [todoList, setTodoList] = useState<Todo[]>([]);

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
  }); // Cerrar el segundo useEffect

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoDescription(e.target.value);
  };

  const handleClick = () => {
    if (todoDescription.trim() === '') return; // Opcional: prevenir elementos vacíos

    const tempTodoList = [...todoList];
    const newTodo = {
      description: todoDescription,
    };

    tempTodoList.unshift(newTodo); // Agrega al principio
    setTodoList(tempTodoList);
    setTodoDescription(''); // Limpiar input
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

      <div>TODOs Here:</div>
      <ul>
        {todoList.map((todo, index) => (
          <li key={index}>
            <input type="checkbox" />
            {todo.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;