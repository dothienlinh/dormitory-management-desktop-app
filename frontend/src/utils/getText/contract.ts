import { ContractStatus } from "@/enums/contract";

export const getStatusTextContract = (status: ContractStatus) => {
  switch (status) {
    case ContractStatus.ACTIVE:
      return "Đang hiệu lực";
    case ContractStatus.INACTIVE:
      return "Không hoạt động";
    case ContractStatus.CANCELLED:
      return "Đã hủy";
    default:
      return status;
  }
};

export const getStatusColorContract = (status: ContractStatus) => {
  switch (status) {
    case ContractStatus.ACTIVE:
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case ContractStatus.INACTIVE:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    case ContractStatus.CANCELLED:
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};
