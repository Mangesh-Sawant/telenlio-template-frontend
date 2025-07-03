export interface Template {
  _id?: string; // MongoDB ID, received from the backend
  user_id?: string;

  // These fields must match the Pydantic model
  title: string;
  html: string;
  css: string;
  example_data: Record<string, any>; // This represents a JSON object (Dict in Python)
}
