// Get status text in Vietnamese
export const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Chờ xử lý";
    case "investigating":
      return "Đang điều tra";
    case "resolved":
      return "Đã giải quyết";
    case "active":
      return "Đang hoạt động";
    case "completed":
      return "Đã hoàn thành";
    default:
      return status;
  }
};

// Get status color for badges
export const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "investigating":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "resolved":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "active":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "";
  }
};

// Get severity text in Vietnamese
export const getSeverityText = (severity: string) => {
  switch (severity) {
    case "low":
      return "Thấp";
    case "medium":
      return "Trung bình";
    case "high":
      return "Cao";
    default:
      return severity;
  }
};

// Get severity color for badges
export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "low":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "high":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};

// Get incident type text in Vietnamese
export const getIncidentTypeText = (type: string) => {
  switch (type) {
    case "curfew":
      return "Vi phạm giờ giới nghiêm";
    case "theft":
      return "Trộm cắp";
    case "noise":
      return "Gây ồn ào";
    case "fire_hazard":
      return "Nguy cơ cháy nổ";
    case "trespassing":
      return "Xâm nhập trái phép";
    case "rule_violation":
      return "Vi phạm nội quy";
    default:
      return type;
  }
};

// Format date and time
export const formatDateTime = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN");
};
