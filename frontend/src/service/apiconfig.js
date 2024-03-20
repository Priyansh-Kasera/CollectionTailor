import { toast } from "react-toastify";
import { API_URL } from "../Utility/constants";
import axios from "axios";
import Loader from "../Components/Loader";
import { startLoader, stopLoader } from "../Utility/helper";

export const makeRequest = (
  url,
  type = "POST",
  data,
  callBack,
  isSilent = false
) => {
  if (!isSilent) {
    startLoader();
  }
  axios({
    method: type,
    url: `${API_URL}${url}`,
    data: data,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      //console.log("RESPNOSE>>>>>>>>", res.data);
      callBack(res.data);
    })
    .catch((err) => {
      //console.log(err);
      toast.error(err?.response?.data?.message || "Something wrong happened.");
    })
    .finally(() => {
      stopLoader();
    });
};

export const createPdfRequest = (url, type = "POST", data, callBack) => {
  startLoader();
  axios({
    method: type,
    url: `${API_URL}${url}`,
    data: data,
    withCredentials: true,
    responseType: "blob",
    headers: {
      "Content-Type": "application/pdf",
    },
  })
    .then((res) => {
      //console.log("RESPNOSE>>>>>>>>", res.data);
      callBack(res.data);
    })
    .catch((err) => {
      //console.log(err);
      toast.error("Something wrong happened.");
    })
    .finally(() => {
      stopLoader();
    });
};

export const createLeadgerPdf = (url, type = "POST", data, callBack) => {
  startLoader();
  axios({
    method: type,
    url: `${API_URL}${url}`,
    data: data,
    withCredentials: true,
    responseType: "blob",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      //console.log("RESPNOSE>>>>>>>>", res.data);
      callBack(res.data);
    })
    .catch((err) => {
      //console.log(err);
      toast.error("Something wrong happened.");
    })
    .finally(() => {
      stopLoader();
    });
};
