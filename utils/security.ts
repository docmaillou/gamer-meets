/**
 * Security utilities for input validation, sanitization, and protection
 */

import { Platform } from 'react-native';

/**
 * Input sanitization and validation utilities
 */
export class SecurityUtils {
  /**
   * Sanitize string input to prevent XSS and injection attacks
   */
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
  }

  /**
   * Validate and sanitize email input
   */
  static sanitizeEmail(email: string): string {
    const sanitized = this.sanitizeString(email).toLowerCase();
    // Only allow valid email characters
    return sanitized.replace(/[^a-z0-9@._-]/g, '');
  }

  /**
   * Validate and sanitize phone number
   */
  static sanitizePhoneNumber(phone: string): string {
    // Only allow digits, +, -, (, ), and spaces
    return phone.replace(/[^\d+\-() ]/g, '');
  }

  /**
   * Validate and sanitize user input for display names/bios
   */
  static sanitizeUserInput(input: string, maxLength: number = 500): string {
    if (!input) return '';
    
    const sanitized = this.sanitizeString(input);
    return sanitized.length > maxLength ? sanitized.substring(0, maxLength) : sanitized;
  }

  /**
   * Validate file paths to prevent directory traversal
   */
  static validateFilePath(path: string): boolean {
    if (!path || typeof path !== 'string') return false;
    
    // Check for directory traversal attempts
    const forbidden = ['../', '..\\', '../', '..\\\\'];
    const lowerPath = path.toLowerCase();
    
    return !forbidden.some(pattern => lowerPath.includes(pattern));
  }

  /**
   * Validate URL to prevent malicious redirects
   */
  static validateURL(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    
    try {
      const urlObj = new URL(url);
      // Only allow HTTP/HTTPS protocols
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  /**
   * Generate secure random ID
   */
  static generateSecureId(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Rate limiting utility (in-memory for client-side)
   */
  private static rateLimitMap = new Map<string, { count: number; timestamp: number }>();

  static checkRateLimit(key: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.rateLimitMap.get(key);

    if (!record) {
      this.rateLimitMap.set(key, { count: 1, timestamp: now });
      return true;
    }

    // Reset if window has passed
    if (now - record.timestamp > windowMs) {
      this.rateLimitMap.set(key, { count: 1, timestamp: now });
      return true;
    }

    // Check if limit exceeded
    if (record.count >= maxRequests) {
      return false;
    }

    // Increment counter
    record.count++;
    return true;
  }

  /**
   * Clean up expired rate limit entries
   */
  static cleanupRateLimit(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.rateLimitMap.forEach((record, key) => {
      if (now - record.timestamp > 300000) { // 5 minutes
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => this.rateLimitMap.delete(key));
  }
}

/**
 * Firebase/Firestore security utilities
 */
export class FirebaseSecurityUtils {
  /**
   * Validate Firestore document ID
   */
  static validateDocumentId(id: string): boolean {
    if (!id || typeof id !== 'string') return false;
    
    // Firestore document IDs cannot contain certain characters
    const invalidChars = /[\/\\#\?\[\]]/;
    return !invalidChars.test(id) && id.length <= 1500;
  }

  /**
   * Sanitize data before Firestore write
   */
  static sanitizeFirestoreData(data: any): any {
    if (data === null || data === undefined) return data;
    
    if (typeof data === 'string') {
      return SecurityUtils.sanitizeString(data);
    }
    
    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        return data.map(item => this.sanitizeFirestoreData(item));
      }
      
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        // Validate field names
        if (this.validateFieldName(key)) {
          sanitized[key] = this.sanitizeFirestoreData(value);
        }
      }
      return sanitized;
    }
    
    return data;
  }

  /**
   * Validate Firestore field names
   */
  private static validateFieldName(fieldName: string): boolean {
    if (!fieldName || typeof fieldName !== 'string') return false;
    
    // Field names cannot start with a dot or contain certain characters
    return !fieldName.startsWith('.') && 
           !fieldName.includes('..') && 
           !/[\[\]]/.test(fieldName);
  }

  /**
   * Create secure query parameters
   */
  static createSecureQuery(filters: Record<string, any>): Record<string, any> {
    const secureFilters: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(filters)) {
      if (this.validateFieldName(key)) {
        secureFilters[key] = this.sanitizeFirestoreData(value);
      }
    }
    
    return secureFilters;
  }
}

/**
 * Authentication security utilities
 */
export class AuthSecurityUtils {
  /**
   * Validate authentication token format
   */
  static validateAuthToken(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    
    // Basic JWT format validation (header.payload.signature)
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }

  /**
   * Check if user has required permissions
   */
  static hasPermission(userRoles: string[], requiredRole: string): boolean {
    if (!Array.isArray(userRoles)) return false;
    
    const roleHierarchy = {
      'admin': ['admin', 'moderator', 'user'],
      'moderator': ['moderator', 'user'],
      'user': ['user']
    };
    
    return userRoles.some(role => 
      roleHierarchy[role as keyof typeof roleHierarchy]?.includes(requiredRole)
    );
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Content security utilities
 */
export class ContentSecurityUtils {
  /**
   * Filter profanity and inappropriate content
   */
  static filterProfanity(text: string): string {
    if (!text) return '';
    
    // Basic profanity filter - in production, use a comprehensive library
    const profanityWords = [
      // Add appropriate words based on your content policy
      'spam', 'scam', 'fraud'
    ];
    
    let filtered = text;
    profanityWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '*'.repeat(word.length));
    });
    
    return filtered;
  }

  /**
   * Validate image content (basic MIME type check)
   */
  static validateImageMimeType(mimeType: string): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif'
    ];
    
    return allowedTypes.includes(mimeType.toLowerCase());
  }

  /**
   * Validate file size
   */
  static validateFileSize(sizeInBytes: number, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return sizeInBytes <= maxSizeBytes;
  }
}

// Initialize rate limit cleanup
if (__DEV__) {
  setInterval(() => {
    SecurityUtils.cleanupRateLimit();
  }, 300000); // Clean up every 5 minutes
}