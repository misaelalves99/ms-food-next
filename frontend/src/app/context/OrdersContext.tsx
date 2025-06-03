// src/context/OrdersContext.tsx

'use client';

import { createContext, useState, useEffect } from 'react';
import { Order } from '../types/order';
import { OrdersContextType, OrdersProviderProps } from '../../app/types/orders';

export const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

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
