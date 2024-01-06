import { List, Tag } from '@prisma/client';
import { X } from 'lucide-react';
import { useSubmit } from '@remix-run/react';
import { LIST_SUBMITS } from '~/utils/submits/list';
import { colorToCss, getBackgroundColor, hexToRgb } from '~/utils/colors/colors';
import { useNavigation } from 'react-router';
import { LIST_SETTINGS_INTENTS } from '~/routes/_app.lists_.$listId.settings';
import { cn } from '~/utils/css/css';

export const ListTag = ({ listId, tag }: { listId: List['id'], tag: Tag }) => {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isDeleting = navigation.formData?.get('intent') === LIST_SETTINGS_INTENTS.REMOVE_TAG && navigation.formData?.get('tagId') === tag.id;
  return <div
    className={cn('rounded-md px-2 py-1 border flex items-center gap-1 font-medium text-xs', isDeleting && 'opacity-50')}
    style={{
      background: colorToCss(getBackgroundColor(hexToRgb(tag.color))),
      color: tag.color,
      borderWidth: '1px',
      borderColor: tag.color
    }}><p>{tag.name}</p>
    <X className={'w-3 h-3'} style={{ color: tag.color }}
       onClick={() => LIST_SUBMITS.REMOVE_TAG(submit, listId, tag.id)}></X>
  </div>;

};