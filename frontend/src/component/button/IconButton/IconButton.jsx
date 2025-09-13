import styles from './IconButton.module.css';


const IconButton = ({ label, icon, onClick }) => {
    return (
      <button className={styles['button']} onClick={onClick}>
        <img className={styles['icon']} src={icon} />
        {label}
      </button>
    );
};


export default IconButton;