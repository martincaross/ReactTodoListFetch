import React, { useState, useEffect } from 'react';
import "../../styles/index.css";

// Crear el componente Home
const Home = () => {
  const API_URL = "https://playground.4geeks.com/todo/users/martincaross"; // URL del usuario
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  
  // Cargar tareas al montar el componente
  useEffect(() => {
    fetch(API_URL)
      .then(respuesta => {
        if (!respuesta.ok) return;
        return respuesta.json();
      })
      .then(data => {
        setTasks(data.todos || []); // Obtener las tareas del usuario
      })
      .catch(error => {
        console.error('Error al cargar las tareas:', error);
      });
  }, []);
  
  // Función para manejar el cambio en el campo de entrada de nueva tarea
  const handleChange = (e) => {
    setNewTask(e.target.value);
  };
  
  // Función para manejar el evento de presionar Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newTask.trim() !== '') {
      addTask(newTask); // Llamar a la función para agregar tarea
      setNewTask(''); // Limpiar el campo de entrada
    }
  };

  // Función para agregar nueva tarea (POST)
  const addTask = (taskLabel) => {
    fetch(`https://playground.4geeks.com/todo/todos/martincaross`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        label: taskLabel,
        is_done: false
      })
    })
    .then(respuesta => respuesta.json())
    .then(data => {
      setTasks([...tasks, data]); // Añadir la tarea a la lista
    })
    .catch(error => {
      console.error('Error al agregar tarea:', error);
    });
  };

  // Función para eliminar una tarea (DELETE)
  const deleteTask = (taskId) => {
    if (!taskId) {
      console.error("ID de tarea no válido");
      return;
    }

    fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
      }
    })
    .then(respuesta => {
      if (!respuesta.ok) {
        throw new Error('Error al eliminar tarea');
      }
      // Si la eliminación es exitosa, actualizar el estado local
      setTasks(tasks.filter(task => task.id !== taskId));
    })
    .catch(error => {
      console.error('Error al eliminar tarea:', error);
    });
  };

  // Función para actualizar una tarea (PUT)
  const updateTask = (taskId, updatedLabel, isDone) => {
    if (!taskId) {
      console.error("ID de tarea no válido");
      return;
    }

    fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        label: updatedLabel,
        is_done: isDone,
      })
    })
    .then(respuesta => {
      if (!respuesta.ok) {
        throw new Error('Error al actualizar tarea');
      }
      // Si la actualización es exitosa, actualizar el estado local
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, label: updatedLabel, is_done: isDone } : task
      ));
    })
    .catch(error => {
      console.error('Error al actualizar tarea:', error);
    });
  };

  return (
    <>
      <h1>To-Do List</h1>
      <div className="container">
        <input
          type="text"
          placeholder="Añadir nueva tarea"
          value={newTask}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <ul>
          {tasks.length === 0 ? (
            <li className="empty">No hay tareas, añadir tareas</li>
          ) : (
            tasks.map((task) => (
              <li key={task.id}>
                <input
                  type="text"
                  value={task.label}
                  onChange={(e) => {
                    const updatedLabel = e.target.value;
                    updateTask(task.id, updatedLabel, task.is_done);
                  }}
                />
                <button onClick={() => deleteTask(task.id)}>Eliminar</button>
                <span
                  onClick={() => updateTask(task.id, task.label, !task.is_done)}
                  style={{ textDecoration: task.is_done ? 'line-through' : 'none' }}
                >
                  {task.is_done ? 'Marcar como pendiente' : 'Marcar como hecho'}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default Home;
