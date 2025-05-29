'use client'

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/constants/const';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Complain {
  id: number;
  title: string;
  description: string;
  name: string;
  username: string;
}

interface ComplainInput {
  title: string;
  description: string;
}

const Complains: React.FC = () => {
  const [complains, setComplains] = useState<Complain[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [searchId, setSearchId] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredComplains, setFilteredComplains] = useState<Complain[]>([]);
  const [noResults, setNoResults] = useState<boolean>(false);

  const getAuthToken = (): string => {
    return localStorage.getItem('authToken') || '';
  };

  const getAuthHeaders = (): HeadersInit => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    };
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  useEffect(() => {
    if (searchId.trim() === '') {
      setFilteredComplains(complains);
      setNoResults(false);
    } else {
      const filtered = complains.filter(complain => 
        complain.id === parseInt(searchId)
      );
      setFilteredComplains(filtered);
      setNoResults(filtered.length === 0);
    }
  }, [searchId, complains]);

  const fetchComplains = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/complains`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again.');
          window.location.href = '/auth/login';
          return;
        }
        throw new Error('Failed to fetch complains');
      }
      
      const data = await response.json();
      setComplains(data.details);
      setFilteredComplains(data.details);
    } catch (error) {
      console.error('Error fetching complains:', error);
      toast.error('Failed to fetch complains');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    const complainData: ComplainInput = {
      title,
      description
    };

    try {
      setIsLoading(true);
      const url = editingId 
        ? `${API_BASE_URL}/api/v1/complains/${editingId}` 
        : `${API_BASE_URL}/api/v1/complains`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(complainData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again.');
          window.location.href = '/auth/login';
          return;
        }
        throw new Error(`Failed to ${editingId ? 'update' : 'create'} complain`);
      }

      toast.success(`Complain ${editingId ? 'updated' : 'created'} successfully`);
      setTitle('');
      setDescription('');
      setEditingId(null);
      fetchComplains();
    } catch (error) {
      console.error('Error saving complain:', error);
      toast.error('Failed to save complain');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (complain: Complain): void => {
    setTitle(complain.title);
    setDescription(complain.description);
    setEditingId(complain.id);
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this complain?')) {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/complains/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Session expired. Please login again.');
            window.location.href = '/auth/login';
            return;
          }
          throw new Error('Failed to delete complain');
        }

        toast.success('Complain deleted successfully');
        fetchComplains();
      } catch (error) {
        console.error('Error deleting complain:', error);
        toast.error('Failed to delete complain');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDownload = async (complain: Complain): Promise<void> => {
  try {
    setIsLoading(true);
    const response = await fetch(`${API_BASE_URL}/api/v1/complains/generate-pdf/${complain.id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/auth/login';
        return;
      }
      throw new Error('Failed to generate PDF');
    }

    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complain-${complain.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success('PDF downloaded successfully');
  } catch (error) {
    console.error('Error downloading PDF:', error);
    toast.error('Failed to download PDF');
  } finally {
    setIsLoading(false);
  }
};

  return (
  <div className="max-w-5xl mx-auto p-4">
    {/* Header Section */}
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold bg-clip-text text-blue-600">
        Complaint Management System
      </h1>
    </div>

    {/* Search and Create Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Search by ID Section */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Search Complaint</h2>
        <div className="flex space-x-2">
          <input
            type="number"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Complaint ID"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchId && (
            <button 
              onClick={() => setSearchId('')}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Create Complaint Section */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          {editingId ? 'Update Complaint' : 'Create New Complaint'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Complaint Title"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed Description"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
              isLoading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              editingId ? 'Update Complaint' : 'Submit Complaint'
            )}
          </button>
        </form>
      </div>
    </div>

    {/* Complaints List */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Complaint Records</h2>
        <p className="text-sm text-gray-500">{filteredComplains.length} complaints found</p>
      </div>

      <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
        {noResults ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-700">No complaints found</h3>
            <p className="text-gray-500 mt-1">We couldn't find any complaints matching your search criteria.</p>
          </div>
        ) : (
          filteredComplains.map((complain: Complain) => (
            <div key={complain.id} className="p-5 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-500">#{complain.id}</span>
                    <h3 className="text-lg font-semibold text-gray-800">{complain.title}</h3>
                  </div>
                  <p className="text-gray-600 mt-1">{complain.description}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>Submitted by {complain.name}</span>
                    <span className="mx-2">•</span>
                    <span>@{complain.username}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(complain)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDownload(complain)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download PDF"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(complain.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>

    {/* Loading Overlay */}
    {isLoading && (
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div>
              <h3 className="font-medium text-gray-900">Processing your request</h3>
              <p className="text-sm text-gray-500">Please wait a moment...</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default Complains;