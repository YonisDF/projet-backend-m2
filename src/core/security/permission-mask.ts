export type PermissionMask = bigint;

export const PERMISSIONS_NONE: PermissionMask = 0n;

export const PERMISSIONS = {
  READ_NOTE: 1n << 0n, // 0001
  EDIT_NOTE: 1n << 1n, // 0010
  DELETE_NOTE: 1n << 2n, // 0100
  SHARE_NOTE: 1n << 3n, // 1000
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

export const ROLES = {
  READER: PERMISSIONS.READ_NOTE,
  EDITOR: PERMISSIONS.READ_NOTE | PERMISSIONS.EDIT_NOTE,
  OWNER:
    PERMISSIONS.READ_NOTE |
    PERMISSIONS.EDIT_NOTE |
    PERMISSIONS.DELETE_NOTE |
    PERMISSIONS.SHARE_NOTE,
} as const;

export type RoleKey = keyof typeof ROLES;
