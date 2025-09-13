import styles from './LogoutButton.module.css';
import { tokenStore } from '/src/store/store';
import { useNavigate } from 'react-router';


const LogoutButton = () => {
    const navigate = useNavigate();

    const logoutClick = () => {
        tokenStore.setToken(null);
        navigate('/auth/login/');
    };

    return (
      <button className={styles['button']} onClick={logoutClick}> Выйти </button>
    );
};


export default LogoutButton;