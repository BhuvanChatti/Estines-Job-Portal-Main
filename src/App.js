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
import { ContextA } from './components/shared/Context.js';
import My_Jobs from './pages/MyJobs.js';
import Applied from './pages/Applied.js';

function App() {
  return (
    <>
      <ToastContainer />
      <ContextA>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
          <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
          <Route path='/my-jobs' element={<PrivateRoute>
            <My_Jobs />
            {/* <Applied /> */}
            {/* {(userT=="Applicant")?
                <My_Jobs />:<Applied />
            } */}
          </PrivateRoute>} />
          <Route path='/all-jobs' element={<PrivateRoute><JobS /></PrivateRoute>} />
          <Route path='/dashboard' element={<PrivateRoute><DashBoard /></PrivateRoute>} />

          <Route path='*' element={<PrivateRoute><NotFound /></PrivateRoute>} />
        </Routes>
      </ContextA>
    </>
  );
}

export default App;
