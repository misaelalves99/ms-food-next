'use client';

import styles from './Orders.module.css';
import { useEffect, useContext, useState, ChangeEvent } from 'react';
import { OrdersContext } from '../context/OrdersContext'; // importa só o contexto
import type { Order } from '../types/order';               // importa só o tipo

interface Status {
  id: number;
  tipo: string;
}

const Orders = () => {
  const context = useContext(OrdersContext);
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    if (!context) return;

    const fetchOrdersAndStatuses = async () => {
      try {
        const [ordersResponse, statusesResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/comidas`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/status`),
        ]);

        const ordersData: Order[] = await ordersResponse.json();
        const statusesData: Status[] = await statusesResponse.json();

        context.setOrders(ordersData);
        setStatuses(statusesData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchOrdersAndStatuses();
  }, [context]);

  if (!context) return <p>Carregando contexto...</p>;

  const { orders, setOrders } = context;

  // Atualiza status do pedido
  const handleStatusChange = async (orderId: number, newStatus: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comidas/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setOrders((prevOrders: Order[]) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar o status:', error);
    }
  };

  // Cancela pedido
  const handleCancelOrder = async (orderId: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comidas/${orderId}`, {
        method: 'DELETE',
      });

      setOrders((prevOrders: Order[]) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
    } catch (error) {
      console.error('Erro ao cancelar o pedido:', error);
    }
  };

  return (
    <div className={styles.orders}>
      <h1>Pedidos</h1>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableRowHover}>
            <th className={styles.tableHeader}>#</th>
            <th className={styles.tableHeader}>Cliente</th>
            <th className={styles.tableHeader}>Acompanhamentos</th>
            <th className={styles.tableHeader}>Carne</th>
            <th className={styles.tableHeader}>Salada</th>
            <th className={styles.tableHeader}>Massas</th>
            <th className={styles.tableHeader}>Suco</th>
            <th className={styles.tableHeader}>Refrigerante</th>
            <th className={styles.tableHeader}>Status</th>
            <th className={styles.tableHeader}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id} className={styles.tableRowHover}>
              <td className={styles.tableCell}>{index + 1}</td>
              <td className={styles.tableCell}>{order.nome}</td>
              <td className={styles.tableCell}>{order.acompanhamentos}</td>
              <td className={styles.tableCell}>{order.carne}</td>
              <td className={styles.tableCell}>{order.salada}</td>
              <td className={styles.tableCell}>{order.massa}</td>
              <td className={styles.tableCell}>
                {Array.isArray(order.suco) ? (
                  <ul className={styles.listSquare}>
                    {order.suco.map((item, i) => (
                      <li key={i} className={styles.listItemSpacing}>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  order.suco
                )}
              </td>
              <td className={styles.tableCell}>
                {Array.isArray(order.refrigerante) ? (
                  <ul className={styles.listSquare}>
                    {order.refrigerante.map((item, i) => (
                      <li key={i} className={styles.listItemSpacing}>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  order.refrigerante
                )}
              </td>
              <td className={styles.tableCell}>
                <select
                  className={styles.selectBox}
                  value={order.status}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleStatusChange(order.id, Number(e.target.value))
                  }
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.tipo}
                    </option>
                  ))}
                </select>
              </td>
              <td className={styles.tableCell}>
                <button
                  className={styles.cancelButton}
                  onClick={() => handleCancelOrder(order.id)}
                >
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
