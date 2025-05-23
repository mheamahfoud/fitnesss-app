// auth.ts or similar
export const checkPermissions = (userRole: string, requiredRole: string) => {
  const permissions: Record<string, string[]> = {
    trainer: ['dashboard', 'create-programs', 'my-programs'],
    user: ['dashboard', 'workouts', 'browse-programs']
  };
  return permissions[userRole]?.includes(requiredRole);
};