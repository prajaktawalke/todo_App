import React, { useState } from 'react';

const ToDoList = (props) => { 
    
    const [editedItem,seteditedItem] = useState(props.text.task);
    const [editMode , setEditMode] = useState(false); 

    const editedItemChanged = (e) =>{
		seteditedItem(e.target.value);
    };
    const saveEditedItem =() =>{
        props.editHandler(editedItem , props.id)
            setEditMode(false);
    };
    return  (
        <div className="list">
         
        {/* <li>{props.text.task}</li>  */}            
        {editMode ?
        <>
            <input type="text" 
                className = "editTask" 
                placeholder="edit Task"
                onChange={editedItemChanged}>
             </input>
            <button className="saveTask"
                 onClick={saveEditedItem} 
                //  disabled={editedItem.trim().length===0}
                 >
                    Save
              </button> 
        </>
        : <> 
                <button className="delete" onClick={()=>{
             props.onSelect(props.id)
         }}> delete </button> 
             <li>{props.text.task} </li>
        <button className="edit" onClick={() => setEditMode(true)}> edit </button>
         </> }
        </div>
    );
};
export default ToDoList;