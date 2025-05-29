'use client';

import { API_BASE_URL } from '@/constants/const';
import Link from 'next/link';
import { useState, FormEvent, ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
  username: string;
  password: string;
  remember: boolean;
}

interface FormErrors {
  username?: string;
  password?: string;
}

interface ApiErrorResponse {
  status_code: number;
  details?: {
    username?: string[];
    password?: string[];
  };
  message: string;
  status: string;
}

interface ApiSuccessResponse {
  status: string;
  message: string;
  details: {
    token: string;
    name: string;
  };
  status_code: number;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState<FormErrors>({
    username: '',
    password: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    // Clear previous errors
    setErrors({
      username: '',
      password: ''
    });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data: ApiErrorResponse | ApiSuccessResponse = await response.json();

      if (!response.ok) {
        const errorData = data as ApiErrorResponse;
        if (errorData.details) {
          // Handle validation errors
          const newErrors: FormErrors = {};
          if (errorData.details.username) {
            newErrors.username = errorData.details.username.join(' ');
          }
          if (errorData.details.password) {
            newErrors.password = errorData.details.password.join(' ');
          }
          setErrors(newErrors);
        }
        toast.error(errorData.message || 'Login failed');
        return;
      }

      // Success case
      const successData = data as ApiSuccessResponse;
      localStorage.setItem('authToken', successData.details.token);
      localStorage.setItem('userName', successData.details.name);
      if (formData.remember) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      toast.success(successData.message);
      // Redirect or perform other actions on successful login
      window.location.href = '/';

    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    }
  };

return (
  <div className="bg-gray-50 py-10 md:py-44 flex items-center justify-center p-4">
    <div className="flex rounded-xl shadow-xl w-full max-w-4xl bg-white overflow-hidden" style={{ height: "500px" }}>
      {/* Form Column */}
      <div className="w-full md:w-1/2 p-8 flex flex-col">
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-500">Sign in to your account</p>
          </div>
          
          <form className="space-y-5 max-w-md mx-auto w-full" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition ${
                  errors.username ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-600">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition ${
                  errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  id="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition shadow-sm cursor-pointer"
            >
              Sign In
            </button>

            <div className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-800">
                Register now
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Image Column */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1515965885361-f1e0095517ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80')"
        }}
      ></div>
    </div>
  </div>
);
}