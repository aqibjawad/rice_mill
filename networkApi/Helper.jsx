import Swal from "sweetalert2";

export const showErrorAlert = (msg) => {
  Swal.fire({
    title: "Alert",
    text: msg,
    icon: "question",
  });
};
