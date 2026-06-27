//exporting user type

export interface User {
  _id: string; // Clerk User ID
  name: string;
  email: string;
  profile_image: string;

  created_at: Date;
  updated_at: Date;
}

export interface Member {
  _id: string; // Clerk User ID
  name: string;
  profile_image: string;
  role: string;
}
