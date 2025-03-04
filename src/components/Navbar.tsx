"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
    const { data: session } = useSession();
    const user = session?.user as User;
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <a href="#" className="text-white text-lg font-bold">Mystery Message</a>
                {session ? (
                    <div className="flex items-center space-x-4">
                        <span className="text-white">Welcome, {user.username || user.email}</span>
                        <Button onClick={() => signOut()} className="bg-red-500 text-white">Logout</Button>
                    </div>
                ) : (
                    <Link href="/signin">
                        <Button className="bg-blue-500 text-white">Login</Button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
