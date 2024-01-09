import fs from 'fs';
import { TranslationFile } from '~/utils/locale/parser';
import * as path from 'path';

export const resourceFileRoot = 'app/utils/locale/resources.ts';
const tsAliasedReferenceImportPath = '@/locales/en';

export function writeImports(files: TranslationFile[]) {
  console.log('🔄Generating type imports...');
  const regexPattern = /import .+ from ['"].+\.json['"];/;
  //Remove all imports at the top of this file
  const file = fs.readFileSync(resourceFileRoot, 'utf8');
  const lines = file.split('\n');
  const newLines = lines.filter((line) => !regexPattern.test(line));
  //Write the updated imports
  files.forEach((file) => {
      const importPath = path.join(tsAliasedReferenceImportPath, file.path);
      newLines.unshift(`import ${file.name} from '${importPath}';`);
    }
  );
  const newContent = getNewResourcesObject(newLines.join('\n'), files);
  fs.writeFileSync('app/utils/locale/resources.ts', newContent);
  console.log('✅ Successfully generated type imports');
}

function getNewResourcesObject(data: string, files: TranslationFile[]) {
  const newContent = files.map((file) => file.name).join(',\n');
  const regexPattern = /export const resources = \{[^}]*} as const;/;
  return data.replace(regexPattern, `export const resources = { ${newContent} } as const;`);
}
