import { Gender, UserStatus } from "@/enums";

export const getGenderTextUser = (gender: Gender) => {
  switch (gender) {
    case Gender.Male:
      return "Nam";
    case Gender.Female:
      return "Nữ";
    case Gender.Other:
      return "Khác";
    default:
      return gender;
  }
};

export const getStatusTextUser = (status: UserStatus) => {
  switch (status) {
    case UserStatus.Active:
      return "Đang ở";
    case UserStatus.Absent:
      return "Tạm vắng";
    case UserStatus.Inactive:
      return "Đã rời đi";
    default:
      return status;
  }
};

export const getStatusTextContract = (status: string) => {
  switch (status) {
    case "active":
      return "Đang hiệu lực";
    case "expired":
      return "Đã hết hạn";
    case "terminated":
      return "Đã chấm dứt";
    default:
      return status;
  }
};

export const getStatusColorContract = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "expired":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    case "terminated":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};
