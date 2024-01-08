import navigation from '~~/locales/en/navigation.json';
import lists from '~~/locales/en/lists.json';
import common from '~~/locales/en/common.json';
import authentication from '~~/locales/en/authentication.json';
import * as fs from 'fs';
import { execSync } from 'child_process';

export const resources = { authentication, common, lists, navigation } as const;

const translationRoot = 'public/locales';

type TranslationFile = { path: string; namespace: string };

function getTranslationFiles() {
  const root = 'public/locales/en';
  //Read all files
  const files = fs.readdirSync(root, { withFileTypes: true });
  //Loop for each file and get the name without extension
  return files.map((file) => {
    return {
      path: file.name,
      namespace: file.name.split('.')[0]
    };
  });
}

function writeImports(files: TranslationFile[]) {
  console.log('🔄Generating type imports...');
  const regexPattern = /import .+ from ['"].+\.json['"];/;
  //Remove all imports at the top of this file
  const file = fs.readFileSync('app/utils/locale/resources.ts', 'utf8');
  const lines = file.split('\n');
  const newLines = lines.filter((line) => !regexPattern.test(line));
  //Write the updated imports
  files.forEach((file) =>
    newLines.unshift(`import ${file.namespace} from '~~/locales/en/${file.path}';`)
  );
  const newContent = getNewResourcesObject(newLines.join('\n'), files);
  fs.writeFileSync('app/utils/locale/resources.ts', newContent);
  console.log('✅ Successfully generated type imports');
}

function getNewResourcesObject(data: string, files: TranslationFile[]) {
  const newContent = files.map((file) => file.namespace).join(',\n');
  const regexPattern = /export const resources = \{[^}]*} as const;/;
  return data.replace(regexPattern, `export const resources = { ${newContent} } as const;`);
}

function formatFile() {
  execSync('prettier --write app/utils/locale/resources.ts');
}

function checkIfFileIsPresentInEveryNamespace(fileName: string) {
  const namespaces = fs.readdirSync(translationRoot);
  namespaces.forEach((namespace) => {
    const files = fs.readdirSync(`${translationRoot}/${namespace}`);
    if (!files.includes(fileName)) {
      console.error(`⚠️ WARNING: File ${fileName} is missing in namespace ${namespace}`);
    }
  });
}

function testFiles() {
  const translationFiles = getTranslationFiles();
  translationFiles.forEach((file) => {
    checkIfFileIsPresentInEveryNamespace(file.path);
  });
}

testFiles();
writeImports(getTranslationFiles());
formatFile();
