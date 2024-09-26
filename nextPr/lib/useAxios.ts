import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";

const useAxios = async (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: any
): Promise<any> => {
  const config: AxiosRequestConfig = {
    url,
    method,
    data,
  };

  try {
    const response = await axios(config);
    return response?.data || null;
  } catch (error) {
    return null;
  }
};

export default useAxios;
