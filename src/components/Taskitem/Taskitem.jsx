import React from "react";

const TaskItem = ({ task, onUpdateStatus, onDelete, onEdit }) => (
    <tr key={task._id}>

        <td>
            <strong>{task.title}</strong>
        </td>
        <td>
            <small>{task.description}</small>
        </td>
        <td>{task.status}</td>
        <td style={{display:"flex", gap:"20px"}}>
            
            {task.status !== "Completed" && (
                <button onClick={() => onUpdateStatus(task._id, "Completed")}
                 style={{width:'100px',
                    height:'40px',
                     background:'Yellow',
                     textAlign:'center',
                     border:'none',borderRadius:'5px',
                    cursor:"pointer"}}>Mark as Completed</button>
            )}
            
                <button onClick={onEdit}
                style={{width:'100px',
                    height:'40px',
                     background:'lightGreen',
                     textAlign:'center',
                     border:'none',borderRadius:'5px',
                     cursor:"pointer"}}>Edit</button>

                <button onClick={() => onDelete(task._id)}
                    style={{width:'100px',
                        height:'40px',
                         background:'Red',
                         textAlign:'center',
                         border:'none',borderRadius:'5px',
                         cursor:"pointer"}}>Delete</button>
           
        </td>
    </tr>
);

export default TaskItem;
