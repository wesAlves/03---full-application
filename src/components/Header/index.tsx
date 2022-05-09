import Link from 'next/link';

import styles from './header.module.scss';

export default function Header() {
  // TODO
  return (
    <Link href="/">
      <img className={styles.logo} src="/images/Logo.svg" alt="logo" />
    </Link>
  );
}
