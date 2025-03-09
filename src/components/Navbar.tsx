'use client';

import { motion } from 'framer-motion';
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

const navbarVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <motion.nav
      className="p-4 md:p-6 shadow-md bg-gray-900 text-white"
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </a>
        {session ? (
          <>
            <span className="mr-4">Welcome, {user.username || user.email}</span>
            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant="outline">
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant="outline">
              Login
            </Button>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;
