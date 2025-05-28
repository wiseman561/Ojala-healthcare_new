import React, { useState, useEffect, useCallback } from \"react\";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from \"@/components/ui/table\";
import { Button } from \"@/components/ui/button\";
import { Input } from \"@/components/ui/input\";
import { Label } from \"@/components/ui/label\";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from \"@/components/ui/dialog\";
import { Badge } from \"@/components/ui/badge\";
import { useApi } from \"@/lib/api\"; // Import the API hook
import { Skeleton } from \"@/components/ui/skeleton\"; // Import Skeleton

// Define Prescription interface based on expected API data
interface Prescription {
  id: string;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string; // Assuming date string format
  status: string;
  // Add other fields as needed from API
}

// Helper to get badge variant based on status
const getStatusVariant = (status: string): \"default\" | \"secondary\" | \"destructive\" | \"outline\" => {
  switch (status.toLowerCase()) { // Make comparison case-insensitive
    case \"active\":
      return \"default\"; // Greenish in shadcn default theme
    case \"inactive\":
    case \"discontinued\":
      return \"secondary\"; // Grey
    case \"pending\":
      return \"outline\"; // Blue outline
    default:
      return \"secondary\";
  }
};

const PrescriptionsPage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { get, post } = useApi(); // Use the API hook

  // Basic state for the new prescription form
  const [newRx, setNewRx] = useState({ patientName: \"\", medication: \"\", dosage: \"\", frequency: \"\" });

  // Fetch prescriptions
  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with the actual API endpoint for fetching prescriptions
      const response = await get(\"/prescriptions\"); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Prescription[] = await response.json();
      setPrescriptions(data);
    } catch (err: any) {
      console.error(\"Error fetching prescriptions:\", err);
      setError(err.message || \"Failed to fetch prescriptions.\");
      setPrescriptions([]); // Clear prescriptions on error
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  // Handle adding a new prescription
  const handleAddPrescription = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Replace with the actual API endpoint for adding a prescription
      const response = await post(\"/prescriptions\", newRx); 
      if (!response.ok) {
        // Try to get error message from response body
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (parseError) { /* Ignore if response body is not JSON */ }
        throw new Error(errorMsg);
      }
      // Optionally refetch prescriptions or add the new one to state
      await fetchPrescriptions(); 
      setNewRx({ patientName: \"\", medication: \"\", dosage: \"\", frequency: \"\" }); // Reset form
      setIsDialogOpen(false); // Close dialog
      // Add a success toast notification here later
    } catch (err: any) {
      console.error(\"Error adding prescription:\", err);
      setError(err.message || \"Failed to add prescription.\");
      // Keep dialog open on error to allow correction
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className=\"flex justify-between items-center mb-6\">
        <h2 className=\"text-2xl font-semibold\">Prescription Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Prescription</Button>
          </DialogTrigger>
          <DialogContent className=\"sm:max-w-[425px]\">
            <DialogHeader>
              <DialogTitle>Add New Prescription</DialogTitle>
              <DialogDescription>
                Fill in the details for the new prescription.
              </DialogDescription>
            </DialogHeader>
            {error && (
              <p className=\"text-sm text-error bg-error/10 p-2 rounded-md\">Error: {error}</p>
            )}
            <div className=\"grid gap-4 py-4\">
              {/* Form Inputs remain the same */}
              <div className=\"grid grid-cols-4 items-center gap-4\">
                <Label htmlFor=\"patientName\" className=\"text-right\">
                  Patient Name
                </Label>
                <Input
                  id=\"patientName\"
                  value={newRx.patientName}
                  onChange={(e) => setNewRx({ ...newRx, patientName: e.target.value })}
                  className=\"col-span-3\"
                  placeholder=\"e.g., Alice Wonderland\"
                  disabled={isSubmitting}
                />
              </div>
              <div className=\"grid grid-cols-4 items-center gap-4\">
                <Label htmlFor=\"medication\" className=\"text-right\">
                  Medication
                </Label>
                <Input
                  id=\"medication\"
                  value={newRx.medication}
                  onChange={(e) => setNewRx({ ...newRx, medication: e.target.value })}
                  className=\"col-span-3\"
                  placeholder=\"e.g., Lisinopril\"
                  disabled={isSubmitting}
                />
              </div>
              <div className=\"grid grid-cols-4 items-center gap-4\">
                <Label htmlFor=\"dosage\" className=\"text-right\">
                  Dosage
                </Label>
                <Input
                  id=\"dosage\"
                  value={newRx.dosage}
                  onChange={(e) => setNewRx({ ...newRx, dosage: e.target.value })}
                  className=\"col-span-3\"
                  placeholder=\"e.g., 10mg\"
                  disabled={isSubmitting}
                />
              </div>
              <div className=\"grid grid-cols-4 items-center gap-4\">
                <Label htmlFor=\"frequency\" className=\"text-right\">
                  Frequency
                </Label>
                <Input
                  id=\"frequency\"
                  value={newRx.frequency}
                  onChange={(e) => setNewRx({ ...newRx, frequency: e.target.value })}
                  className=\"col-span-3\"
                  placeholder=\"e.g., Once daily\"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type=\"button\" onClick={handleAddPrescription} disabled={isSubmitting}>
                {isSubmitting ? \"Adding...\" : \"Add Prescription\"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && !loading && (
        <div className=\"mb-4 p-4 bg-error/20 text-error border border-error rounded-md\">
          <p><strong>Error loading prescriptions:</strong> {error}</p>
        </div>
      )}

      <Table>
        <TableCaption>A list of recent prescriptions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className=\"w-[100px]\">Rx ID</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Medication</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={`skeleton-rx-${index}`}>
                <TableCell><Skeleton className=\"h-4 w-20\" /></TableCell>
                <TableCell><Skeleton className=\"h-4 w-32\" /></TableCell>
                <TableCell><Skeleton className=\"h-4 w-28\" /></TableCell>
                <TableCell><Skeleton className=\"h-4 w-16\" /></TableCell>
                <TableCell><Skeleton className=\"h-4 w-24\" /></TableCell>
                <TableCell><Skeleton className=\"h-4 w-24\" /></TableCell>
                <TableCell><Skeleton className=\"h-6 w-20 rounded-full\" /></TableCell>
              </TableRow>
            ))
          ) : prescriptions.length > 0 ? (
            prescriptions.map((rx) => (
              <TableRow key={rx.id}>
                <TableCell className=\"font-medium\">{rx.id}</TableCell>
                <TableCell>{rx.patientName}</TableCell>
                <TableCell>{rx.medication}</TableCell>
                <TableCell>{rx.dosage}</TableCell>
                <TableCell>{rx.frequency}</TableCell>
                <TableCell>{rx.startDate}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(rx.status)}>{rx.status}</Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className=\"text-center text-muted-foreground py-4\">
                No prescriptions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PrescriptionsPage;

