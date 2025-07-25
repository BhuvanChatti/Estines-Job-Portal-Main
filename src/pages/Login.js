import React, { useState } from 'react';
import InputFrom from '../components/shared/inputForm';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import Spinner from './../components/shared/Spinner';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './R-L.css';
import { useContext } from 'react';
import { userContext } from '../components/shared/Context.js';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loading } = useSelector(state => state.alerts);

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(showLoading())
            const { data } = await axios.post('https://estines-job-portal.onrender.com/api/v1/auth/login', { email, password })
            dispatch(hideLoading())
            if (data.success) {
                dispatch(hideLoading())
                localStorage.setItem('token', data.token)
                toast.success("Logged in successfully")
                navigate('/dashboard')
            }
        } catch (error) {
            dispatch(hideLoading())
            console.log("Login Error:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error("Invalid Credential Details. Please Try Again");
            }
        }
    }
    return (
        <>
            {loading ? (<Spinner />) : (
                <div className='form-container'>
                    <form className="card p-2" onSubmit={handleSubmit}>
                        <img src="/assets/images/logo-black.png" alt="logo" height={400} width={400}></img>
                        <InputFrom
                            htmlFor="email"
                            labelText={"Email"}
                            type={"email"}
                            value={email}
                            handleChange={(e) => setEmail(e.target.value)}
                            name="email"
                        />
                        <InputFrom
                            htmlFor="password"
                            labelText={"Password"}
                            type={"password"}
                            value={password}
                            handleChange={(e) => setPassword(e.target.value)}
                            name="password"
                        />
                        <div className="d-flex flex-col justify-space-between items-center">
                            <p>Not Registered? <Link to="/register" >Register Here</Link></p>
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
};
export default Login
