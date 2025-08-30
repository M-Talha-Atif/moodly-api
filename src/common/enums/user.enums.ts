// src/common/enums/user.enum.ts

// User roles
export enum UserRole {
  USER = 'user', // Standard user
  HOST = 'host', // Host/creator
  ADMIN = 'admin', // Platform admin
}

// Auth providers
export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

// Account status
export enum AccountStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}
