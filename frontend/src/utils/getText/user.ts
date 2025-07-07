import { Gender, UserStatus, UserStatusAccount } from "@/enums/user";

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
    case UserStatus.ACTIVE:
      return "Đang ở";
    case UserStatus.ABSENT:
      return "Tạm vắng";
    case UserStatus.INACTIVE:
      return "Đã rời đi";
    default:
      return status;
  }
};

export const getStatusAccountTextUser = (status: UserStatusAccount) => {
  switch (status) {
    case UserStatusAccount.PENDING:
      return "Chờ duyệt";
    case UserStatusAccount.APPROVED:
      return "Đã duyệt";
    case UserStatusAccount.REJECTED:
      return "Đã từ chối";
    case UserStatusAccount.BANNED:
      return "Đã khóa";
    default:
      return status;
  }
};

export const getStatusAccountColorUser = (status: UserStatusAccount) => {
  switch (status) {
    case UserStatusAccount.PENDING:
      return "bg-blue-100 text-blue-800";
    case UserStatusAccount.APPROVED:
      return "bg-green-100 text-green-800";
    case UserStatusAccount.REJECTED:
      return "bg-red-100 text-red-800";
    case UserStatusAccount.BANNED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
