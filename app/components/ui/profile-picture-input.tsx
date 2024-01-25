import React from 'react';

export interface ProfilePictureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: string;
}

export const ProfilePictureInput = React.forwardRef<HTMLInputElement, ProfilePictureInputProps>((props, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [name, setName] = React.useState<string | undefined>('input_not_modified');
  const [preview, setPreview] = React.useState<string | undefined>(props.defaultValue);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      const result = fileReader.result;
      setPreview(String(result));
      setName(props.name || 'profilePicture');
    };
  };
  return (
    <div className={'rounded-full'}>
      <input name={name} onChange={(event) => handleFileChange(event)} ref={inputRef} accept="image/png, image/jpeg"
             multiple={false} type="file" autoComplete="off" id="avatarUrl"
             className={'hidden'} />
      <div tabIndex={0} onKeyDown={(event) => console.log(event)} role={'button'} onClick={() => {
        if (inputRef.current) {
          inputRef.current.click();
        }
      }} className={'focus:ring focus:ring-ring rounded-full w-max'}>
        <img className={'rounded-full object-cover w-20 h-20'} src={preview} alt={'profile'} />
      </div>

    </div>
  );
});
ProfilePictureInput.displayName = 'ProfilePictureInput';