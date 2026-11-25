import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  Application,
  loadApplications,
  saveApplications,
} from "../storage/applicationStorage";
import { ApplicationFormData } from "../schemas/applicationSchema";

// Define the information and functions available through Context.
type ApplicationsContextType = {
  applications: Application[];
  loading: boolean;
  addApplication: (data: ApplicationFormData) => void;
  updateApplication: (id: string, data: ApplicationFormData) => void;
  removeApplication: (id: string) => void;
};

// Create the Context.
const ApplicationsContext = createContext<ApplicationsContextType | undefined>(
  undefined,
);

// Provider that manages the application list.
export const ApplicationsProvider = ({ children }: { children: ReactNode }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved applications when the app starts.
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedApplications = await loadApplications();
        setApplications(savedApplications);
      } catch (error) {
        console.error("Failed to load applications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save changes after the initial loading finishes.
  useEffect(() => {
    if (!loading) {
      const saveData = async () => {
        try {
          await saveApplications(applications);
        } catch (error) {
          console.error("Failed to save applications:", error);
        }
      };

      saveData();
    }
  }, [applications, loading]);

  // Add a new job application.
  const addApplication = (data: ApplicationFormData) => {
    const newApplication: Application = {
      ...data,
      id: Date.now().toString(),
    };

    setApplications((current) => [...current, newApplication]);
  };

  // Update an existing job application.
  const updateApplication = (id: string, data: ApplicationFormData) => {
    setApplications((current) =>
      current.map((application) =>
        application.id === id ? { ...data, id } : application,
      ),
    );
  };

  // Remove an application from the list.
  const removeApplication = (id: string) => {
    setApplications((current) =>
      current.filter((application) => application.id !== id),
    );
  };

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        loading,
        addApplication,
        updateApplication,
        removeApplication,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
};

// Custom hook to access the Applications Context.
export const useApplications = () => {
  const context = useContext(ApplicationsContext);

  if (context === undefined) {
    throw new Error("useApplications must be used inside ApplicationsProvider");
  }

  return context;
};
