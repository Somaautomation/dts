import { z } from 'zod';

function normalizeIndianPhone(input: string) {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 10) return digits;
  return input;
}

export const phoneSchema = z
  .string()
  .transform((v) => normalizeIndianPhone(v.trim()))
  .refine((v) => /^[6-9]\d{9}$/.test(v), 'Enter a valid 10-digit Indian mobile number');

export const otpSchema = z.string().regex(/^\d{6}$/, 'OTP must be 6 digits');

export const signupSchema = z.object({
  phone: phoneSchema,
  name: z.string().min(2).max(100),
  nameKannada: z.string().max(100).optional(),
  email: z.string().email().optional().or(z.literal('')),
  district: z.string().min(1),
  taluk: z.string().min(1),
  membershipType: z.enum([
    'SUPPORTER',
    'VOLUNTEER',
    'TEACHER_REPRESENTATIVE',
    'YOUTH_MEMBER',
    'WOMENS_WING',
    'COMMUNITY_LEADER',
  ]),
  otp: otpSchema,
});

export const grievanceSchema = z.object({
  category: z.enum([
    'ROADS', 'WATER', 'ELECTRICITY', 'EDUCATION', 'HEALTH',
    'GOVERNMENT_BENEFITS', 'SOCIAL_WELFARE', 'AGRICULTURE', 'EMPLOYMENT', 'OTHER',
  ]),
  subject: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  location: z.string().min(2),
  district: z.string().min(1),
  taluk: z.string().min(1),
  pincode: z.string().regex(/^\d{6}$/).optional(),
  attachments: z.array(z.string().url()).max(5).optional().default([]),
});

export const teacherRequestSchema = z.object({
  type: z.enum(['GRIEVANCE', 'TRANSFER', 'PROMOTION', 'PENSION', 'POLICY_FEEDBACK', 'REPRESENTATION', 'OTHER']),
  subject: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  attachments: z.array(z.string().url()).max(5).optional().default([]),
});

export const volunteerSchema = z.object({
  skills: z.array(z.string()).min(1).max(10),
  availability: z.enum(['weekends', 'evenings', 'full-time', 'flexible']),
  district: z.string().min(1),
  taluk: z.string().min(1),
  booth: z.string().optional(),
  experience: z.string().max(2000).optional(),
  motivation: z.string().max(2000).optional(),
});

export const teacherProfileSchema = z.object({
  teacherId: z.string().min(3).max(30),
  category: z.enum(['PRIMARY','HIGH_SCHOOL','PU_COLLEGE','DEGREE_COLLEGE','PRIVATE_AIDED','PRIVATE_UNAIDED','GOVERNMENT','RETIRED']),
  institution: z.string().min(2).max(200),
  designation: z.string().min(2).max(100),
  subject: z.string().max(100).optional(),
  yearsOfService: z.number().int().min(0).max(60),
  district: z.string().min(1),
  taluk: z.string().min(1),
});

export const eventRegistrationSchema = z.object({
  eventId: z.string().cuid(),
});

export const chatMessageSchema = z.object({
  sessionId: z.string().optional(),
  message: z.string().min(1).max(2000),
  language: z.enum(['en', 'kn']).default('en'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type GrievanceInput = z.infer<typeof grievanceSchema>;
export type TeacherRequestInput = z.infer<typeof teacherRequestSchema>;
export type VolunteerInput = z.infer<typeof volunteerSchema>;
