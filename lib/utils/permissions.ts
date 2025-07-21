import { ROLE_HIERARCHY, USER_ROLES } from '@/lib/constants'
import type { Database } from '@/types/database'

type UserRole = Database['public']['Tables']['users']['Row']['role']

/**
 * Permission utility functions following Single Responsibility Principle
 * Centralized permission logic for role-based access control
 */

/**
 * Checks if user has required permission level
 * @param userRole - Current user's role
 * @param requiredRole - Required role for access
 * @returns boolean indicating if user has sufficient permissions
 */
export function hasPermission(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  const userLevel = ROLE_HIERARCHY[userRole]
  const requiredLevel = ROLE_HIERARCHY[requiredRole]
  
  return userLevel >= requiredLevel
}

/**
 * Checks if user is admin
 * @param userRole - Current user's role
 * @returns boolean indicating if user is admin
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === USER_ROLES.ADMIN
}

/**
 * Checks if user is operator or higher
 * @param userRole - Current user's role
 * @returns boolean indicating if user is operator or admin
 */
export function isOperatorOrHigher(userRole: UserRole): boolean {
  return hasPermission(userRole, USER_ROLES.OPERATOR)
}

/**
 * Gets available actions based on user role
 * @param userRole - Current user's role
 * @returns array of available actions
 */
export function getAvailableActions(userRole: UserRole): string[] {
  const actions: string[] = ['view']
  
  if (isOperatorOrHigher(userRole)) {
    actions.push('create', 'edit')
  }
  
  if (isAdmin(userRole)) {
    actions.push('delete', 'manage_users')
  }
  
  return actions
}

/**
 * Filters navigation items based on user role
 * @param userRole - Current user's role
 * @param navigationItems - Array of navigation items
 * @returns filtered navigation items
 */
export function filterNavigationByRole<T extends { requiredRole: UserRole }>(
  userRole: UserRole,
  navigationItems: readonly T[]
): T[] {
  return navigationItems.filter(item => 
    hasPermission(userRole, item.requiredRole)
  )
}