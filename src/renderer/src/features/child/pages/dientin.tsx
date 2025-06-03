import CoursesIcon from '@renderer/components/coursesIcon';
import styles from '../styles/courseCatalog.module.css'
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeethIconActive from '@renderer/components/teethIconActive';

export default function DentistScreen(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Pantalla dientin</h1>

      <p>aqui va dientin</p>

      <footer className={styles['navigation-footer']}>
        <button className={styles['nav-button']} onClick={() => navigate('/')}>
          <CoursesIcon />
          <span>Cursos</span>
        </button>
        <button className={`${styles['nav-button']} ${styles.active}`}>
          <TeethIconActive />
          <span>Dientin</span>
        </button>
      </footer>
    </div>
  );
}
