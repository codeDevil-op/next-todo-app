'use client'
import Image from "next/image";
import { IoMdTrash } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import './todo.css'
import { useEffect, useState } from "react";

type Todo = {
  id:number,
  title: string;
  message: string;
  checked: boolean;
};
export default function Home() {
  const [todoData,setTodoData] = useState<Omit<Todo,'id'>>({
    title:"",
    message:"",
    checked:false,
  })
  const [task,setTask] = useState<Todo[]>([])
  const [taskId,setTaskId] = useState<number>(0)
  const [filterTask, setFilterTask] = useState<string>('all');
  const [searchedTask,setSearchedTask] = useState<string>('')
  const [isEditing,setIsEditing] = useState<boolean>(false)
  useEffect(() => {
    const storedTask = localStorage.getItem('tasks')
    if(storedTask){
      setTask(JSON.parse(storedTask))
    }
  }, [])
  useEffect(() => {
    localStorage.setItem('tasks',JSON.stringify(task))
    
  }, [task])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
    const {name,value} = e.target
    setTodoData({
      ...todoData,
      [name]:value,

    })
  }
  const addTodo = ()=>{
    if(todoData.title==='' || todoData.message===''){
      alert('Please enter title or message')
    }else if(todoData.title==='' || todoData.message==='' || isEditing){
      setTask((prevTask)=>(
        prevTask.map((sTask)=>sTask.id===taskId?{...sTask,title:todoData.title,message:todoData.message,checked:false}:sTask)
      ))
      setIsEditing(false)
      setTodoData({...todoData,title:'',message:''})
    }
    else{
      const newTodo = {...todoData,id:Date.now()}
      setTask([...task,newTodo])
      setTodoData({...todoData,title:'',message:''})
    }
  }
  const toggleChecked = (id:number)=>{
    setTask((prevTask)=>(
      prevTask.map((task)=>task.id===id ?{...task,checked:!task.checked}:task)
    ))
  }
  const deleteTask = (id:number)=>{
    setTask((prevTask)=>(
      prevTask.filter((task)=>task.id!==id)
    ))
  }
  const editTask =(id:number)=>{
    const editThisTask = task.find((sTask)=>sTask.id===id)
    if(editThisTask){
      setTaskId(id)
     setIsEditing(true)
     setTodoData({title:editThisTask.title,message:editThisTask.message,checked:editThisTask.checked})
    }   
}
const filteredTasks = task.filter((todo) => {
  if (filterTask === 'completed') return todo.checked;
  if (filterTask === 'incompleted') return !todo.checked;
  return true; // 'all' option
});

const searchedTasks = filteredTasks.filter((todo) => {
  return (
    todo.title.toLowerCase().includes(searchedTask.toLowerCase()) 
    // || todo.message.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

  return (
    <div className=" flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)] ">
      <div className="mt-10 w-full max-w-sm">
      <h1 className="text-center text-4xl text-[#5E6072] font-extrabold">Todo List</h1>
      <div className="bg-[#EBECF4] p-4 flex flex-col space-y-4 mt-4">
        <input 
        className="p-3" 
        name="title"
        type="text" 
        value={todoData.title}
        placeholder="Type Title..."
        onChange={handleChange}
        />
        <input 
        className="p-3" 
        name="message"
        type="text" 
        value={todoData.message}
        placeholder="Type Message..."
        onChange={handleChange}
        />
        <button 
        onClick={addTodo}
        className="bg-[#616FEE] p-2 text-white rounded-md"
        >{isEditing?'Edit Task':'Add Task'}</button>
      </div>
      </div>
      <div className=" mt-4 w-full max-w-[700px]">
        
        {task.length===0 ?
        <>
        <h1 className="text-[#5E6072]">
          No Task added yet...
        </h1>
        </>:
        <>
        <div className="bg-[#ECEDF6] p-4 space-y-3">
          {/* all todo goes here  */}
          <div className="flex justify-between">
            <input 
            className="p-3"
            type="text" 
            value={searchedTask}
            onChange={(e)=>setSearchedTask(e.target.value)}
            placeholder="search here.."
            />
          <select
          value={filterTask}
          onChange={(e)=>setFilterTask(e.target.value)}
           className="p-2 bg-[#CCCEDF] rounded-md text-[#5A5A5A]"
           >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incompleted">Incompleted</option>
          </select>

          </div>
          {searchedTasks.map((sTask)=>{
            const {id,title,message,checked} = sTask
            return(
              <div key={id} className="bg-white rounded-md p-4 flex justify-between">

            <div className="flex space-x-4 justify-center items-center">
            <input 
            type="checkbox"
            name="checked"
            // checked = {true}
            onChange={()=>toggleChecked(id)}
             className="w-6 h-6 appearance-none border-2 border-gray-300 rounded-md checked:bg-[#616FEE] checked:border-transparent focus:outline-none focus:ring-2 focus:ring-[#616FEE] cursor-pointer relative"
             />
            <div>
            <p className={checked?'text-lg line-through':'text-lg'}>{title}</p>
            <p className={checked?'text-sm line-through':'text-sm'}>{message}</p>
            </div>
            </div>

            <div className="flex space-x-3">
            <div 
            onClick={()=>deleteTask(id)}
            className="bg-[#ECEDF6] h-8 flex justify-center items-center p-1 cursor-pointer"><IoMdTrash  size={20} color="#5A5A5A"/>
            </div>
            <div 
            onClick={()=>editTask(id)}
            className="bg-[#ECEDF6] h-8 flex justify-center items-center p-1 cursor-pointer">
              <MdModeEdit size={20} color="#5A5A5A"/>
            </div>
            </div>
          </div>
            )
          })}

        </div> 
        </>}
      </div>
    </div>
  );
}
