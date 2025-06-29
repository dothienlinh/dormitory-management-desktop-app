import { AxiosResponse, isAxiosError } from "axios";

export const fetchAPI = async (callback: Promise<AxiosResponse>) => {
  try {
    const response = await callback;
    return {
      statusCode: response.status,
      data: response.data.data,
      message: response.data.message,
      success: response.data.success,
      total: response.data?.total ?? 0,
    };
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      throw {
        statusCode: error.response?.status || 500,
        ...error.response?.data,
        message: error.response?.data.message,
        success: error.response?.data.success,
      };
    }

    console.error("Unexpected error:", error);

    throw {
      statusCode: 500,
      message: "An unexpected error occurred",
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
