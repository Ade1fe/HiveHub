import { toast } from "sonner";

const getFirstName = (fullName: string | null | undefined): string => {
  if (!fullName) {
    return 'Reader';
  }
  const nameParts = fullName.trim().split(' ');
  return nameParts[0] || 'Reader'; 
};


const showToastMessage = (message: string, type: "success" | "error" | "warning") => {
  switch (type) {
    case "success":
      toast.success(message, {
        position: "top-right",
        duration: 3000,
      });
      break;
    case "error":
      toast.error(message, {
        position: "top-right",
        duration: 3000,
      });
      break;
    case "warning":
      toast.warning(message, {
        position: "top-right",
        duration: 3000,
      });
      break;
    default:
      break;
  }
};


export { getFirstName, showToastMessage };