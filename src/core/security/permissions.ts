import type { PermissionMask } from './permission-mask';
import { PERMISSIONS_NONE } from './permission-mask';

export const hasPermissions = (
  mask: PermissionMask,
  required: PermissionMask,
): boolean => (mask & required) === required;

export const hasAnyPermission = (
  mask: PermissionMask,
  ...required: PermissionMask[]
): boolean => required.some((perm) => (mask & perm) !== 0n);

export const addPermissions = (
  mask: PermissionMask,
  add: PermissionMask,
): PermissionMask => mask | add;

export const removePermissions = (
  mask: PermissionMask,
  remove: PermissionMask,
): PermissionMask => mask & ~remove;

export const togglePermissions = (
  mask: PermissionMask,
  toggle: PermissionMask,
): PermissionMask => mask ^ toggle;

export const combinePermissions = (
  ...masks: PermissionMask[]
): PermissionMask => masks.reduce((acc, cur) => acc | cur, PERMISSIONS_NONE);

export const listPermissions = <T extends string>(
  mask: PermissionMask,
  registry: Record<T, PermissionMask>,
): T[] =>
  (Object.keys(registry) as T[]).filter((key) =>
    hasPermissions(mask, registry[key]),
  );
