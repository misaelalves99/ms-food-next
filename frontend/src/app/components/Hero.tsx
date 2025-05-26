// app/components/Hero.tsx

import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroText}>
        <h1>Comida de qualidade</h1>
        <p>Aqui tem!</p>
      </div>
    </section>
  );
};

export default Hero;
