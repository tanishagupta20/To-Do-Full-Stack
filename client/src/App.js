import './App.css';
import Login from './pages/Login.js';
import SignUp from './pages/SignUp.js';
import ToDo from './pages/Todo.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path = '/' element = {<Login />}></Route>
        <Route exact path = '/signup' element = {<SignUp />}></Route>
        <Route exact path = '/todo' element = {<ToDo />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
