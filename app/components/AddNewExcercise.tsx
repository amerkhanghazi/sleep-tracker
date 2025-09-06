"use client";
import { useRef, useState } from "react";
import addGymRecord from "../actions/addGymRecord";

const AddNewExercise = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const [workoutType, setWorkoutType] = useState("");
  const [weight, setWeight] = useState<number | "">("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(false);

  const clientAction = async (formData: FormData) => {
    setIsLoading(true);
    setAlertMessage(null);

    // Map state to FormData keys expected by backend
    formData.set("weight", weight.toString());
    formData.set("workoutType", workoutType);

    const { error } = await addGymRecord(formData);

    if (error) {
      setAlertMessage(`❌ ${error}`);
      setAlertType("error");
    } else {
      setAlertMessage("✅ Exercise record added successfully!");
      setAlertType("success");
      formRef.current?.reset();
      setWeight("");
      setWorkoutType("");
    }

    setIsLoading(false);
  };

  return (
    
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full transition">
        <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-[#3F8A00] via-[#89C60E] to-[#DFF79A] bg-clip-text text-transparent">
          Track Your Workout
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
          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Workout Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              required
              onFocus={(e) => e.target.showPicker()}
              className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Workout Type */}
          <div>
            <label
              htmlFor="workoutType"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Workout Type
            </label>
            <select
              id="workoutType"
              name="workoutType"
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              required
              className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="" disabled>
                Select type...
              </option>
              <option value="Chest">🏋️ Chest</option>
              <option value="Back">💪 Back</option>
              <option value="Biceps">🌀 Biceps</option>
              <option value="Triceps">🎯 Triceps</option>
              <option value="Shoulders">🏹 Shoulders</option>
              <option value="Legs">🦵 Legs</option>
              <option value="Cardio">❤️ Cardio</option>
            </select>
          </div>

          {/* Weight */}
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Current Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              min="0"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              required
              className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#3F8A00] via-[#89C60E] to-[#DFF79A] hover:opacity-90 text-gray-900 px-4 py-2 rounded-lg font-medium shadow-md transition disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add Exercise"}
          </button>
        </form>

        {/* Alert */}
        {alertMessage && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm border ${
              alertType === "success"
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border-green-300 dark:border-green-700"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border-red-300 dark:border-red-700"
            }`}
          >
            {alertMessage}
          </div>
        )}
      </div>
  
  );
};

export default AddNewExercise;
