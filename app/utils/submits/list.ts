import { SubmitFunction } from '@remix-run/react';
import { LIST_INTENTS } from '~/routes/_app.lists._index';
import { List } from '@prisma/client';
import { DELETED_LIST_INTENTS } from '~/routes/_app.lists.deleted';

export const LIST_SUBMITS = {
  DELETE: (submit: SubmitFunction, listId: List['id']) => submit({ intent: LIST_INTENTS.DELETE, listId }, {
    method: 'POST',
    action: '/lists?index'
  }),
  SET_DEFAULT: (submit: SubmitFunction, listId: List['id']) => submit({ intent: LIST_INTENTS.SET_DEFAULT, listId }, {
    method: 'POST',
    action: '/lists?index'
  }),
  UNSET_DEFAULT: (submit: SubmitFunction) => submit({ intent: LIST_INTENTS.UNSET_DEFAULT }, {
    method: 'POST',
    action: '/lists?index'
  }),
  RECOVER: (submit: SubmitFunction, listId: List['id']) => submit({ intent: DELETED_LIST_INTENTS.RECOVER, listId }, {
    method: 'POST',
    action: '/lists/deleted'
  }),
  HARD_DELETE: (submit: SubmitFunction, listId: List['id']) => submit({ intent: DELETED_LIST_INTENTS.DELETE, listId }, {
    method: 'POST',
    action: '/lists/deleted'
  })
};