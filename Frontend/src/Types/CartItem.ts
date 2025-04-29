import { ProductsInStorage } from "./ProductsInStorage";
import { Ticket } from "./Ticket";

type CartItem = {
  type: "ticket" | "product";
  data: Ticket | ProductsInStorage;
};

export default CartItem;
