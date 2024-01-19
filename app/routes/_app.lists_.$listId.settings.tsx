import { json, LoaderFunctionArgs } from '@remix-run/node';
import { requireRouteParam } from '~/utils/general/request.server';
import { requireAuthentication } from '~/utils/auth/authentication.server';
import { findListWithOwnerAndTagsById, updateList } from '~/models/list.server';
import { requireListOwnership } from '~/utils/list/list.server';
import { Form, useFetcher, useLoaderData } from '@remix-run/react';
import { invariantResponse } from '@epic-web/invariant';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { zfd } from 'zod-form-data';
import { getErrorMessage, getFormErrors } from '~/utils/error/error.server';
import { useEffect, useRef, useState } from 'react';
import { Color, colorToCss, getBackgroundColor, getRandomColor, rgbToHex } from '~/utils/colors/colors';
import { RefreshCcw } from 'lucide-react';
import { createTagForList, removeTagForList } from '~/models/tag.server';
import { createId } from '@paralleldrive/cuid2';
import { ListTag } from '~/components/features/list/list-tag';
import { useTranslation } from 'react-i18next';
import { jsonWithSuccess } from 'remix-toast';
import i18next from '~/i18next.server';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const listId = requireRouteParam('listId', params);
  const user = await requireAuthentication(request);
  const list = await findListWithOwnerAndTagsById(listId);
  invariantResponse(list, 'List not found');
  requireListOwnership(list, user);
  const randomColor = getRandomColor();
  return json({ list, randomColor });
};

export const listSettingsSchemas = {
  update: zfd.formData({
    name: zfd.text()
  }),
  createTag: zfd.formData({
    tagName: zfd.text(),
    color: zfd.text()
  }),
  removeTag: zfd.formData({
    tagId: zfd.text()

  })
};


export const LIST_SETTINGS_INTENTS = {
  UPDATE: 'update',
  REMOVE_TAG: 'remove-tag',
  ADD_TAG: 'add-tag'
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await requireAuthentication(request);
  const listId = requireRouteParam('listId', params);
  const formData = await request.formData();
  const intent = formData.get('intent')?.toString();
  const messageTranslations = await i18next.getFixedT(request, 'lists');
  switch (intent) {
    case LIST_SETTINGS_INTENTS.UPDATE: {
      try {
        const { name } = listSettingsSchemas.update.parse(formData);
        const list = await findListWithOwnerAndTagsById(listId);
        requireListOwnership(list, user);
        await updateList(listId, { name });
        return jsonWithSuccess({
          success: true
        }, messageTranslations('toasts.listUpdated'));
      } catch (e) {
        return json({
          formErrors: getFormErrors(e),
          error: getErrorMessage(e)
        });
      }
    }
    case LIST_SETTINGS_INTENTS.ADD_TAG: {
      try {
        const { tagName, color } = listSettingsSchemas.createTag.parse(formData);
        await createTagForList({
          listId, name: tagName, color
        });
        return json({ success: true });
      } catch (e) {
        return json({
          formErrors: getFormErrors(e),
          error: getErrorMessage(e)
        });
      }
    }
    case LIST_SETTINGS_INTENTS.REMOVE_TAG: {
      try {
        const { tagId } = listSettingsSchemas.removeTag.parse(formData);
        await removeTagForList({
          listId, tagId
        });
        return json({ success: true });
      } catch (e) {
        return json({
          formErrors: getFormErrors(e),
          error: getErrorMessage(e)
        });
      }
    }
  }
  return json({ error: 'Invalid intent' });
};

const ListSettingsPage = () => {
  const { list, randomColor } = useLoaderData<typeof loader>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [tagColor, setTagColor] = useState<Color>(randomColor);
  const fetcher = useFetcher();
  const { t } = useTranslation('lists');
  const optimisticTags = [
    ...list.tags
  ];
  if (fetcher.formData) {
    optimisticTags.push({
      id: createId(),
      name: fetcher.formData.get('tagName')?.toString() ?? '',
      color: fetcher.formData.get('color')?.toString() ?? ''
    });
  }

  useEffect(() => {
    if (fetcher.formData && inputRef.current) {
      inputRef.current.value = '';
      setTagColor(getRandomColor());
    }
  }, [fetcher.formData]);

  return <div>
    <main className={'grid gap-10 mt-6'}>
      <Form id={'generalSettingsForm'} method={'post'}>
        <div className={'space-y-3'}>
          <Label htmlFor={'name'}>{t('list.fields.name.label')}</Label>
          <Input id={'name'} name={'name'} defaultValue={list.name}></Input>
        </div>
        <div className={'flex justify-start mt-5'}>
          <Button size={'sm'} name={'intent'} value={LIST_SETTINGS_INTENTS.UPDATE}>{t('list.buttons.update')}</Button>
        </div>
      </Form>
      <fetcher.Form id={'tagForm'} method={'post'}>
        <div className={'space-y-5'}>
          <div className={'space-y-3'}>
            <Label>{t('list.fields.name.label')}</Label>
            <div className={'flex items-center gap-4'}>
              <Input ref={inputRef} id={'tagName'} name={'tagName'} className={'w-full'}
                     placeholder={'Create new tag...'}></Input>
              <input type="hidden" name={'color'} value={rgbToHex(tagColor)} />
              <input type="hidden" name={'intent'} value={LIST_SETTINGS_INTENTS.ADD_TAG} />
              <button type={'button'} onClick={() => setTagColor(getRandomColor())}
                      className={'rounded-md p-2 hover:cursor-pointer'} style={{
                color: colorToCss(tagColor),
                background: colorToCss(getBackgroundColor(tagColor)),
                borderWidth: '1px',
                borderColor: colorToCss(tagColor)
              }}><RefreshCcw className={'w-4 h-4'} style={{ color: colorToCss(tagColor) }} /></button>
              <Button form={'tagForm'} size={'sm'}>{t('list.buttons.createTag')}</Button>
            </div>
          </div>
          <div className={'flex flex-wrap gap-2'}>
            {optimisticTags.map(tag => (<ListTag key={tag.id} listId={list.id} tag={tag} />))}
          </div>
      </div>
      </fetcher.Form>
    </main>
  </div>;
};

export default ListSettingsPage;