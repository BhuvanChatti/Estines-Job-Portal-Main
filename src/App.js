import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage.js';
import Login from './pages/Login';
import Register from './pages/Registerpage';
import DashBoard from './pages/DashBoard';
import NotFound from './pages/PgNotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/routes/PrivateRoute.js';
import PublicRoute from './components/routes/PublicRoute.js';
import My_Jobs from './pages/Jobs.js';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
        <Route path='/my-jobs' element={<PrivateRoute><My_Jobs /></PrivateRoute>} />
        <Route path='/dashboard' element={<PrivateRoute><DashBoard /></PrivateRoute>} />
        
        <Route path='*' element={<PrivateRoute><NotFound /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
