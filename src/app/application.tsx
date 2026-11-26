import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import ApplicationForm from "../components/ApplicationForm";
import { useApplications } from "../context/ApplicationContext";

// Screen used for both adding and editing job applications.
const ApplicationScreen = () => {
  const router = useRouter();

  // Get the application ID from the route, if one was passed.
  const { id } = useLocalSearchParams<{ id?: string }>();

  // Get our saved applications from Context.
  const { applications, loading } = useApplications();

  // Find the application matching the ID when editing.
  // When adding a new application, the ID will be undefined.
  const application = applications.find((item) => item.id === id);

  // Wait until saved applications have finished loading.
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading applications...</Text>
      </View>
    );
  }

  // Show an error if an ID was provided but no application was found.
  if (id && !application) {
    return (
      <View style={styles.container}>
        <Text>Application not found.</Text>
      </View>
    );
  }

  // Display our reusable form.
  // After saving, return to the dashboard.
  return (
    <ApplicationForm application={application} onSaved={() => router.back()} />
  );
};

export default ApplicationScreen;

// Basic styling for loading and error messages.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
