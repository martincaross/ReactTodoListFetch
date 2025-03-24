import React, { useState } from 'react';
// index.css'
import "../../styles/index.css";

//include images into your bundle

//create your first component
const Home = () => {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState('');
  
	const handleChange = (e) => {
	  setNewTask(e.target.value);
	};
  
	const handleKeyDown = (e) => {
	  if (e.key === 'Enter' && newTask.trim() !== '') {
		setTasks([...tasks, newTask]);
		setNewTask('');
	  }
	};
  
	const deleteTask = (index) => {
	  const updatedTasks = tasks.filter((_, i) => i !== index);
	  setTasks(updatedTasks);
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
				tasks.map((task, index) => (
					<li key={index}>
					{task}
					<span className="delete" onClick={() => deleteTask(index)}>
						X
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