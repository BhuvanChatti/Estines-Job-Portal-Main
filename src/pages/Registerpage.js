import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"
import InputFrom from './../components/shared/inputForm';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from './../redux/features/alertSlice';
import Spinner from '../components/shared/Spinner';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './R-L.css';

const Register = () => {
    const [name, setName] = useState("");
    const [lastName, setlastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [location, setLoaction] = useState("");
    const [userT, setUserT] = useState("");
    const { loading } = useSelector(state => state.alerts)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!name || !lastName || !email || !password) {
                return toast.error('Please provide required feilds')
            }
            dispatch(showLoading())
            const { data } = await axios.post('https://estines-job-portal.onrender.com/api/v1/auth/register', { name, lastName, email, password, location, userT })
            dispatch(hideLoading())
            if (data.success) {
                toast.success('Registered Successfully')
                navigate('/login')
            }
        } catch (error) {
            dispatch(hideLoading())
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error('Invalid Form Details Please Try Again');
            }
        }
    }

    return (
        <>
            {loading ? (<Spinner />) :
                (
                    <div className='form-container'>
                        <form className="card p-2" onSubmit={handleSubmit}>
                            <img src="/assets/images/logo-black.png" alt="logo" height={400} width={400}></img>
                            <InputFrom
                                htmlFor="name"
                                labelText={"Name"}
                                type={"text"}
                                value={name}
                                handleChange={(e) => setName(e.target.value)}
                                name="name"
                            />
                            <InputFrom
                                htmlFor="lastName"
                                labelText={"Last Name"}
                                type={"text"}
                                value={lastName}
                                handleChange={(e) => setlastName(e.target.value)}
                                name="lastName"
                            />
                            <InputFrom
                                htmlFor="email"
                                labelText={"email"}
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
                            <InputFrom
                                htmlFor="location"
                                labelText={"location"}
                                type={"text"}
                                value={location}
                                handleChange={(e) => setLoaction(e.target.value)}
                                name="location"
                            />
                            <InputFrom
                                htmlFor="UserType"
                                labelText={"UserType"}
                                type={"text"}
                                value={userT}
                                handleChange={(e) => setUserT(e.target.value)}
                                name="UserType"
                            />
                            <div className="d-flex flex-col justify-space-between items-center">
                                <p>Already Registered? <Link to="/login" >Login</Link></p>
                                <button type="submit" className="btn btn-primary">Register</button>
                            </div>
                        </form>
                    </div>
                )}
        </>
    )
};
export default Register
