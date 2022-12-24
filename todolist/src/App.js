import './App.css';

import { useState, useEffect } from 'react'
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill, BsPencil, BsCheckCircleFill } from "react-icons/bs"

const API = "http://localhost:5000"

function App() {

  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState("")
  const [loadign, setLoading] = useState(false)
  const [edit, setEdit] = useState(false)
  const [newTitle, setnewTitle] = useState("")
  const [newTime, setNewTime] = useState("")


  //Load todos on page load
  useEffect(() => {
    const loadData = async (e) => {
      setLoading(true)
      const res = await fetch(API + '/todos')
        .then(res => res.json())
        .then(data => data)
        .catch(err => console.log(err))

      setLoading(false)
      setTodos(res)
    };
    loadData()
  }, [])

  const handleSubmit = async (e) => {
    if (edit) return
    e.preventDefault()

    const todo = {
      id: (Math.round(Math.random() * 10000)),
      title,
      time,
      done: false,
      edit: false,
    }
    //envio para api
    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      }
    })

    setTodos((prevState) => [...prevState, todo])

    setTitle("")
    setTime("")
  }

  const handleDelete = async (id) => {
    await fetch(API + "/todos/" + id, {
      method: "DELETE"
    })
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
  }

  const handleEdit = async (todo) => {
    todo.done = !todo.done

    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .catch(err => console.log(err))

    setTodos((prevState) => prevState.map((t) => t.id === data.id ? t = data : t))
  }

  const handleTask = async (todo) => {
    todo.edit = !todo.edit
    setEdit(todo.edit)
    setnewTitle(todo.title)
    setNewTime(todo.time)

    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .catch(err => console.log(err))

    setTodos((prevState) => prevState.map((t) => t.id === data.id ? t = data : t))
  }

  const EditTask = async (todo) => {
    todo.edit = !todo.edit
    todo.title = newTitle
    todo.time = newTime
    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .catch(err => console.log(err))

    setTodos((prevState) => prevState.map((t) => (
      (t.id === data.id) ? t = data : t)))
    setEdit(false)
    newTitle("")
    newTime("")
  }

  if (loadign) {
    return <p>Carregando...</p>
  }
  return (
    <div className="App">
      <div className="todo-header">
        <h1>Lista de Tarefas</h1>
      </div>
      <div className='form-todo'>
        <h2>Insira a sua próxima tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor='title'>O que você vai fazer?</label>
            <input type="text" name="title" placeholder="Título da tarefa" onChange={(e) => setTitle(e.target.value)} value={title || ""} required></input>
          </div>
          <div className='form-control'>
            <label htmlFor='time'>Duração:</label>
            <input type="text" name="time" placeholder="Tempo estimado(h)" onChange={(e) => setTime(e.target.value)} value={time || ""} required></input>
          </div>
          <input type="submit" value="Criar tarefa"></input>
        </form>
      </div>
      <div className='list-todo'>
        <h2>Lista de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas</p>}
        {todos.length > 0 && todos.map((todo) => (
          <div className='todo' key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>Tarefa: {!todo.edit ? todo.title : <input value={newTitle} onChange={(e) => setnewTitle(e.target.value)}></input>}</h3>
            <p>Duração: {!todo.edit ? todo.time : <input value={newTime} onChange={(e) => setNewTime(e.target.value)} ></input>}</p>
            <div className='actions'>
              <span onClick={() => handleEdit(todo)}>
                {!todo.edit && (!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />)}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
              {!todo.done && <BsPencil onClick={() => handleTask(todo)}></BsPencil>}
              {todo.edit && <BsCheckCircleFill onClick={() => EditTask(todo)}></BsCheckCircleFill>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
