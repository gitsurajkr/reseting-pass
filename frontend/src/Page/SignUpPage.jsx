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

const SignUpPage = () => {
    const navigate = useNavigate();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const firstNameHandler = (e) => { setFirstname(e.target.value); }
    const lastNameHandler = (e) => { setLastname(e.target.value); }
    const usernameHandler = (e) => { setUsername(e.target.value); }
    const passwordHandler = (e) => { setPassword(e.target.value); }
    const emailHandler = (e) => { setEmail(e.target.value); }
    

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3737/api/v1/user/signup', {
                firstname,
                lastname,
                username,
                password,
                email,
                
            });

            // Debug log
            console.log('Sign-up payload:', {
                firstname,
                lastname,
                email,
                username,
                password,
                
            });

            const { token } = response.data;
            Cookies.set("token", token, { expires: 7 });
            window.alert("Sign Up Successful");
            navigate("/login");
        } catch (error) {
            console.log(error.response);
            window.alert("Sign Up Failed");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <Card className="border-none shadow-lg shadow-zinc-500/10 bg-zinc-800 max-w-md">
                <CardHeader className="flex justify-center items-center space-y-3">
                    <FaUserCircle className="text-white text-7xl" />
                    <CardTitle className="text-white text-4xl font-bold">Sign Up</CardTitle>
                    <CardDescription className="text-xl text-white">Create a new account to get started</CardDescription>
                </CardHeader>
                <form onSubmit={submitHandler}>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstname" className="font-md text-lg text-white">First Name</Label>
                                <Input onChange={firstNameHandler} type="text" id="firstname" name="firstname" required className="h-15 text-xl font-md bg-zinc-400" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastname" className="font-md text-lg text-white">Last Name</Label>
                                <Input onChange={lastNameHandler} className="text-xl h-15 font-md bg-zinc-400" type="text" id="lastname" name="lastname" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-white text-lg font-md">Username</Label>
                            <Input onChange={usernameHandler} className="text-xl h-15 font-md bg-zinc-400" type="text" id="username" name="username" required />
                        </div>
                        <div className="relative space-y-2">
                            <Label htmlFor="password" className="text-white text-lg font-md">Password</Label>
                            <Input onChange={passwordHandler} className="h-15 text-xl font-md bg-zinc-400" type={showPassword ? "text" : "password"} id="password" name="password" required />
                            <button type="button" onClick={togglePassword} className="absolute inset-y-0 right-0 flex items-center pr-4 pt-7">
                                {showPassword ? (
                                    <IoEyeOffSharp className="text-black text-xl" />
                                ) : (
                                    <IoEye className="text-black text-xl" />
                                )}
                            </button>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white text-lg font-md">Email</Label>
                            <Input onChange={emailHandler} className="h-15 text-xl font-md bg-zinc-400" type="email" id="email" name="email" required />
                        </div>
                        
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-slate-700 w-full text-2xl font-bold pb-3 h-15 hover:bg-gradient-to-r hover:from-blue-600 hover:to-slate-800 transition duration-300"
                        >
                            Sign Up
                        </Button>
                        <p className="text-lg text-white text-center text-gray-600">
                            Already have an account?{' '}
                            <a href="/login" className="text-blue-400 hover:text-blue-200">Log In</a>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default SignUpPage;