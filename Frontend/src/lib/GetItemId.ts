import { ProductsInStorage } from "../Types/ProductsInStorage";
import { Ticket } from "../Types/Ticket";

const getItemId = (item: ProductsInStorage | Ticket): number => {
  if ("productInStorageId" in item) {
    return item.productInStorageId;
  }

  if ("ticketId" in item) {
    return item.ticketId;
  }

  throw new Error("Unknown item type");
};
export default getItemId;
