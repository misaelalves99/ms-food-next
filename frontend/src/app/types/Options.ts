export interface OptionItem {
  id: string;
  tipo: string;
}

export interface Options {
  acompanhamentos: OptionItem[];
  carne: OptionItem[];
  salada: OptionItem[];
  massas: OptionItem[];
  suco: OptionItem[];
  refrigerante: OptionItem[];
}