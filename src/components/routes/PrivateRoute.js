import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import axios from "axios";
import { setUser } from '../../redux/features/auth/authSlice';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { userContext } from '../shared/Context.js';
const PrivateRoute = ({ children }) => {
    const { user } = useSelector(state => state.auth)
    const { setT } = useContext(userContext)
    const dispatch = useDispatch()
    const getUser = async (req, res, next) => {
        try {
            dispatch(showLoading())
            const { data } = await axios.post('https://estines-job-portal.onrender.com/api/v1/user/getUser', { token: localStorage.getItem('token') }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            dispatch(hideLoading())
            if (data.success) {
                console.log(data.data.type);
                setT(data.data.type);
                dispatch(setUser(data.data));
            } else {
                localStorage.clear();
                <Navigate to="/login" />
            }
        } catch (error) {
            localStorage.clear();
            dispatch(hideLoading());
        }
    }
    useEffect(() => {
        if (!user) {
            getUser();
        }
    });
    if (localStorage.getItem('token')) {
        return children;
    } else {
        return <Navigate to="/login" />;
    }
}

export default PrivateRoute