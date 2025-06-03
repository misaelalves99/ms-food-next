// app/page.tsx

'use client';

import styles from './Home.module.css';

import { useContext, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { OrdersContext } from './context/OrdersContext';

import { FormData } from './types/FormData';
import { Options } from './types/Options';
import { FormErrors } from './types/FormErrors';

export default function Home() {
  const context = useContext(OrdersContext);

  const [formData, setFormData] = useState<FormData>({
    nome: '',
    acompanhamentos: '',
    carne: '',
    salada: '',
    massa: '',
    suco: [],
    refrigerante: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [options, setOptions] = useState<Options>({
    acompanhamentos: [],
    carne: [],
    salada: [],
    massas: [],
    suco: [],
    refrigerante: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cardapio`);
        const data = await response.json();
        setOptions({
          acompanhamentos: data.acompanhamentos,
          carne: data.carne,
          salada: data.salada,
          massas: data.massas,
          suco: data['suco natural'],
          refrigerante: data.refrigerante,
        });
      } catch (error) {
        console.error('Erro ao buscar cardápio:', error);
      }
    };
    fetchOptions();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) newErrors.nome = 'O nome do cliente é obrigatório.';
    if (!formData.acompanhamentos) newErrors.acompanhamentos = 'Escolha um acompanhamento.';
    if (!formData.carne) newErrors.carne = 'Escolha uma carne.';
    if (!formData.salada) newErrors.salada = 'Escolha uma salada.';
    if (!formData.massa) newErrors.massa = 'Escolha uma massa.';
    if (!formData.suco.length) newErrors.suco = 'Escolha pelo menos um suco natural.';
    if (!formData.refrigerante.length) newErrors.refrigerante = 'Escolha pelo menos um refrigerante.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [id]: checked
          ? [...(prev[id as keyof FormData] as string[]), value]
          : (prev[id as keyof FormData] as string[]).filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!context) {
      alert('Contexto de pedidos indisponível.');
      return;
    }

    setIsSubmitting(true);

    const newOrder = {
      ...formData,
      status: 'Solicitado',
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comidas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) throw new Error('Erro ao enviar o pedido para o servidor');

      const savedOrder = await response.json();
      context.addOrder(savedOrder);
      alert('Pedido enviado com sucesso!');

      setFormData({
        nome: '',
        acompanhamentos: '',
        carne: '',
        salada: '',
        massa: '',
        suco: [],
        refrigerante: [],
      });
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      alert('Não foi possível enviar o pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.home}>
      <section className={styles.formSection}>
        <h1 className={styles.title}>Escolha o prato:</h1>
        <h2 className={styles.subtitle}>Feito com amor!</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="nome" className={styles.label}>Nome do cliente:</label>
          <input
            type="text"
            id="nome"
            placeholder="Digite seu nome"
            value={formData.nome}
            onChange={handleChange}
            className={styles.input}
            disabled={isSubmitting}
          />
          {errors.nome && <p className={styles.error}>{errors.nome}</p>}

          {(['acompanhamentos', 'carne', 'salada', 'massa'] as const).map((field) => {
            const optionItems = field === 'massa' ? options.massas : options[field];
            return (
              <div key={field}>
                <label htmlFor={field} className={styles.label}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <select
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={styles.select}
                  disabled={isSubmitting}
                >
                  <option value="">Selecione um alimento</option>
                  {(optionItems ?? []).map((item) => (
                    <option key={item.id} value={item.tipo}>
                      {item.tipo}
                    </option>
                  ))}
                </select>
                {errors[field] && (
                  <p className={styles.error}>{errors[field]}</p>
                )}
              </div>
            );
          })}

          {(['suco', 'refrigerante'] as const).map((field) => (
            <fieldset className={styles.fieldset} key={field} disabled={isSubmitting}>
              <legend className={styles.legend}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </legend>
              <div className={styles.checkboxGroup}>
                {(options[field] ?? []).map((item) => (
                  <label key={item.id}>
                    <input
                      type="checkbox"
                      value={item.tipo}
                      id={field}
                      checked={formData[field].includes(item.tipo)}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {item.tipo}
                  </label>
                ))}
              </div>
              {errors[field] && (
                <p className={styles.error}>{errors[field]}</p>
              )}
            </fieldset>
          ))}

          <button type="submit" disabled={isSubmitting} className={styles.button}>
            {isSubmitting ? 'Enviando...' : 'Fazer Pedido'}
          </button>
        </form>
      </section>
    </div>
  );
}
