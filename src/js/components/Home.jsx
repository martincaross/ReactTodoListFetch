import React, { useState, useEffect } from 'react';
import { Card, Button, Form, ListGroup } from 'react-bootstrap';

const Home = () => {

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const userName = "martincaross";

  useEffect(() => {
    fetch(`https://playground.4geeks.com/todo/users/${userName}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Usuario no encontrado');
        }
      })
      .then(data => setTasks(data.todos || []))
      .catch(error => {
        console.error('Error al cargar tareas:', error);
        createUser();
      });
  }, []);

  const handleChange = (e) => setNewTask(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newTask.trim() !== '') {
      addTask(newTask);
      setNewTask('');
    }
  };

  const addTask = (taskLabel) => {
    fetch(`https://playground.4geeks.com/todo/todos/${userName}`, {
      method: 'POST',
      headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: taskLabel, is_done: false })
    })
    .then(res => res.json())
    .then(data => setTasks([...tasks, data]))
    .catch(error => console.error('Error al agregar tarea:', error));
  };

  const deleteTask = (taskId) => {
    fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, { method: 'DELETE', headers: { 'accept': 'application/json' } })
    .then(res => {
      if (!res.ok) throw new Error('Error al eliminar tarea');
      setTasks(tasks.filter(task => task.id !== taskId));
    })
    .catch(error => console.error('Error al eliminar tarea:', error));
  };

  const updateTask = (taskId, updatedLabel, isDone) => {
    fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
      method: 'PUT',
      headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: updatedLabel, is_done: isDone })
    })
    .then(res => {
      if (!res.ok) throw new Error('Error al actualizar tarea');
      setTasks(tasks.map(task => task.id === taskId ? { ...task, label: updatedLabel, is_done: isDone } : task));
    })
    .catch(error => console.error('Error al actualizar tarea:', error));
  };

  const deleteAllTasks = () => {
    tasks.forEach((task) => {
      fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
        },
      })
        .then((respuesta) => {
          if (!respuesta.ok) {
            throw new Error('Error al eliminar tarea');
          }
        })
        .catch((error) => {
          console.error('Error al eliminar tarea:', error);
        });
    });

    createUser();
  };

  const createUser = () => {
    fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Error al crear el usuario");
        } else {
          alert("Usuario recreado exitosamente");
          fetch(`https://playground.4geeks.com/todo/users/${userName}`)
            .then(respuesta => {
              if (!respuesta.ok) return;
              return respuesta.json();
            })
            .then(data => {
              setTasks(data.todos || []);
            })
            .catch(error => {
              console.error('Error al cargar las tareas:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error al crear usuario:', error);
      });
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <Card style={{ width: '24rem', backgroundColor: '#d4edda', padding: '20px' }}>
        <Card.Body>
          <h2 className="text-center text-success mb-4">To-Do List</h2>

          <Form.Control
            type="text"
            placeholder="Añadir nueva tarea"
            value={newTask}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="mb-3"
          />

          <ListGroup>
            {tasks.length === 0 ? (
              <ListGroup.Item className="text-center">No hay tareas, añade una.</ListGroup.Item>
            ) : (
              tasks.map((task) => (
                <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                  <span style={{ textDecoration: task.is_done ? 'line-through' : 'none' }}>
                    {task.label}
                  </span>

                  <div>
                    <Button variant="danger" size="sm" onClick={() => deleteTask(task.id)}>X</Button>
                    <Button
                      variant={task.is_done ? "secondary" : "success"}
                      size="sm"
                      className="ms-2"
                      onClick={() => updateTask(task.id, task.label, !task.is_done)}
                    >
                      {task.is_done ? "Pendiente" : "Hecho"}
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card.Body>
        <div className="mt-4">
          <Button
            variant="danger"
            onClick={deleteAllTasks}
            style={{ width: "100%" }}
          >
            Eliminar todas las tareas
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Home;
