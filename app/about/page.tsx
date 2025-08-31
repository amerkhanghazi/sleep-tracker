'use client';

const AboutPage = () => {
  return (
    <div className="font-sans bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-8 bg-gradient-to-r from-[#3F8A00] via-[#89C60E] to-[#DFF79A]">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
          About Tracker-360
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl">
          Learn more about our mission and how Tracker-360 helps improve your
          sleep journey.
        </p>
      </section>

      {/* About Section */}
      <section className="py-16 px-8 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Our Mission
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            At <span className="font-semibold">Tracker-360</span>, our mission is
            to empower individuals with insights into their sleep habits. We
            believe that better sleep leads to better health and productivity.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Our app provides a seamless way to track your sleep patterns,
            understand your habits, and make informed decisions to enhance your
            rest and overall well-being.
          </p>
        </div>
      </section>

      {/* Vision / Values Section */}
      <section className="py-16 px-8 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Tracker-360?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Accuracy</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Reliable insights into your sleep patterns with modern tracking.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Simplicity</h3>
              <p className="text-gray-600 dark:text-gray-400">
                A clean, intuitive design to make tracking effortless.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Improvement</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Insights that guide you toward healthier and better sleep habits.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
