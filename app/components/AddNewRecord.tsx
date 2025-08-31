'use client';
import { useRef, useState } from 'react';
import addSleepRecord from '@/app/actions/addSleepRecord';

const AddRecord = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [amount, setAmount] = useState(6); 
  const [alertMessage, setAlertMessage] = useState<string | null>(null); 
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [sleepQuality, setSleepQuality] = useState(''); 

  const clientAction = async (formData: FormData) => {
    setIsLoading(true); 
    setAlertMessage(null); 

    formData.set('amount', amount.toString()); 
    formData.set('text', sleepQuality); 

    const { error } = await addSleepRecord(formData); 

    if (error) {
      setAlertMessage(`Error: ${error}`);
      setAlertType('error'); 
    } else {
      setAlertMessage('Sleep record added successfully!');
      setAlertType('success'); 
      formRef.current?.reset();
      setAmount(6); 
      setSleepQuality(''); 
    }

    setIsLoading(false); 
  };

  return (
    <div className=" bg-gray-100 dark:bg-gray-900 flex items-center justify-center ">
      <div className=" bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full  transition">

        <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-[#3F8A00] via-[#89C60E] to-[#DFF79A] bg-clip-text text-transparent">
          Track Your Sleep
        </h3>

        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(formRef.current!);
            clientAction(formData);
          }}
          className="space-y-6"
        >
          {/* Sleep Quality and Sleep Date */}
          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* Sleep Quality */}
            <div className="flex-1">
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Sleep Quality
              </label>
              <select
                id="text"
                name="text"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-[#89C60E] focus:border-[#89C60E] px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="" disabled>
                  Sleep quality...
                </option>
                <option value="Refreshed">🌞 Refreshed</option>
                <option value="Tired">😴 Tired</option>
                <option value="Neutral">😐 Neutral</option>
                <option value="Exhausted">😫 Exhausted</option>
                <option value="Energetic">⚡ Energetic</option>
              </select>
            </div>

            {/* Sleep Date */}
            <div className="flex-1">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Sleep Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-[#89C60E] focus:border-[#89C60E] px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Select a date"
                required
                onFocus={(e) => e.target.showPicker()}
              />
            </div>
          </div>

          {/* Hours Slept */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Hours Slept
              <br />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (Select between 0 and 12 in steps of 0.5)
              </span>
            </label>
            <input
              type="range"
              name="amount"
              id="amount"
              min="0"
              max="12"
              step="0.5"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-full cursor-pointer accent-[#89C60E]"
            />
            <div className="text-center text-gray-700 dark:text-gray-200 mt-2">
              {amount} hours
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#3F8A00] via-[#89C60E] to-[#DFF79A] hover:opacity-90 text-gray-900 px-4 py-2 rounded-lg font-medium shadow-md transition flex items-center justify-center cursor-pointer disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-gray-900"
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
              'Add Sleep Record'
            )}
          </button>
        </form>

        {/* Alert Message */}
        {alertMessage && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm ${
              alertType === 'success'
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border border-green-300 dark:border-green-700'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border border-red-300 dark:border-red-700'
            }`}
          >
            {alertMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRecord;
