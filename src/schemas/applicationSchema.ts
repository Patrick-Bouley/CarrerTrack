import { z } from "zod";

// Get today's date in YYYY-MM-DD format.
const getToday = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

// Validation rules for the job application form.
export const applicationSchema = z
  .object({
    company: z.string().trim().min(1, "Enter a company name"),

    jobTitle: z.string().trim().min(1, "Enter a job title"),

    location: z.string().trim().min(1, "Enter a location"),

    dateApplied: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the format YYYY-MM-DD"),

    status: z.enum(["Applied", "Interview", "Offer", "Rejected"], {
      error: "Select an application status",
    }),

    salaryMin: z.string().regex(/^\d*$/, "Enter whole numbers only"),

    salaryMax: z.string().regex(/^\d*$/, "Enter whole numbers only"),

    interviewDate: z
      .string()
      .refine(
        (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
        "Use the format YYYY-MM-DD",
      ),

    offerAmount: z.string().regex(/^\d*$/, "Enter a whole number"),

    contactEmail: z.email("Enter a valid email address").or(z.literal("")),

    notes: z.string().max(500, "Notes cannot exceed 500 characters"),
  })

  .refine((data) => data.dateApplied <= getToday(), {
    message: "Application date cannot be in the future",
    path: ["dateApplied"],
  })

  .refine(
    (data) =>
      data.salaryMin === "" ||
      data.salaryMax === "" ||
      Number(data.salaryMax) >= Number(data.salaryMin),
    {
      message: "Maximum salary must not be lower than the minimum salary",
      path: ["salaryMax"],
    },
  )

  .refine((data) => data.status !== "Interview" || data.interviewDate !== "", {
    message: "Enter an interview date",
    path: ["interviewDate"],
  })

  .refine(
    (data) =>
      data.interviewDate === "" || data.interviewDate >= data.dateApplied,
    {
      message: "Interview date cannot be before the application date",
      path: ["interviewDate"],
    },
  )

  .refine(
    (data) =>
      data.status !== "Offer" ||
      (data.offerAmount !== "" && /^\d+$/.test(data.offerAmount)),
    {
      message: "Enter a whole-number offer amount",
      path: ["offerAmount"],
    },
  )

  .refine((data) => data.status === "Offer" || data.offerAmount === "", {
    message: "Remove the offer amount unless the status is Offer",
    path: ["offerAmount"],
  });

// TypeScript type created from our Zod schema.
export type ApplicationFormData = z.infer<typeof applicationSchema>;
