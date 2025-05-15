const getStatusColor = (status: string | undefined) => {
  switch (status) {
    case "Ordered":
      return "dark:bg-yellow-700 bg-yellow-200"; // Yellow for pending
    case "Delivered":
      return "dark:bg-green-700 bg-green-200"; // Blue for delivered
    case "Cancelled":
      return "dark:bg-rose-900 bg-red-200"; // Red for cancelled
    default:
      return "bg-gray-300"; // Gray for undefined or unknown status
  }
};

export default getStatusColor;
