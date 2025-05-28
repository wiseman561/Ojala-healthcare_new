import React, { useState, useEffect } from \"react\";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from \"recharts\";
import { Card, CardHeader, CardTitle, CardContent } from \"@/components/ui/card\";
import { useApi } from \"@/lib/api\"; // Import the API hook
import { Skeleton } from \"@/components/ui/skeleton\"; // Import Skeleton for loading state

// Define interfaces for expected API data structures
interface AgeGroupData {
  ageGroup: string;
  count: number;
}

interface AppointmentTrendData {
  month: string;
  count: number;
}

interface ConditionData {
  name: string;
  value: number;
}

const COLORS = [\"#0088FE\", \"#00C49F\", \"#FFBB28\", \"#FF8042\", \"#8884d8\"];

const AnalyticsPage: React.FC = () => {
  const [demographicsData, setDemographicsData] = useState<AgeGroupData[]>([]);
  const [appointmentData, setAppointmentData] = useState<AppointmentTrendData[]>([]);
  const [conditionData, setConditionData] = useState<ConditionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { get } = useApi();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch data for all charts concurrently
        const [demoRes, apptRes, condRes] = await Promise.all([
          get(\"/analytics/demographics\"), // Replace with actual endpoint
          get(\"/analytics/appointments\"), // Replace with actual endpoint
          get(\"/analytics/conditions\"),   // Replace with actual endpoint
        ]);

        if (!demoRes.ok || !apptRes.ok || !condRes.ok) {
          // Handle potential partial failures if needed
          throw new Error(\"Failed to fetch one or more analytics datasets\");
        }

        const demoData: AgeGroupData[] = await demoRes.json();
        const apptData: AppointmentTrendData[] = await apptRes.json();
        const condData: ConditionData[] = await condRes.json();

        setDemographicsData(demoData);
        setAppointmentData(apptData);
        setConditionData(condData);

      } catch (err: any) {
        console.error(\"Error fetching analytics data:\", err);
        setError(err.message || \"Failed to fetch analytics data.\");
        // Clear data on error
        setDemographicsData([]);
        setAppointmentData([]);
        setConditionData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [get]);

  const renderChartContent = (chartData: any[], ChartComponent: React.ReactNode) => {
    if (loading) {
      return <Skeleton className=\"h-[300px] w-full\" />;
    }
    if (error) {
      return <p className=\"text-error text-center py-10\">Error loading data: {error}</p>;
    }
    if (chartData.length === 0) {
      return <p className=\"text-muted-foreground text-center py-10\">No data available.</p>;
    }
    return (
      <ResponsiveContainer width=\"100%\" height={300}>
        {ChartComponent}
      </ResponsiveContainer>
    );
  };

  return (
    <div className=\"space-y-6\">
      <h2 className=\"text-2xl font-semibold mb-4\">Analytics Dashboard</h2>

      {error && !loading && (
         <div className=\"mb-4 p-4 bg-error/20 text-error border border-error rounded-md\">
           <p><strong>Error:</strong> {error}</p>
         </div>
      )}

      <div className=\"grid gap-6 md:grid-cols-1 lg:grid-cols-2\">
        {/* Patient Demographics Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {renderChartContent(demographicsData, (
              <BarChart data={demographicsData}>
                <CartesianGrid strokeDasharray=\"3 3\" />
                <XAxis dataKey=\"ageGroup\" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey=\"count\" fill=\"#1976d2\" name=\"Number of Patients\" />
              </BarChart>
            ))}
          </CardContent>
        </Card>

        {/* Appointment Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {renderChartContent(appointmentData, (
              <LineChart data={appointmentData}>
                <CartesianGrid strokeDasharray=\"3 3\" />
                <XAxis dataKey=\"month\" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type=\"monotone\" dataKey=\"count\" stroke=\"#2e7d32\" name=\"Appointments\" activeDot={{ r: 8 }} />
              </LineChart>
            ))}
          </CardContent>
        </Card>

        {/* Condition Distribution Chart */}
        <Card className=\"lg:col-span-2\">
          <CardHeader>
            <CardTitle>Common Condition Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {renderChartContent(conditionData, (
              <PieChart>
                <Pie
                  data={conditionData}
                  cx=\"50%\"
                  cy=\"50%\"
                  labelLine={false}
                  outerRadius={100}
                  fill=\"#8884d8\"
                  dataKey=\"value\"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {conditionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;

