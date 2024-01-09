import * as fs from 'fs';
import * as path from 'path';
import { localesRoot, referenceLocale, reportFile, reportRoot } from '~/utils/locale/index';
import * as prettier from 'prettier';
import { getNowAsISO } from '~/utils/date/date';

export type TranslationFile = {
  path: string;
  name: string;
  locale: string;
}

type Namespace = {
  name: string;
  files: TranslationFile[];

}

function getLocales() {
  return fs.readdirSync(localesRoot, { withFileTypes: true }).filter(file => file.isDirectory());
}

export function getTranslationFiles(localesRoot: string) {
  try {
    const locales = getLocales();
    return locales.flatMap(locale => getTranslationFilesForLocale(locale.name, localesRoot));
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : JSON.stringify(e);
    console.log('ERROR: Unable to get translation files: ', errorMessage);
  }
}

function getTranslationFilesForLocale(locale: string, localesRoot: string): TranslationFile[] {
  const translationFilesPath = path.join(localesRoot, locale);
  const files = fs.readdirSync(translationFilesPath, { withFileTypes: true });
  return files.map(file => {
    return {
      path: file.name,
      name: file.name.split('.')[0],
      locale
    };
  });
}

export function compareTranslationFiles(files: TranslationFile[], localesRoot: string) {
  //Create an array of each NS for each locale
  const namespaces: Namespace[] = [];
  files.forEach(file => {
    //Check if the namespace already exists
    const namespace = namespaces.find(ns => ns.name === file.name);
    if (namespace) {
      namespace.files.push(file);
    } else {
      namespaces.push({
        name: file.name,
        files: [file]
      });
    }
  });

  //Compare the JSON files of each NS for each locale
  const namespaceReport = namespaces.map(namespace => {
    const referenceFile = namespace.files.find(file => file.locale === referenceLocale);
    if (!referenceFile) {
      console.log(`ERROR: Reference JSON file not found for namespace ${namespace.name}`);
      return;
    }
    //Read the reference file and parse it
    const referenceFilePath = path.join(localesRoot, referenceLocale, referenceFile.path);
    const referenceFileContent = fs.readFileSync(referenceFilePath, 'utf8');
    const referenceFileJSON = JSON.parse(referenceFileContent);
    //Compare all files for this namespace
    const fileResults = namespace.files.map(file => {
      const filePath = path.join(localesRoot, file.locale, file.path);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const fileJSON = JSON.parse(fileContent);
      const missingKeys = findMissingKeys(referenceFileJSON, fileJSON);
      return {
        filePath,
        locale: file.locale,
        missingKeys
      };
    }).filter(fileResult => fileResult.missingKeys.length > 0);
    return { namespace: namespace.name, results: fileResults };
  }).filter(result => result?.results.some(fileResult => fileResult.missingKeys.length > 0));
  //Check if all files are present in each namespace
  const missingFiles = getLocales().flatMap(locale => getMissingFilesForLocale(locale.name));


  return {
    generatedAt: getNowAsISO(),
    namespaces: namespaceReport,
    missingFiles
  };

}

type JSONObject = { [key: string]: JSONObject }

function findMissingKeys(referenceObj: JSONObject, targetObj: JSONObject, path = '') {
  const missingKeys: string[] = [];
  for (const key in referenceObj) {
    if (targetObj[key] === undefined) {
      missingKeys.push(`${path}${key}`);
    } else if (typeof referenceObj[key] === 'object') {
      missingKeys.push(...findMissingKeys(referenceObj[key], targetObj[key], `${path}${key}.`));
    }
  }
  return missingKeys;
}

export async function writeParseReport(report: ReturnType<typeof compareTranslationFiles>) {
  //Write the report file
  const reportFilePath = path.join(reportRoot, reportFile);
  const formatted = await prettier.format(JSON.stringify(report), { parser: 'json' });
  fs.writeFileSync(reportFilePath, formatted);
}

function getMissingFilesForLocale(locale: string) {
  //Get all referenceFiles
  const missingFiles: string[] = [];
  const referenceFilesPath = path.join(localesRoot, referenceLocale);
  const referenceFiles = fs.readdirSync(referenceFilesPath, { withFileTypes: true });
  //Go through each reference file and check if it is present in the given locale
  referenceFiles.forEach(referenceFile => {
    const localeFilePath = path.join(localesRoot, locale, referenceFile.name);
    if (!fs.existsSync(localeFilePath)) {
      missingFiles.push(localeFilePath);
    }
  });
  return missingFiles;
}