import { toast } from "react-toastify";
export const alertError = (message, position = "top-center") => {
    toast.error(message, {
      position: position,
      autoClose: 1000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };
  export const alertSuccess = (message, position = "top-center") => {
    toast.success(message, {
      position: position,
      autoClose: 1000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };