import { UserProvider } from './contexts/UserContext';
import NavBar from './components/navBar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Signup } from './pages/Signup';
import { Signin } from './pages/Signin';
import { HomePage } from './pages/HomePage';
import { Courses } from './pages/Courses';
import { CourseProvider } from './contexts/CoursesContext';
import { MyCourses } from './pages/MyCourses';
import EditPage from './pages/EditPage';
import './style/style.css'
function App() {
  return (
    <CourseProvider>
    <UserProvider>
        
        <Router>
          <NavBar />
          <a className='navBtn' href='#sideBar'>=</a>
          <Routes>
              <Route path='/signup' element={<Signup />} />
              <Route path='/login' element={<Signin />} />
              <Route path='/' element={<HomePage />} />
              <Route path='/courses' element={<Courses />} />
              <Route path='/my-courses' element={<MyCourses />} />
              <Route path='/update-course' element={<EditPage />} />
          </Routes>
        </Router>
        
    </UserProvider>
    </CourseProvider>
  );
}

export default App;