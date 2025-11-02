import styles from './LabelCheckInput.module.css';


const LabelCheckInput = ({ label, name, id, checked, onChange }) => {
    return (
      <div className={styles['container']}>
        <label htmlFor={id}>{label}</label>
        <input className={styles['input']} type='checkbox' name={name}
               id={id} checked={checked}
               onChange={(e) => onChange(e.target.checked)}
        />
      </div>
    );
};


export default LabelCheckInput;