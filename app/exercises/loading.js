export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="h-10 w-64 bg-white/20 rounded-md mb-4"></div>
          <div className="h-6 w-96 bg-white/10 rounded-md"></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 animate-pulse">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="h-10 w-full max-w-lg bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 w-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4">
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                
                <div className="flex gap-2 mt-4">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
