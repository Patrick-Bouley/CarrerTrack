import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Application } from "../storage/applicationStorage";

// Information needed to display an application card.
type ApplicationCardProps = {
  application: Application;
  onPress: () => void;
};

// Display basic information about a saved application.
const ApplicationCard = ({ application, onPress }: ApplicationCardProps) => {
  // Choose a colour based on the application's status.
  const getStatusColor = () => {
    switch (application.status) {
      case "Applied":
        return "#2563eb";
      case "Interview":
        return "#d97706";
      case "Offer":
        return "#15803d";
      case "Rejected":
        return "#dc2626";
    }
  };

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.company}>{application.company}</Text>
        <Text style={{ color: getStatusColor() }}>{application.status}</Text>
      </View>

      <Text style={styles.jobTitle}>{application.jobTitle}</Text>
      <Text style={styles.date}>Applied: {application.dateApplied}</Text>
    </Pressable>
  );
};

export default ApplicationCard;

// Basic card styling.
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  company: {
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1,
  },
  jobTitle: {
    fontSize: 14,
    marginTop: 6,
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
});
