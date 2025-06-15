import './App.css'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './website/homepage';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom'; 

function App() {

  return (
    <Router>
      <Routes> {/* Use <Routes> only once */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element = {<RegisterPage />} /> 
        <Route path="/login" element={<LoginPage />} /> 
      </Routes>
    </Router>
    
  )
}

export default App
