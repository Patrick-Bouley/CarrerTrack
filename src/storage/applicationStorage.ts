import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ApplicationFormData } from "../schemas/applicationSchema";

// Each saved application has an ID so it can be edited or deleted.
export type Application = ApplicationFormData & {
  id: string;
};

// Key used to store our applications in AsyncStorage.
const STORAGE_KEY = "careertrack_applications";

// Load the saved applications from AsyncStorage.
export const loadApplications = async (): Promise<Application[]> => {
  const storedData = await AsyncStorage.getItem(STORAGE_KEY);

  // Return an empty array if nothing has been saved yet.
  if (storedData === null) {
    return [];
  }

  return JSON.parse(storedData) as Application[];
};

// Save the application list to AsyncStorage.
export const saveApplications = async (
  applications: Application[],
): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
};
