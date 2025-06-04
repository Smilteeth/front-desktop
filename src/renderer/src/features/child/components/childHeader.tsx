import React from 'react';
import styles from '../styles/childHeader.module.css';

interface HeaderProps {
  childName: string;
  coins: number;
  profileAvatar?: string;
  onNotificationClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  childName,
  coins,
  profileAvatar = '👶',
  onNotificationClick
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.profileSection}>
        <div className={styles.profilePic}>
          {profileAvatar}
        </div>
        <span className={styles.childName}>{childName}</span>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.coins}>
          <div className={styles.coinIcon}>$</div>
          <span className={styles.coinAmount}>{coins}</span>
        </div>
        <button
          className={styles.notificationBtn}
          onClick={onNotificationClick}
          aria-label="Notificaciones"
        >
          📧
        </button>
      </div>
    </header>
  );
};
