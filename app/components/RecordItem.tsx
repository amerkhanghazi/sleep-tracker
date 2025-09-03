'use client';
import { useState } from 'react';
import { Record } from '@/types/Record';
import deleteRecord from '@/app/actions/deleteRecord';

const RecordItem = ({ record }: { record: Record }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteRecord = async (recordId: string) => {
    setIsLoading(true);
    await deleteRecord(recordId);
    setIsLoading(false);
  };

  const isPoorSleep = record?.amount < 7;

  return (
    <li
      className={`flex justify-between items-center p-5 rounded-2xl shadow-md border transition 
        bg-white dark:bg-gray-800 
        ${isPoorSleep ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'}
      `}
    >
      {/* Record details */}
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(record?.date).toLocaleDateString()}
        </span>
        <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {record?.amount} hours
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Sleep Mode: {record?.text}
        </span>
      </div>

      {/* Delete button */}
      <button
        onClick={() => handleDeleteRecord(record.id)}
        className={`bg-red-500 hover:bg-red-600 text-white rounded-full w-9 h-9 flex items-center justify-center 
          transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
        aria-label="Delete record"
        disabled={isLoading}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : (
          '✖'
        )}
      </button>
    </li>
  );
};

export default RecordItem;
