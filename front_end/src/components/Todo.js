import React, { useState , useEffect } from "react";
import "./../styles/App.css";
import ToDoList from './../components/ToDoList';

export default function Todo(props) 
{
	const [Items , setItems] = useState([]);
	const [inputList,setInputList] = useState("");

	 
	const listOfItems = () => {
		fetch('http://localhost:9999/todo',{
				method : 'POST',
				body: JSON.stringify({task:inputList}),
				headers : {
					'Content-Type' : 'application/json'
                },
                credentials: "include"
		})
		.then(r => r.json())
		.then((resp) => {
			console.log('Got data from backend', resp);
			setItems((oldItems) =>{
				return [...oldItems,inputList];
			});
			setInputList("");
			// Items.push(inputList);
			// setItems([...Items]);
			// setInputList("");
		});
	};
	const itemEvent = (e) =>{
		setInputList(e.target.value);
	}; 
	const deleteItems = (id) =>{ 
		//console.log("deleted");
		const idToDelete = Items[id]._id;
		fetch(`http://localhost:9999/todos/${idToDelete}`, {
            method : 'DELETE', credentials: "include"
		}).then((r) => {
			console.log("deleted"); 
			// setItems((oldItems) =>{
			// 	return oldItems.filter((arrElem,index) =>{
			// 		return index !== id;
			// 	})
			// })
			Items.splice(id,1);
			setItems([...Items]);
		})
	}
	const editHandler = (editedValue , id) =>{
		const idToEdit = Items[id]._id;
		fetch(`http://localhost:9999/todos/${idToEdit}`, {
				method : "PUT",
				body: JSON.stringify({task: editedValue}),
				headers : {
					'Content-Type' : 'application/json'
                },
                credentials: "include"
		})
		.then((r) => r.json())
		.then((resp) => {
			console.log("edited",resp); 
			 Items[id] = resp;
			 setItems([...Items]);
			// Items[id] = resp;
			// setItems([...Items]);
		});
	};

	useEffect(() => {
		fetch('http://localhost:9999/todos', {credentials: "include"})
		 .then((r) => r.json())
		.then(arr => {
			const sortedArr = arr.sort((a,b) => {
                const aDateNumeric = new Date(a.creationTime).valueOf();
                const bDateNumeric = new Date(b.creationTime).valueOf();
                return aDateNumeric - bDateNumeric; 
            });
			//const taskarr  = sortedArr.map(item => item.task);
			setItems(sortedArr);
		});
	}, []);

	return (
		<>
	<div id="main" className="center_div">
        <div className = "user">
            <div>username : <b>{props.username}</b> </div>
            <button onClick={props.logoutHandler}> Log out</button>
        </div>
		<br />
		<h1> ToDo List</h1>
		<input id="task"
		 type="text"
		  placeholder='Add Items' 
			value={inputList}
			onChange={itemEvent}/>

		<button id="btn" onClick={listOfItems} disabled={inputList.trim().length===0}> Add </button>
		<ol>
			{/* <li> {inputList} </li> */}
		{	Items.map((itemval,index) => {
				return <ToDoList 
                key={itemval._id}
				id = {index} 
				text ={itemval}
					onSelect={deleteItems}   //for delete
					editHandler={editHandler}
				/>
			})}
		</ol>
		</div>
		</>
	);
}



