import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const Login = () => {

    const [email, setEmail] = useState("virat@gmail.com");
    const [password, setPassword] = useState("Virat@123");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, {
                emailId: email,
                password: password,
            }, { withCredentials: true });
            dispatch(addUser(res.data));
            navigate('/');
        } catch (err) {
            console.error("Login failed:", err);
        }
    }

    return (

        <div className="flex justify-center items-center h-screen -my-12">
            <div className="card bg-primary text-primary-content w-96">
                <div className="card-body justify-center">
                    <h2 className="card-title my-1">Login</h2>
                    <div>
                        <input type="text" placeholder="Enter email" className="input my-1" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <input type="text" placeholder="Enter password" className="input my-1" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="card-actions justify-center my-1">
                        <button className="btn" onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
