import React, { useState, Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import logo from "../assets/logo.svg";
import { useCart } from "../context/cartContext";
import apiService from "../utils/api";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function PrimaryHeader() {
    const navigate = useNavigate();
    const { items } = useCart();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Get user info from the API wrapper instead of Redux
    useEffect(() => {
        const checkAuthStatus = () => {
            const isAuthenticated = apiService.auth.isAuthenticated();
            if (isAuthenticated) {
                const userInfo = apiService.auth.getUser();
                setUser(userInfo);
            }
            setIsLoading(false);
        };

        checkAuthStatus();
    }, []);

    const handleLogout = async () => {
        try {
            // Use the API wrapper for logout
            await apiService.auth.logout();
            setUser(null);
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <header className="py-4 shadow-sm bg-white">
            <div className="container flex items-center justify-between">
                <Link to="/">
                    <img src={logo} alt="Logo" className="w-32" />
                </Link>

                <div className="w-full max-w-xl relative flex">
                    <span className="absolute left-4 top-3 text-lg text-gray-400">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input type="text" name="search" id="search"
                        className="w-full border border-primary border-r-0 pl-12 py-3 pr-3 rounded-l-md focus:outline-none hidden md:flex"
                        placeholder="search" />
                    <button
                        className="bg-primary border border-primary text-white px-8 rounded-r-md hover:bg-transparent hover:text-primary transition hidden md:flex">Search</button>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Cart Link - Now using Link from react-router-dom */}
                    <Link to="/cart" className="text-center text-gray-700 hover:text-primary transition relative">
                        <div className="text-2xl">
                            <i className="fa-solid fa-bag-shopping" />
                        </div>
                        <div className="text-xs leading-3">Cart</div>
                        {items.length > 0 && (
                            <div className="absolute -right-3 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white text-xs">
                                {items.length}
                            </div>
                        )}
                    </Link>

                    {/* User Menu */}
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className="">
                                <div className="text-center text-gray-700 hover:text-primary transition relative">
                                    <div className="text-2xl">
                                        <i className="fa-regular fa-user"></i>
                                    </div>
                                    <div className="text-xs leading-3">Account</div>
                                </div>
                            </Menu.Button>
                        </div>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    {!isLoading && user ? (
                                        <>
                                            <div className="px-4 py-2 text-sm text-gray-700">
                                                <p className="font-medium text-center">{user.name}</p>
                                                <p className="text-gray-500 text-center">{user.email}</p>
                                            </div>
                                            <hr className="my-1" />
                                            {user.role === "admin" && (
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            to="/admin/dashboard"
                                                            className={classNames(
                                                                active
                                                                    ? "bg-gray-100 text-gray-900"
                                                                    : "text-gray-700",
                                                                "block px-4 py-2 text-sm text-center"
                                                            )}
                                                        >
                                                            Admin Dashboard
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            )}
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/my-orders"
                                                        className={classNames(
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700",
                                                            "block px-4 py-2 text-sm text-center"
                                                        )}
                                                    >
                                                        My Orders
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleLogout}
                                                        className={classNames(
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700",
                                                            "block w-full px-4 py-2 text-sm text-center"
                                                        )}
                                                    >
                                                        Sign out
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </>
                                    ) : (
                                        <>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/login"
                                                        className={classNames(
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700",
                                                            "block px-4 py-2 text-sm text-center"
                                                        )}
                                                    >
                                                        Login
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/register"
                                                        className={classNames(
                                                            active
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-700",
                                                            "block px-4 py-2 text-sm text-center"
                                                        )}
                                                    >
                                                        Register
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </>
                                    )}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </header>
    );
}

export default PrimaryHeader;