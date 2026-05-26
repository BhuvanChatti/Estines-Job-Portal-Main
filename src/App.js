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
import JobS from './pages/Jobs.js';
import UpdateProfile from './pages/UpdateProfile.js';
import PostJob from './pages/PostJob.js';
import ResumeEdit from './pages/ResumeEdit.js';
import { ContextA } from './components/shared/Context.js';

function App() {
  return (
    <>
      <ToastContainer />
      <ContextA>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
          <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
          <Route path='/all-jobs' element={<PrivateRoute><JobS /></PrivateRoute>} />
          <Route path='/dashboard' element={<PrivateRoute><DashBoard /></PrivateRoute>} />
          <Route path='/user-profile' element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
          <Route path='/post-job' element={<PrivateRoute><PostJob /></PrivateRoute>} />
          <Route path='/resume' element={<PrivateRoute><ResumeEdit /></PrivateRoute>} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </ContextA>
    </>
  );
}

export default App;
