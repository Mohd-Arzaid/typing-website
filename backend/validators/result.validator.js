import { z } from "zod";

export const createResultSchema = z.object({
  wpm: z.number({
    required_error: "WPM is required",
    invalid_type_error: "WPM must be a number",
  }),
  accuracy: z.number({
    required_error: "Accuracy is required",
    invalid_type_error: "Accuracy must be a number",
  }),
  characters: z
    .string({
      required_error: "Characters summary is required",
    })
    .min(1, "Characters summary is required"),
});
