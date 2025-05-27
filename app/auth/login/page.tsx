'use client';

import { API_BASE_URL } from '@/constants/const';
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
    <div className="bg-gray-50 h-screen w-screen">
      <div className="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
        <div
          className="flex rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2 bg-white sm:mx-0"
          style={{ height: "500px" }}
        >
          <div className="flex flex-col w-full md:w-1/2 p-4">
            <div className="flex flex-col flex-1 justify-center mb-8">
              <h1 className="text-4xl text-center font-thin">Welcome Back</h1>
              <div className="w-full mt-4">
                <form className="form-horizontal w-3/4 mx-auto" onSubmit={handleSubmit}>
                  <div className="flex flex-col mt-4">
                    <input
                      id="username"
                      type="text"
                      className={`flex-grow h-8 px-2 border rounded ${errors.username ? 'border-red-500' : 'border-grey-400'}`}
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                    )}
                  </div>
                  <div className="flex flex-col mt-4">
                    <input
                      id="password"
                      type="password"
                      className={`flex-grow h-8 px-2 rounded border ${errors.password ? 'border-red-500' : 'border-grey-400'}`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Password"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      name="remember"
                      id="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      className="mr-2"
                    />{" "}
                    <label htmlFor="remember" className="text-sm text-grey-dark">
                      Remember Me
                    </label>
                  </div>
                  <div className="flex flex-col mt-8">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded"
                    >
                      Login
                    </button>
                  </div>
                </form>
                <div className="text-center mt-4">
                  <a
                    className="no-underline hover:underline text-blue-800 text-xs"
                    href="#"
                  >
                    Forgot Your Password?
                  </a>
                  <a
                    className="ml-5 no-underline hover:underline text-blue-dark text-xs cursor-pointer"
                    href="/auth/register"
                  >
                    Register Now 
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div
            className="hidden md:block md:w-1/2 rounded-r-lg"
            style={{
              background:
                "url('https://images.unsplash.com/photo-1515965885361-f1e0095517ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}