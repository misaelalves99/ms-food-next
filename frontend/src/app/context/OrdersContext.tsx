'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { Order } from '../types/order'; // ajuste o caminho conforme sua estrutura

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

export const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

interface OrdersProviderProps {
  children: ReactNode;
}

export const OrdersProvider = ({ children }: OrdersProviderProps) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comidas`);
        if (!response.ok) throw new Error('Erro na resposta da API');
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      }
    };

    fetchOrders();
  }, []);

  const addOrder = (order: Order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, setOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};
