import { Toaster } from "sonner";

// @ts-ignore
const Toast = ({ showToast }: any) => {
  return (
    <div>
      <Toaster
        position='top-right'
        visibleToasts={2}
        dir='rtl'
        theme="light"
        invert={true}
        expand={true}
        richColors
        closeButton
      />
    </div>
  )
}

export default Toast