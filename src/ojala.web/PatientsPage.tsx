import React, { useState, useEffect } from \'react\';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from \'@/components/ui/table\';
import { Button } from \'@/components/ui/button\';
import { MoreHorizontal } from \'lucide-react\';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from \'@/components/ui/dropdown-menu\';
import { useApi } from \'@/lib/api\'; // Import the API hook
import { Skeleton } from \'@/components/ui/skeleton\'; // Import Skeleton for loading state

// Define Patient interface based on expected API data (or mock data structure)
interface Patient {
  id: string;
  name: string;
  dob: string; // Assuming date string format
  lastVisit: string; // Assuming date string format
  status: string;
  primaryCondition: string;
  // Add other fields as needed from API
}

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { get } = useApi(); // Use the API hook

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with the actual API endpoint for fetching patients
        const response = await get(\'/patients\'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Patient[] = await response.json();
        setPatients(data);
      } catch (err: any) {
        console.error("Error fetching patients:", err);
        setError(err.message || \'Failed to fetch patients.\');
        // Keep mock data for display in case of error during MVP?
        // Or show an error message. For now, show error.
        setPatients([]); // Clear patients on error
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [get]); // Dependency array includes \'get\' from useApi

  return (
    <div>
      <div className=\"flex justify-between items-center mb-6\">
        <h2 className=\"text-2xl font-semibold\">Patient Management</h2>
        <Button>Add New Patient</Button> {/* Placeholder button */}
      </div>

      {error && (
        <div className=\"mb-4 p-4 bg-error/20 text-error border border-error rounded-md\">
          <p><strong>Error:</strong> {error}</p>
          <p>Displaying static mock data as fallback (if implemented) or check API connection.</p>
        </div>
      )}

      <Table>
        <TableCaption>A list of your patients.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className=\"w-[100px]\">Patient ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Last Visit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Primary Condition</TableHead>
            <TableHead className=\"text-right\">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            // Show skeleton loaders while loading
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell><Skeleton className=\"h-4 w-20\" /></TableCell>
                <TableCell><Skeleton className=\"h-4 w-32\" /></TableCell>
                <TableCell><Skeleton className=\"h-4 w-24\" /></TableCell>
                <TableCell><Skeleton className=\"h-4 w-24\" /></TableCell>
                <TableCell><Skeleton className=\"h-4 w-16\" /></TableCell>
                <TableCell><Skeleton className=\"h-4 w-40\" /></TableCell>
                <TableCell className=\"text-right\"><Skeleton className=\"h-8 w-8 rounded-full\" /></TableCell>
              </TableRow>
            ))
          ) : patients.length > 0 ? (
            patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className=\"font-medium\">{patient.id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.dob}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === \'Active\'
                        ? \'bg-success/20 text-success-dark\' // Assuming success-dark is defined in Tailwind config
                        : \'bg-gray-200 text-gray-600\'
                    }`}
                  >
                    {patient.status}
                  </span>
                </TableCell>
                <TableCell>{patient.primaryCondition}</TableCell>
                <TableCell className=\"text-right\">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant=\"ghost\" className=\"h-8 w-8 p-0\">
                        <span className=\"sr-only\">Open menu</span>
                        <MoreHorizontal className=\"h-4 w-4\" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align=\"end\">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => alert(`Viewing details for ${patient.name}`)} // Placeholder action
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Patient</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className=\"text-error\">Delete Patient</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className=\"text-center text-muted-foreground py-4\">
                No patients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientsPage;

