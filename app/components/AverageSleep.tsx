import React from 'react';
import getUserRecord from '@/app/actions/getUserRecord';

const AverageSleep = async () => {
  try {
    const { record, daysWithRecords } = await getUserRecord();

    // Ensure valid numbers
    const validRecord = record || 0;
    const validDays =
      daysWithRecords && daysWithRecords > 0 ? daysWithRecords : 1; // avoid division by 0

    // Calculate the average sleep for the days with records
    const averageSleep = validRecord / validDays;

    // Extract hours and minutes
    const hours = Math.floor(averageSleep);
    const minutes = Math.round((averageSleep - hours) * 60);

    return (
      <div className="bg-gray-100 dark:bg-gray-900 flex items-center justify-center  px-4">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-xl text-center">
          <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-3">
            Your Average Sleep Last Month
          </h4>
          <h1 className="sm:text-3xl text-2xl font-bold bg-gradient-to-r from-[#3F8A00] via-[#89C60E] to-[#DFF79A] bg-clip-text text-transparent">
            {hours} hours {minutes} minutes
          </h1>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user record:', error);
    return (
      <div className="bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-10 px-4">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
          <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            Error
          </h4>
          <p className="text-red-600 dark:text-red-400">
            Unable to calculate average sleep.
          </p>
        </div>
      </div>
    );
  }
};

export default AverageSleep;
