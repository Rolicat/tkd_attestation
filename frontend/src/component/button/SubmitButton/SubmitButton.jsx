import styles from './SubmitButton.module.css';


const SubmitButton = ({ label, onClick }) => {
    return (
      <button className={styles['button']} onClick={onClick}>{label}</button>
    );
};


export default SubmitButton;