// app/components/Footer.tsx

import styles from './Footer.module.css';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <h1>
        © 2024 <Link href="/">MSFood</Link>. Todos os direitos reservados.
      </h1>
    </footer>
  );
};

export default Footer;
