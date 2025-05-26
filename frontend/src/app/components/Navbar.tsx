// app/components/Navbar.tsx

'use client';

import styles from './Navbar.module.css';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src={Logo} alt="Logo" width={120} height={40} />
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/orders">Pedidos</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
