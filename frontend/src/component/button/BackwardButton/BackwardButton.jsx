import { NavLink } from 'react-router';
import styles from './BackwardButton.module.css';

const BackwardButton = ({ to }) => {
    return (
      <NavLink className={styles['button']} to={to} > Назад </NavLink>
    );
};


export default BackwardButton;