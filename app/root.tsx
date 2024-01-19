import { json, LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import stylesheet from '~/tailwind.css';
import { authenticator } from '~/utils/auth/authentication.server';
import i18next from '~/i18next.server';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Toaster } from '~/components/ui/toaster';

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: stylesheet,
  },
];

export const loader = async ({request}: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const user = await authenticator.isAuthenticated(request);
  const userWithoutPassword = user ? { ...user, password: undefined } : null;
  return json({ locale, user: userWithoutPassword });
}

export const handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: 'common'
};

/**
 * Warning In latest versions you may find an error with useChangeLanguage hook, (see #107),
 * to solve it, copy the code of useChangeLanguage to your own app and use it
 * instead of the one provided by remix-i18next.
 * @param locale
 */
export function useChangeLanguage(locale: string) {
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);
}

export default function App() {
  const { locale } = useLoaderData<typeof loader>();

  const { i18n } = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Meta />
      <Links />
    </head>
    <body className={'dark font-inter'}>
    <Toaster />
    <Outlet />
    <ScrollRestoration />
    <Scripts />
    <LiveReload />
    </body>
    </html>
  );
}
