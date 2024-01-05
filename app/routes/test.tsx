import { Drawer, DrawerTrigger, DrawerTitle, DrawerClose, DrawerContent, DrawerFooter, DrawerDescription, DrawerHeader } from '~/components/ui/drawer';
import { Button } from '~/components/ui/button';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ResponsiveDialog } from '~/components/ui/responsive-dialog';


const TestPage = () => {
  const [open, setOpen] = useState(false);
  useLayoutEffect(() => {
    setOpen(true)
  }, [])


  return (
    <ResponsiveDialog open={open} onClose={setOpen}>
      <p>This is a value</p>
    </ResponsiveDialog>
  )
}

export default TestPage;