import React from 'react';
import { Link } from 'react-router';
import { IoCreate } from 'react-icons/io5';
import { GrDocumentUpdate } from 'react-icons/gr';
import { MdOutlineFolderDelete } from 'react-icons/md';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4 dark:bg-gray-900 transition duration-300">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Admin Actions</h1>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Link to="/admin/create" className="card bg-indigo-500 text-white shadow-xl hover:scale-105 transition-transform dark:bg-gray-800/90 dark:border dark:border-gray-700">
          <div className="card-body text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-full bg-indigo-100 text-2xl text-indigo-700 transition-transform">
              <IoCreate />
            </div>
            <h2 className="card-title justify-center">Create Problem</h2>
            <p>Add new challenges to the platform</p>
          </div>
        </Link>

        <Link to="/admin/update" className="card bg-indigo-500 text-white shadow-xl hover:scale-105 transition-transform dark:bg-gray-800/90 dark:border dark:border-gray-700">
          <div className="card-body text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-full bg-indigo-100 text-2xl text-indigo-700 transition-transform">
              <GrDocumentUpdate />
            </div>
            <h2 className="card-title justify-center">Update Problem</h2>
            <p>Edit existing problems easily</p>
          </div>
        </Link>

        <Link to="/admin/delete" className="card bg-indigo-500 text-white shadow-xl hover:scale-105 transition-transform dark:bg-gray-800/90 dark:border dark:border-gray-700">
          <div className="card-body text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-full bg-indigo-100 text-2xl text-indigo-700 transition-transform">
              <MdOutlineFolderDelete />
            </div>
            <h2 className="card-title justify-center">Delete Problem</h2>
            <p>Remove obsolete problems with care</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
