import styles from './NavigateButton.module.css';
import { NavLink } from 'react-router';


const NavigateButton = ({ label, to }) => {
    return (
      <NavLink className={styles['button']} to={to}> {label} </NavLink>
    );
};


export default NavigateButton;