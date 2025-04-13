import React from 'react';
import styles from '../styles/background.module.css';

const Background = () => {
  return (
    <div className={styles.background}>
      <div className={styles.contentOverlay} />
    </div>
  );
};

export default Background;
