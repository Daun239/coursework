const getStatusColor = (status: string | undefined) => {
  switch (status) {
    case "Ordered":
      return "bg-yellow-200"; // Yellow for pending
    case "Shipped":
      return "bg-green-200"; // Green for shipped
    case "Delivered":
      return "bg-green-200"; // Blue for delivered
    case "Cancelled":
      return "bg-red-200"; // Red for cancelled
    default:
      return "bg-gray-300"; // Gray for undefined or unknown status
  }
};

export default getStatusColor;
