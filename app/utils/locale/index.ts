import { compareTranslationFiles, getTranslationFiles, writeParseReport } from '~/utils/locale/parser';
import { writeImports } from '~/utils/locale/importer';

//TODO: We maybe could speed things up with calculating the checksum of every file and storing it in a file - so we can know if we need to reparse and regenerate everything
export const localesRoot = 'public/locales';
export const referenceLocale = 'en';
export const reportRoot = 'app/utils/locale';
export const reportFile = 'translation-report.json';


function index() {
  //Get all translation files
  const files = getTranslationFiles(localesRoot);
  if (!files) {
    throw new Error('No translation files found');
  }
  //Generate report
  const report = compareTranslationFiles(files, localesRoot);
  //Check if the report is empty
  if (report.missingFiles.length === 0 && report.namespaces.every(namespace => namespace?.results.every(result => result.missingKeys.length === 0))) {
    console.log('✅ All translation files are up to date - no report generated');
  } else {
    //Write report to file
    const translationReportPath = `${reportRoot}/${reportFile}`;
    writeParseReport(report).then(() => console.log(`✅ Successfully generated translation report - please check ${translationReportPath} for more details`));
  }
  //Generate  type imports
  writeImports(files);
}

index();