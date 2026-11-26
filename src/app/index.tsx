import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import ApplicationCard from "../components/ApplicationCard";
import { useApplications } from "../context/ApplicationContext";
import type { ApplicationFormData } from "../schemas/applicationSchema";

// Available filters for the application list.
const FILTERS = ["All", "Applied", "Interview", "Offer", "Rejected"] as const;

type ApplicationFilter = "All" | ApplicationFormData["status"];

const HomeScreen = () => {
  const router = useRouter();

  // Get saved applications and loading state from Context.
  const { applications, loading } = useApplications();

  // Track which status filter is selected.
  const [selectedFilter, setSelectedFilter] =
    useState<ApplicationFilter>("All");

  // Count the number of applications in each status.
  const total = applications.length;
  const applied = applications.filter(
    (item) => item.status === "Applied",
  ).length;
  const interviews = applications.filter(
    (item) => item.status === "Interview",
  ).length;
  const offers = applications.filter((item) => item.status === "Offer").length;
  const rejected = applications.filter(
    (item) => item.status === "Rejected",
  ).length;

  // Filter the applications based on the selected status.
  // Sort newest application dates first without changing Context state.
  const filteredApplications = applications
    .filter(
      (item) => selectedFilter === "All" || item.status === selectedFilter,
    )
    .sort((a, b) => b.dateApplied.localeCompare(a.dateApplied));

  // Avoid displaying an empty list while storage is loading.
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading applications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredApplications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        // Display the summary, filters and add button above the list.
        ListHeaderComponent={
          <View>
            <Text style={styles.heading}>My Job Applications</Text>

            {/* Summary of all application statuses */}
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <Text>Total: {total}</Text>
              <Text>Applied: {applied}</Text>
              <Text>Interview: {interviews}</Text>
              <Text>Offer: {offers}</Text>
              <Text>Rejected: {rejected}</Text>
            </View>

            {/* Select which applications to display. */}
            <View style={styles.filterRow}>
              {FILTERS.map((filter) => (
                <Pressable
                  key={filter}
                  style={[
                    styles.filterButton,
                    selectedFilter === filter && styles.filterSelected,
                  ]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text
                    style={
                      selectedFilter === filter && styles.filterSelectedText
                    }
                  >
                    {filter}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Navigate to the form for a new application. */}
            <Pressable
              style={styles.addButton}
              onPress={() => router.push("/application")}
            >
              <Text style={styles.addButtonText}>Add Application</Text>
            </Pressable>

            <Text style={styles.listHeading}>Applications</Text>
          </View>
        }
        // Display each saved application.
        renderItem={({ item }) => (
          <ApplicationCard
            application={item}
            onPress={() =>
              router.push({
                pathname: "/application",
                params: { id: item.id },
              })
            }
          />
        )}
        // Helpful message when there are no applications to display.
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {selectedFilter === "All"
              ? "No applications yet. Add your first job application."
              : `No applications with the status ${selectedFilter}.`}
          </Text>
        }
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  summary: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  filterSelected: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  filterSelectedText: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  listHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    padding: 20,
  },
});
