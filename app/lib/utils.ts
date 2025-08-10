import { z } from 'zod';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ApiResponse, ValidationErrorResponse } from '../types/response.dto';

/**
 * Utility functions cho validation và form handling
 */

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validate form data với Zod schema
 */
export async function validateFormData<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; errors: Record<string, string[]> }> {
  try {
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData.entries());
    
    // Convert checkbox values to boolean and handle special types
    const data: Record<string, any> = {};
    for (const [key, value] of Object.entries(rawData)) {
      if (value === 'true' || value === 'false') {
        data[key] = value === 'true';
      } else if (value === 'on') {
        // HTML checkbox sends 'on' when checked
        data[key] = true;
      } else {
        data[key] = value;
      }
    }

    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      for (const issue of error.issues) {
        const path = issue.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      }
      return { success: false, errors };
    }
    
    // Unexpected error
    return {
      success: false,
      errors: { general: ['Đã xảy ra lỗi không mong muốn'] }
    };
  }
}
