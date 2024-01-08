export const LIST_LINKS = {
  OVERVIEW: '/lists',
  DELETED: '/lists/deleted',
  NEW: '/lists/new',
  DETAILS: (listId?: string) => `/lists/${listId}`,
  SETTINGS: (listId?: string) => `/lists/${listId}/settings`,
  MEMBERS: (listId?: string) => `/lists/${listId}/members`,
  INVITES: (listId?: string) => `/lists/${listId}/invites`,
  INVITES_NEW: (listId?: string) => `/lists/${listId}/invites/new`


};