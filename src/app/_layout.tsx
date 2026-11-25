import { Stack } from "expo-router";
import { ApplicationsProvider } from "../context/ApplicationContext";

export default function RootLayout() {
  return (
    <ApplicationsProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "CareerTrack" }} />
        <Stack.Screen
          name="application"
          options={{ title: "Job Application" }}
        />
      </Stack>
    </ApplicationsProvider>
  );
}
