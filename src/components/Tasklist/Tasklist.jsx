import React, { useState, useEffect } from "react";
import TaskItem from "../Taskitem/Taskitem";
import Modalform from "../Modalform/Modalform"; 
import "./Tasklist.css";
import ReactModal from "react-modal";

const API_BASE_URL = "https://xorotaskappbackend.onrender.com/api";

ReactModal.setAppElement("#root");

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) throw new Error("Failed to fetch tasks.");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleSaveTask = async (task) => {
    try {
      const method = editTask ? "PUT" : "POST";
      const url = editTask ? `${API_BASE_URL}/tasks/${editTask._id}` : `${API_BASE_URL}/tasks`;
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      setShowForm(false);
      setEditTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`${API_BASE_URL}/tasks/${taskId}`, { method: "DELETE" });
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const openForm = (task = null) => {
    setEditTask(task);
    setShowForm(true);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div className="Navbar">
        <h2 style={{color:"white"}}>Task Management</h2>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => openForm()}>{showForm ? "Close Form" : "Create Task"}</button>
      </div>

      <ReactModal
        isOpen={showForm}
        onRequestClose={() => setShowForm(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <Modalform
          onSaveTask={handleSaveTask}
          onCancel={() => setShowForm(false)}
          task={editTask} 
        />
      </ReactModal>

      <div className="progressTask">
        <h3>In Progress Tasks</h3>
        <table>
          <thead>
            <tr><th>Task</th><th>Description</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredTasks.filter(task => task.status !== "Completed").map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onUpdateStatus={handleUpdateStatus}
                onEdit={() => openForm(task)}
                onDelete={handleDeleteTask}
              />
            ))}
          </tbody>
        </table>
      </div>

    
      <div className="completedTask">
        <h3>Completed Tasks</h3>
        <table>
          <thead>
            <tr><th>Task</th><th>Description</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredTasks.filter(task => task.status === "Completed").map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onEdit={() => openForm(task)}
                onDelete={handleDeleteTask}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;

