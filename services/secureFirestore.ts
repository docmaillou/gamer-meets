/**
 * Secure Firestore service with built-in security measures
 */

import {
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Query,
  DocumentReference,
  CollectionReference,
  WhereFilterOp,
  OrderByDirection,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { SecurityUtils, FirebaseSecurityUtils, AuthSecurityUtils } from '@/utils/security';

/**
 * Secure Firestore operations with built-in validation and sanitization
 */
export class SecureFirestore {
  /**
   * Get current authenticated user ID
   */
  private static getCurrentUserId(): string | null {
    return auth.currentUser?.uid || null;
  }

  /**
   * Validate user is authenticated
   */
  private static validateAuth(): void {
    if (!this.getCurrentUserId()) {
      throw new Error('User must be authenticated');
    }
  }

  /**
   * Validate user owns the document or has permission
   */
  private static validateOwnership(documentUserId: string, requiredRole?: string): void {
    const currentUserId = this.getCurrentUserId();
    
    if (!currentUserId) {
      throw new Error('User must be authenticated');
    }

    // Check if user owns the document
    if (documentUserId === currentUserId) {
      return;
    }

    // Check if user has required role (for admin/moderator actions)
    if (requiredRole) {
      // In a real app, you'd fetch user roles from Firestore
      // For now, we'll assume only document owners can modify their data
      throw new Error('Insufficient permissions');
    }

    throw new Error('Access denied');
  }

  /**
   * Secure document creation
   */
  static async createDocument(
    collectionName: string,
    documentId: string,
    data: any,
    options: { requireAuth?: boolean; validateOwnership?: boolean } = {}
  ): Promise<void> {
    const { requireAuth = true, validateOwnership = true } = options;

    // Validate authentication
    if (requireAuth) {
      this.validateAuth();
    }

    // Validate document ID
    if (!FirebaseSecurityUtils.validateDocumentId(documentId)) {
      throw new Error('Invalid document ID');
    }

    // Sanitize data
    const sanitizedData = FirebaseSecurityUtils.sanitizeFirestoreData(data);

    // Add security metadata
    const secureData = {
      ...sanitizedData,
      createdAt: new Date(),
      createdBy: this.getCurrentUserId(),
      updatedAt: new Date(),
    };

    // Validate ownership if required
    if (validateOwnership && secureData.userId && secureData.userId !== this.getCurrentUserId()) {
      throw new Error('Cannot create document for another user');
    }

    try {
      const docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, secureData);
    } catch (error) {
      console.error('Error creating document:', error);
      throw new Error('Failed to create document');
    }
  }

  /**
   * Secure document read
   */
  static async getDocument(
    collectionName: string,
    documentId: string,
    options: { requireAuth?: boolean; validateOwnership?: boolean } = {}
  ): Promise<any> {
    const { requireAuth = true, validateOwnership = false } = options;

    // Validate authentication
    if (requireAuth) {
      this.validateAuth();
    }

    // Validate document ID
    if (!FirebaseSecurityUtils.validateDocumentId(documentId)) {
      throw new Error('Invalid document ID');
    }

    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();

      // Validate ownership if required
      if (validateOwnership && data.createdBy !== this.getCurrentUserId()) {
        throw new Error('Access denied');
      }

      return { id: docSnap.id, ...data };
    } catch (error) {
      console.error('Error getting document:', error);
      throw new Error('Failed to get document');
    }
  }

  /**
   * Secure document update
   */
  static async updateDocument(
    collectionName: string,
    documentId: string,
    updates: any,
    options: { requireAuth?: boolean; validateOwnership?: boolean } = {}
  ): Promise<void> {
    const { requireAuth = true, validateOwnership = true } = options;

    // Validate authentication
    if (requireAuth) {
      this.validateAuth();
    }

    // Validate document ID
    if (!FirebaseSecurityUtils.validateDocumentId(documentId)) {
      throw new Error('Invalid document ID');
    }

    // Get existing document to check ownership
    if (validateOwnership) {
      const existingDoc = await this.getDocument(collectionName, documentId, { validateOwnership: false });
      if (!existingDoc) {
        throw new Error('Document not found');
      }
      this.validateOwnership(existingDoc.createdBy || existingDoc.userId);
    }

    // Sanitize updates
    const sanitizedUpdates = FirebaseSecurityUtils.sanitizeFirestoreData(updates);

    // Add update metadata
    const secureUpdates = {
      ...sanitizedUpdates,
      updatedAt: new Date(),
      updatedBy: this.getCurrentUserId(),
    };

    // Remove fields that shouldn't be updated
    delete secureUpdates.createdAt;
    delete secureUpdates.createdBy;
    delete secureUpdates.id;

    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, secureUpdates);
    } catch (error) {
      console.error('Error updating document:', error);
      throw new Error('Failed to update document');
    }
  }

  /**
   * Secure document deletion
   */
  static async deleteDocument(
    collectionName: string,
    documentId: string,
    options: { requireAuth?: boolean; validateOwnership?: boolean } = {}
  ): Promise<void> {
    const { requireAuth = true, validateOwnership = true } = options;

    // Validate authentication
    if (requireAuth) {
      this.validateAuth();
    }

    // Validate document ID
    if (!FirebaseSecurityUtils.validateDocumentId(documentId)) {
      throw new Error('Invalid document ID');
    }

    // Get existing document to check ownership
    if (validateOwnership) {
      const existingDoc = await this.getDocument(collectionName, documentId, { validateOwnership: false });
      if (!existingDoc) {
        throw new Error('Document not found');
      }
      this.validateOwnership(existingDoc.createdBy || existingDoc.userId);
    }

    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  }

  /**
   * Secure collection query
   */
  static async queryCollection(
    collectionName: string,
    filters: Array<{
      field: string;
      operator: WhereFilterOp;
      value: any;
    }> = [],
    orderByField?: string,
    orderDirection: OrderByDirection = 'desc',
    limitCount?: number,
    options: { requireAuth?: boolean; userScope?: boolean } = {}
  ): Promise<any[]> {
    const { requireAuth = true, userScope = false } = options;

    // Validate authentication
    if (requireAuth) {
      this.validateAuth();
    }

    // Rate limiting
    const userId = this.getCurrentUserId();
    if (userId && !SecurityUtils.checkRateLimit(`query_${userId}`, 10, 60000)) {
      throw new Error('Rate limit exceeded');
    }

    try {
      let q = collection(db, collectionName) as Query;

      // Add user scope filter if required
      if (userScope && userId) {
        q = query(q, where('createdBy', '==', userId));
      }

      // Add filters
      filters.forEach(filter => {
        // Sanitize filter values
        const sanitizedValue = FirebaseSecurityUtils.sanitizeFirestoreData(filter.value);
        q = query(q, where(filter.field, filter.operator, sanitizedValue));
      });

      // Add ordering
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }

      // Add limit (max 100 to prevent abuse)
      if (limitCount) {
        const safeLimit = Math.min(limitCount, 100);
        q = query(q, limit(safeLimit));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error querying collection:', error);
      throw new Error('Failed to query collection');
    }
  }

  /**
   * Get user's own documents
   */
  static async getUserDocuments(
    collectionName: string,
    limitCount: number = 50
  ): Promise<any[]> {
    return this.queryCollection(
      collectionName,
      [],
      'createdAt',
      'desc',
      limitCount,
      { userScope: true }
    );
  }

  /**
   * Secure batch operations (placeholder for future implementation)
   */
  static async batchOperation(operations: Array<{
    type: 'create' | 'update' | 'delete';
    collection: string;
    documentId: string;
    data?: any;
  }>): Promise<void> {
    // Validate authentication
    this.validateAuth();

    // Limit batch size
    if (operations.length > 500) {
      throw new Error('Batch size too large');
    }

    // Validate all operations first
    for (const operation of operations) {
      if (!FirebaseSecurityUtils.validateDocumentId(operation.documentId)) {
        throw new Error(`Invalid document ID: ${operation.documentId}`);
      }
    }

    // TODO: Implement actual batch operations
    throw new Error('Batch operations not yet implemented');
  }
}

export default SecureFirestore;