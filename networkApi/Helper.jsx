import Swal from "sweetalert2";

export const showErrorAlert = (msg) => {
  Swal.fire({
    title: "Alert",
    text: msg,
    icon: "question",
    willOpen: () => {
      Swal.getPopup().style.zIndex = "2000";
    },
    customClass: {
      popup: "custom-swal-popup",
    },
  });
};
