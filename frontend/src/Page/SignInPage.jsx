import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IoEye, IoEyeOffSharp } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
    const [username, setUsername] = useState("");   
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const usernameHandler = (e) => { setUsername(e.target.value); }
    const passwordHandler = (e) => { setPassword(e.target.value); }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3737/api/v1/user/signin', {
                username,
                password
            });

            if (response.status === 200) {
                Cookies.set('token', response.data.token);
                window.alert('Login successful');
                navigate('/');
            }
        } catch (error) {
            console.error("Login error:", error);
            window.alert('Login failed. Please check your credentials.');
        }
    }
    const navigateToForgotPassword = () => {
        navigate('/forget-password');
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <Card className="border-none shadow-lg shadow-zinc-500/10 bg-zinc-800 max-w-md ">
                <CardHeader className="flex justify-center items-center space-y-3">
                    <FaUserCircle className="text-white text-6xl" />
                    <CardTitle className="text-white text-3xl font-bold">Sign In</CardTitle>
                    <CardDescription className="text-md text-white">Sign in to your account to get started</CardDescription>
                </CardHeader>
                <form onSubmit={submitHandler}>
                    <CardContent className="space-y-2">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-white text-lg font-md">Username</Label>
                            <Input onChange={usernameHandler} className="text-xl h-9 font-md bg-zinc-400" type="text" id="username" name="username" required />
                        </div>
                        <div className="relative space-y-1">
                            <Label htmlFor="password" className="text-white text-lg font-md">Password</Label>
                            <Input onChange={passwordHandler} className="text-xl h-9 font-md bg-zinc-400" type={showPassword ? "text" : "password"} id="password" name="password" required />
                            <button type="button" onClick={togglePassword} className="absolute inset-y-0 right-0 flex items-center pr-4 pt-7">
                                {showPassword ? (
                                    <IoEyeOffSharp className="text-black text-xl" />
                                ) : (
                                    <IoEye className="text-black text-xl" />
                                )}
                            </button>
                        </div>
                        <div>
                            <a onClick={navigateToForgotPassword}  className="text-blue-400 hover:text-blue-200 cursor-pointer ">Forgot password?</a>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button type="submit" className="bg-gradient-to-r from-blue-500 to-slate-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-slate-800 transition duration-300 w-full text-2xl font-bold pb-3 ">
                            Sign in
                        </Button>
                        <p className="text-lg text-white text-center text-gray-600">
                            Don't have an account?{' '}
                            <a href="/SignUp" className="text-blue-400 hover:text-blue-200">Sign up</a>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default SignInPage;
