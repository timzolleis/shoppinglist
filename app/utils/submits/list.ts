import { SubmitFunction } from '@remix-run/react';
import { LIST_INTENTS } from '~/routes/_app.lists';

export const LIST_SUBMITS = {
  DELETE: (submit: SubmitFunction, listId: string) => submit({intent: LIST_INTENTS.DELETE, listId}, {
    method: "POST",
    action: "/lists"
  })
}