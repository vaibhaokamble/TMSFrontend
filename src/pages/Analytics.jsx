import React, { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { getOverview } from '../services/analyticsService';

const Analytics = () => {


  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {

    fetchAnalytics();

  }, []);

  const fetchAnalytics = async () => {

    try {

      const response = await getOverview();

      console.log(response.data);

      setAnalyticsData(response.data.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          📊 Analytics & Reports
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View team performance and task metrics
        </p>
      </div>

      {/* Analytics Content */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-12 text-center">

        <BarChart3
          size={48}
          className="mx-auto text-gray-400 dark:text-dark-600 mb-4"
        />

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Analytics Dashboard
        </h3>

        {
          analyticsData ? (

            <div className="space-y-2 text-left">

              <p className="text-gray-700 dark:text-gray-300">
                Total Tasks : {analyticsData.totalTasks}
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                Completed Tasks : {analyticsData.completedTasks}
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                Pending Tasks : {analyticsData.pendingTasks}
              </p>

            </div>

          ) : (

            <p className="text-gray-600 dark:text-gray-400">
              Loading analytics...
            </p>

          )
        }

      </div>

    </div>
  );
};

export default Analytics;