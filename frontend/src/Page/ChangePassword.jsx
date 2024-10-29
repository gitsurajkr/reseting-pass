import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IoIosCheckboxOutline } from "react-icons/io";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
    const { userId } = useParams(); // Get user ID from URL parameters
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!newPassword || newPassword.length < 6) {
            setError('New password must be at least 6 characters long');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post(
                `http://localhost:3737/api/v1/user/password-reset/update/${userId}`,
                { newPassword },
                { withCredentials: true }
            );
            setNewPassword('');
            setConfirmPassword('');
            alert('Password updated successfully!');
            navigate('/login');

        } catch (error) {
            setError('Password update failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <Card className="border-none shadow-lg shadow-zinc-500/10 bg-zinc-800 max-w-md ">
                <CardHeader className="mb-4">
                    <CardTitle className="text-white text-2xl">Change Password</CardTitle>
                    <CardDescription className="text-zinc-300 text-md">
                        Update your password to keep your account secure.
                    </CardDescription>
                </CardHeader>
                
                <form onSubmit={handlePasswordChange}>
                    <CardContent className="space-y-5">
                        <div className="relative">
                            <Label className="text-white text-md" htmlFor="new_password">New Password</Label>
                            <Input
                                className="text-white bg-zinc-700 mt-2 text-lg h-10"
                                type={showPassword ? "text" : "password"}
                                id="new_password"
                                name="new_password"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Label className="text-white text-md" htmlFor="confirm_password">Confirm Password</Label>
                            <Input
                                className="text-white bg-zinc-700 mt-2 text-lg h-10"
                                type={showPassword ? "text" : "password"}
                                id="confirm_password"
                                name="confirm_password"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center space-x-1 ">
                            <button onClick={togglePasswordVisibility} className="focus:outline-none">
                                {showPassword ? (
                                    <IoIosCheckboxOutline className="text-white text-2xl" />
                                ) : (
                                    <MdOutlineCheckBoxOutlineBlank className="text-white text-2xl" />
                                )}
                            </button>
                            <Label className="text-white text-lg cursor-pointer" onClick={togglePasswordVisibility}>Show Password</Label>
                        </div>
                        
                        {error && <p className="text-red-500">{error}</p>} {/* Display error messages */}

                        <Button type="submit" variant="primary" className="w-full mt-4 p-4 text-xl font-bold bg-gradient-to-r from-blue-500 to-slate-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-slate-800 transition duration-300 text-white">
                            Change Password
                        </Button>
                    </CardContent>
                </form>
                
            </Card>
        </div>
    );
};

export default ChangePassword;
