import styles from './LabelInput.module.css';


const LabelInput = ({ label, type, name, id, value, placeholder, onChange }) => {
    return (
      <div className={styles['container']}>
        <label htmlFor={id}>{label}</label>
        <input className={styles['input']} type={type} name={name}
               id={id} value={value} placeholder={placeholder}
               onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
};


export default LabelInput;