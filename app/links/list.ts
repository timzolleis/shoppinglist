export const LIST_LINKS = {
  OVERVIEW: '/lists',
  DELETED: '/lists/deleted',
  NEW: '/lists/new',
  DETAILS: (listId?: string) => `/lists/${listId}`,
  SETTINGS: (listId?: string) => `/lists/${listId}/settings`


};