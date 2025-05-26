// src/types/order.ts

export interface Order {
  id: number;
  nome: string;
  acompanhamentos: string;
  carne: string;
  salada: string;
  massa: string;
  suco: string[];
  refrigerante: string[];
  status: number;
}
