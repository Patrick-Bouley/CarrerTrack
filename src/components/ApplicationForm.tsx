import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useApplications } from "../context/ApplicationContext";
import {
  applicationSchema,
  type ApplicationFormData,
} from "../schemas/applicationSchema";
import type { Application } from "../storage/applicationStorage";
import FormField from "./FormField";

// The same form is used for adding and editing applications.
// An existing application is only passed in when editing.
type ApplicationFormProps = {
  application?: Application;
  onSaved: () => void;
};

// The four possible statuses for a job application.
const STATUSES = ["Applied", "Interview", "Offer", "Rejected"] as const;

// Get today's date in YYYY-MM-DD format.
// This will be the default date for new applications.
const getToday = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

// Form used to create or edit a job application.
const ApplicationForm = ({ application, onSaved }: ApplicationFormProps) => {
  // Get the add and update functions from our Applications Context.
  const { addApplication, updateApplication, removeApplication } =
    useApplications();

  // React Hook Form manages our input values and validation errors.
  // The Zod resolver connects our schema to the form.
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),

    // Validate when the user tries to submit the form.
    mode: "onSubmit",

    // Use existing values when editing an application.
    // Otherwise, start with empty fields and the default status.
    defaultValues: application ?? {
      company: "",
      jobTitle: "",
      location: "",
      dateApplied: getToday(),
      status: "Applied",
      salaryMin: "",
      salaryMax: "",
      interviewDate: "",
      offerAmount: "",
      contactEmail: "",
      notes: "",
    },
  });

  // Reset the form with saved information when editing.
  useEffect(() => {
    if (application) {
      reset(application);
    }
  }, [application, reset]);

  // Watch the status field so we know which optional fields to show.
  const selectedStatus = watch("status");

  // Change the selected status and clear fields that no longer apply.
  const changeStatus = (status: ApplicationFormData["status"]) => {
    setValue("status", status, { shouldValidate: true });

    // Clear the interview date when the status is not Interview.
    if (status !== "Interview") {
      setValue("interviewDate", "");
      clearErrors("interviewDate");
    }

    // Clear the offer amount when the status is not Offer.
    if (status !== "Offer") {
      setValue("offerAmount", "");
      clearErrors("offerAmount");
    }
  };

  // Called only after the form passes Zod validation.
  const onSubmit = (data: ApplicationFormData) => {
    // Update the existing application if one was provided.
    // Otherwise, create a new application.
    if (application) {
      updateApplication(application.id, data);
    } else {
      addApplication(data);
    }

    // Return to the previous screen after saving.
    onSaved();
  };

  // Ask for confirmation before deleting an application.
  const handleDelete = () => {
    if (!application) {
      return;
    }

    Alert.alert(
      "Delete Application",
      "Are you sure you want to delete this application?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeApplication(application.id);
            onSaved();
          },
        },
      ],
    );
  };

  return (
    // Help keep the form visible when the keyboard opens.
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Allow the user to scroll through the form. */}
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Company name */}
        {/* Controller connects this input to React Hook Form. */}
        <Controller
          control={control}
          name="company"
          render={({ field }) => (
            <FormField
              label="Company"
              placeholder="Enter company name"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.company?.message}
            />
          )}
        />

        {/* Job title */}
        <Controller
          control={control}
          name="jobTitle"
          render={({ field }) => (
            <FormField
              label="Job Title"
              placeholder="Enter job title"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.jobTitle?.message}
            />
          )}
        />

        {/* Job location */}
        <Controller
          control={control}
          name="location"
          render={({ field }) => (
            <FormField
              label="Location"
              placeholder="City or Remote"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.location?.message}
            />
          )}
        />

        {/* Date the application was submitted. */}
        {/* The Zod schema checks the date format and validation rules. */}
        <Controller
          control={control}
          name="dateApplied"
          render={({ field }) => (
            <FormField
              label="Date Applied"
              placeholder="YYYY-MM-DD"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.dateApplied?.message}
            />
          )}
        />

        {/* Application status selection */}
        <Text style={styles.label}>Application Status</Text>

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <View style={styles.statusRow}>
              {/* Create a button for each status in our array. */}
              {STATUSES.map((status) => (
                <Pressable
                  key={status}
                  style={[
                    styles.statusButton,

                    // Highlight the currently selected status.
                    field.value === status && styles.statusSelected,
                  ]}
                  onPress={() => changeStatus(status)}
                >
                  <Text>{status}</Text>
                </Pressable>
              ))}
            </View>
          )}
        />

        {/* Show a validation error if the status is invalid. */}
        {errors.status && (
          <Text style={styles.error}>{errors.status.message}</Text>
        )}

        {/* Optional minimum salary */}
        {/* The numeric keyboard makes entering salary amounts easier. */}
        <Controller
          control={control}
          name="salaryMin"
          render={({ field }) => (
            <FormField
              label="Minimum Salary (Optional)"
              placeholder="Enter minimum salary"
              keyboardType="numeric"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.salaryMin?.message}
            />
          )}
        />

        {/* Optional maximum salary */}
        {/* Zod checks that this is not lower than the minimum salary. */}
        <Controller
          control={control}
          name="salaryMax"
          render={({ field }) => (
            <FormField
              label="Maximum Salary (Optional)"
              placeholder="Enter maximum salary"
              keyboardType="numeric"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.salaryMax?.message}
            />
          )}
        />

        {/* Only display the interview date when Interview is selected. */}
        {selectedStatus === "Interview" && (
          <Controller
            control={control}
            name="interviewDate"
            render={({ field }) => (
              <FormField
                label="Interview Date"
                placeholder="YYYY-MM-DD"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.interviewDate?.message}
              />
            )}
          />
        )}

        {/* Only display the offer amount when Offer is selected. */}
        {selectedStatus === "Offer" && (
          <Controller
            control={control}
            name="offerAmount"
            render={({ field }) => (
              <FormField
                label="Offer Amount"
                placeholder="Enter offer amount"
                keyboardType="numeric"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.offerAmount?.message}
              />
            )}
          />
        )}

        {/* Optional contact email */}
        {/* The email keyboard provides easier access to email characters. */}
        <Controller
          control={control}
          name="contactEmail"
          render={({ field }) => (
            <FormField
              label="Contact Email (Optional)"
              placeholder="example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.contactEmail?.message}
            />
          )}
        />

        {/* Optional notes with a maximum of 500 characters. */}
        {/* Multiline allows the user to enter longer text. */}
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <FormField
              label="Notes (Optional)"
              placeholder="Additional information"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.notes?.message}
            />
          )}
        />

        {/* Validate the form before saving the application. */}
        {/* The arrow function prevents passing the Pressable event to handleSubmit. */}
        <Pressable
          style={styles.saveButton}
          onPress={() => handleSubmit(onSubmit)()}
        >
          {/* Change the button text depending on whether we are adding or editing. */}
          <Text style={styles.saveText}>
            {application ? "Update Application" : "Save Application"}
          </Text>
        </Pressable>

        {/* Only allow deletion when editing an existing application. */}
        {application && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete Application</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ApplicationForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  statusButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
  },
  statusSelected: {
    backgroundColor: "#dbeafe",
    borderColor: "#2563eb",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#2563eb",
    borderRadius: 6,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "#dc2626",
    borderRadius: 6,
    padding: 14,
    alignItems: "center",
    marginTop: 12,
  },
  deleteText: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "bold",
  },
});
