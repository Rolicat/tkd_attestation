import styles from './IconButtonNoBG.module.css';


const IconButtonNoBG = ({ label, icon, onClick }) => {
    return (
      <button className={styles['button']} onClick={onClick}>
        <img className={styles['icon']} src={icon} />
        {label}
      </button>
    );
};


export default IconButtonNoBG;