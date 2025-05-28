import React, { useState, useEffect } from \"react\";
import EscalatedAlertsPanel from \"@/components/EscalatedAlertsPanel\"; // Adjust path if needed
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from \"@/components/ui/card\";
import { useApi } from \"@/lib/api\"; // Import the API hook
import { Skeleton } from \"@/components/ui/skeleton\"; // Import Skeleton

// Define interface for expected summary data
interface DashboardSummary {
  activePatients: number | string; // Allow string for \"--\" or error
  pendingApprovals: number | string;
  upcomingAppointments: number | string;
}

const DashboardPage: React.FC = () => {
  const [summaryData, setSummaryData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { get } = useApi();

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with the actual API endpoint for dashboard summary
        const response = await get(\"/dashboard/summary\"); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardSummary = await response.json();
        setSummaryData(data);
      } catch (err: any) {
        console.error(\"Error fetching dashboard summary:\", err);
        setError(err.message || \"Failed to fetch summary data.\");
        // Set placeholder data on error
        setSummaryData({
          activePatients: \"--\",
          pendingApprovals: \"--\",
          upcomingAppointments: \"--\",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [get]);

  const renderMetric = (value: number | string | undefined) => {
    if (loading) {
      return <Skeleton className=\"h-8 w-16 mt-1\" />;
    }
    return <p className=\"text-3xl font-bold\">{value ?? \"--\"}</p>;
  };

  return (
    <div className=\"space-y-6\">
      <h2 className=\"text-2xl font-semibold\">Dashboard Overview</h2>

      {error && (
        <div className=\"mb-4 p-4 bg-error/20 text-error border border-error rounded-md\">
          <p><strong>Error loading summary:</strong> {error}</p>
        </div>
      )}

      {/* Key metrics widgets */}
      <div className=\"grid gap-6 md:grid-cols-2 lg:grid-cols-3\">
        <Card>
          <CardHeader>
            <CardTitle>Active Patients</CardTitle>
            <CardDescription>Number of patients currently under care.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderMetric(summaryData?.activePatients)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Care plans or prescriptions needing review.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderMetric(summaryData?.pendingApprovals)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Appointments scheduled for today.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderMetric(summaryData?.upcomingAppointments)}
          </CardContent>
        </Card>
      </div>

      {/* Integrate Escalated Alerts Panel */}
      <div>
        {/* Ensure EscalatedAlertsPanel uses useAuth and correct URLs */}
        <EscalatedAlertsPanel />
      </div>

      {/* Placeholder for other dashboard sections like recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Fetch and display recent activity */}
          <p className=\"text-muted-foreground\">No recent activity to display yet.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

