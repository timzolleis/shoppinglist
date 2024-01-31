import { zfd } from 'zod-form-data';
import BarcodeScannerPage from '~/components/features/barcode/BarcodeScannerPage';


export const listSettingsSchemas = {
  update: zfd.formData({
    name: zfd.text(),
  }),
  createTag: zfd.formData({
    tagName: zfd.text(),
    color: zfd.text(),
  }),
  removeTag: zfd.formData({
    tagId: zfd.text(),

  }),
};

export type Result = {
  codeResult: {
    code: string
  }
}

const ListSettingsPage = () => {
  return (
    <div>
      <BarcodeScannerPage />
    </div>
  );
};

export default ListSettingsPage;