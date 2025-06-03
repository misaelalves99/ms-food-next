// app/types/orders.ts

import { Order } from './order';

export interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

export interface OrdersProviderProps {
  children: React.ReactNode;
}
