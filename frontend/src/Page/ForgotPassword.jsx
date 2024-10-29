import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3737/api/v1/user/password-reset/request', {
                email: e.target.email.value
            });

            if (response.status === 200) {
                window.alert('Password reset request sent successfully');
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error("Password reset request error:", error);
            window.alert('Password reset request failed. Please check your email address.');
        }
    }

    useEffect(() => {
        if (isSubmitted) {
            navigate('/change-password');
        }
    }, [isSubmitted, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black p-4">
            <Card className="border-none shadow-lg shadow-zinc-500/10 bg-zinc-800 max-w-md  p-6 rounded-lg ">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-white text-3xl font-bold">
                        Forgot Password
                    </CardTitle>
                    <CardDescription className="text-zinc-300 text-lg">
                        Enter your email to reset your password
                    </CardDescription>
                </CardHeader>
                <form onSubmit={submitHandler}>
                    <CardContent className="space-y-2">
                        <Label className="text-white text-xl">Email</Label>
                        <Input 
                            className="w-full  bg-zinc-700 text-white text-xl h-15 rounded-md placeholder-gray-400"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                        />
                        <div className="pt-4">
                        <Button className="space-y-4 w-full text-2xl text-white py-6 rounded-md bg-gradient-to-r from-blue-500 to-slate-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-slate-800 transition duration-300 transition duration-200">
                            Send Reset Link
                        </Button>
                        </div>
                        {/* <Link to="/change-password" className="flex items-center space-x-2 mt-4 text-blue-300 hover:text-white">
                            <FaArrowLeftLong className="text-xl" />
                            <span className="text-lg">Back to Login</span>
                        </Link> */}
                       
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}

export default ForgotPassword;
