'use client';

import { API_BASE_URL } from '@/constants/const';
import Link from 'next/link';
import { useState, FormEvent, ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import only the base URL from constants

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
}

interface ApiErrorResponse {
  status_code: number;
  details?: {
    password?: string[];
    address?: string[];
    name?: string[];
    email?: string[];
    username?: string[];
  };
  message: string;
  status: string;
}

interface ApiSuccessResponse {
  status: string;
  message: string;
  details: {
    address: string;
    role: string;
    name: string;
    email: string;
    username: string;
  };
  status_code: number;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const newErrors: FormErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.address) newErrors.address = 'Address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          address: formData.address
        })
      });

      const data: ApiErrorResponse | ApiSuccessResponse = await response.json();

      if (!response.ok) {
        const errorData = data as ApiErrorResponse;
        if (errorData.details) {
          // Map API errors to form fields
          const apiErrors: FormErrors = {};
          if (errorData.details.name) apiErrors.firstName = errorData.details.name.join(' ');
          if (errorData.details.username) apiErrors.username = errorData.details.username.join(' ');
          if (errorData.details.email) apiErrors.email = errorData.details.email.join(' ');
          if (errorData.details.password) apiErrors.password = errorData.details.password.join(' ');
          if (errorData.details.address) apiErrors.address = errorData.details.address.join(' ');
          
          setErrors(apiErrors);
        }
        toast.error(errorData.message || 'Registration failed');
        return;
      }

      // Success case
      const successData = data as ApiSuccessResponse;
      toast.success(successData.message);
      
      // Redirect to login page after successful registration
      window.location.href = '/auth/login';

    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
    }
  };

  return (
  <div className="container mx-auto">
    <div className="flex justify-center px-6 my-12">
      <div className="w-full xl:w-3/4 lg:w-11/12 flex">
        {/* Image Column */}
        <div
          className="w-full h-auto bg-gray-400 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
          style={{
            background: "url('https://images.unsplash.com/photo-1515965885361-f1e0095517ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        ></div>
        
        {/* Form Column - Redesigned */}
        <div className="w-full lg:w-7/12 bg-white p-8 rounded-lg lg:rounded-l-none shadow-sm">
          <h3 className="text-3xl font-semibold text-center mb-6 text-gray-800">Create an Account</h3>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                  First Name
                </label>
                <input
                  className={`w-full px-4 py-2.5 text-sm text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition ${
                    errors.firstName ? 'border-red-500 focus:ring-red-200' : ''
                  }`}
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  className={`w-full px-4 py-2.5 text-sm text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition ${
                    errors.lastName ? 'border-red-500 focus:ring-red-200' : ''
                  }`}
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                Username
              </label>
              <input
                className={`w-full px-4 py-2.5 text-sm text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition ${
                  errors.username ? 'border-red-500 focus:ring-red-200' : ''
                }`}
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-600">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <input
                className={`w-full px-4 py-2.5 text-sm text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition ${
                  errors.email ? 'border-red-500 focus:ring-red-200' : ''
                }`}
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                Address
              </label>
              <input
                className={`w-full px-4 py-2.5 text-sm text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition ${
                  errors.address ? 'border-red-500 focus:ring-red-200' : ''
                }`}
                id="address"
                name="address"
                type="text"
                placeholder="Your Address"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  className={`w-full px-4 py-2.5 text-sm text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition ${
                    errors.password ? 'border-red-500 focus:ring-red-200' : ''
                  }`}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password ? (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  className={`w-full px-4 py-2.5 text-sm text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : ''
                  }`}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <button
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-sm hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
              type="submit"
            >
              Register Account
            </button>

            <div className="text-center pt-4">
              <Link
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
                href="/auth/login"
              >
                Already have an account? Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);
}