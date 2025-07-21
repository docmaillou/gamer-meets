/**
 * Enhanced validation utilities with security measures
 */

import { PHONE_REGEX } from './constants';
import { SecurityUtils } from './security';

// Phone number validation with security
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber || typeof phoneNumber !== 'string') return false;
  
  // Sanitize input first
  const sanitized = SecurityUtils.sanitizePhoneNumber(phoneNumber);
  
  // Use existing regex but with sanitized input
  return PHONE_REGEX.test(sanitized);
};

// Enhanced phone number formatting
export const formatPhoneNumber = (phoneNumber: string, countryCode = '+1'): string => {
  if (!phoneNumber) return '';
  
  // Sanitize input first
  const sanitized = SecurityUtils.sanitizePhoneNumber(phoneNumber);
  
  // Remove all non-digits
  const digits = sanitized.replace(/\D/g, '');
  
  // If it already starts with country code, return as is
  if (sanitized.startsWith('+')) {
    return sanitized;
  }
  
  // Add country code if not present
  return `${countryCode}${digits}`;
};

// Enhanced email validation
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  // Sanitize input first
  const sanitized = SecurityUtils.sanitizeEmail(email);
  
  // Enhanced email regex that's more secure
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Additional checks
  if (sanitized.length > 254) return false; // RFC 5321 limit
  if (sanitized.includes('..')) return false; // No consecutive dots
  if (sanitized.startsWith('.') || sanitized.endsWith('.')) return false;
  
  return emailRegex.test(sanitized);
};

// Enhanced OTP validation
export const validateOTP = (otp: string): boolean => {
  if (!otp || typeof otp !== 'string') return false;
  
  const digits = otp.replace(/\D/g, '');
  return digits.length === 6 && /^\d{6}$/.test(digits);
};

// Enhanced bio validation
export const validateBio = (bio: string): boolean => {
  if (!bio || typeof bio !== 'string') return false;
  
  const sanitized = SecurityUtils.sanitizeUserInput(bio, 500);
  return sanitized.length >= 10 && sanitized.length <= 500;
};

// Enhanced meet title validation
export const validateMeetTitle = (title: string): boolean => {
  if (!title || typeof title !== 'string') return false;
  
  const sanitized = SecurityUtils.sanitizeUserInput(title, 100);
  return sanitized.trim().length >= 3 && sanitized.trim().length <= 100;
};

// Enhanced meet description validation
export const validateMeetDescription = (description: string): boolean => {
  if (!description || typeof description !== 'string') return false;
  
  const sanitized = SecurityUtils.sanitizeUserInput(description, 1000);
  return sanitized.trim().length >= 10 && sanitized.trim().length <= 1000;
};

// Enhanced group name validation
export const validateGroupName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;
  
  const sanitized = SecurityUtils.sanitizeUserInput(name, 50);
  return sanitized.trim().length >= 2 && sanitized.trim().length <= 50;
};

// Enhanced group description validation
export const validateGroupDescription = (description: string): boolean => {
  if (!description || typeof description !== 'string') return false;
  
  const sanitized = SecurityUtils.sanitizeUserInput(description, 500);
  return sanitized.trim().length >= 10 && sanitized.trim().length <= 500;
};

// Additional secure validation functions

// Username validation
export const validateUsername = (username: string): boolean => {
  if (!username || typeof username !== 'string') return false;
  
  // Sanitize input first
  const sanitized = SecurityUtils.sanitizeString(username);
  
  // 3-30 characters, alphanumeric and underscores only, no consecutive underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  
  return (
    usernameRegex.test(sanitized) &&
    !sanitized.includes('__') &&        // No consecutive underscores
    !sanitized.startsWith('_') &&       // Cannot start with underscore
    !sanitized.endsWith('_')            // Cannot end with underscore
  );
};

// Display name validation
export const validateDisplayName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;
  
  const sanitized = SecurityUtils.sanitizeUserInput(name, 50);
  const nameRegex = /^[a-zA-Z0-9\s._-]{2,50}$/;
  
  return (
    nameRegex.test(sanitized) &&
    sanitized.trim().length >= 2 &&
    sanitized.trim().length <= 50 &&
    !sanitized.includes('  ')           // No consecutive spaces
  );
};

// Password validation
export const validatePassword = (password: string): boolean => {
  if (!password || typeof password !== 'string') return false;
  
  // More comprehensive password validation
  return (
    password.length >= 8 &&
    password.length <= 128 &&
    /[A-Z]/.test(password) &&        // At least one uppercase letter
    /[a-z]/.test(password) &&        // At least one lowercase letter
    /\d/.test(password) &&           // At least one digit
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password) // At least one special character
  );
};

// Age validation
export const validateAge = (age: number): boolean => {
  return Number.isInteger(age) && age >= 13 && age <= 120;
};

// URL validation
export const validateURL = (url: string): boolean => {
  return SecurityUtils.validateURL(url);
};

// File size validation (in bytes)
export const validateFileSize = (sizeInBytes: number, maxSizeMB: number = 5): boolean => {
  return Number.isInteger(sizeInBytes) && 
         sizeInBytes > 0 && 
         sizeInBytes <= (maxSizeMB * 1024 * 1024);
};

// Image file validation
export const validateImageFile = (file: { type: string; size: number }): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];
  
  // Check MIME type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    errors.push('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
  }
  
  // Check file size (max 5MB)
  if (!validateFileSize(file.size, 5)) {
    errors.push('File size too large. Maximum 5MB allowed.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitization helper for form inputs
export const sanitizeFormInput = {
  phoneNumber: (input: string) => SecurityUtils.sanitizePhoneNumber(input),
  email: (input: string) => SecurityUtils.sanitizeEmail(input),
  text: (input: string, maxLength: number = 500) => SecurityUtils.sanitizeUserInput(input, maxLength),
  username: (input: string) => SecurityUtils.sanitizeString(input).toLowerCase(),
  displayName: (input: string) => SecurityUtils.sanitizeUserInput(input, 50),
};

// Rate limiting validation for API calls
export const validateRateLimit = (operation: string, maxRequests: number = 5, windowMs: number = 60000): boolean => {
  return SecurityUtils.checkRateLimit(operation, maxRequests, windowMs);
};