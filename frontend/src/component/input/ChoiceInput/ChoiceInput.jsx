import { useEffect, useState } from 'react';
import styles from './ChoiceInput.module.css';
import { getChoiceMenuAPI } from '../../../api/api';


const ChoiceInput = ({label, name, value, onChange, onItemClick}) => {
    const [choiceMenu, setChoiceMenu] = useState([]);

    useEffect(() => {
        getChoiceMenuAPI('api/participants/filter/', {'name': value}).then(data => data.success && setChoiceMenu(data.result));
    }, [value]);

    return (
      <div className={styles['container']}>
        <label htmlFor={name}>
          {label}:
        </label>
        <div className={styles['content']}>
          <input className={styles['choice_input']} type='text' id={name} value={value} name={name} onChange={(e) => onChange(e.target.value)}/> 
          {choiceMenu.length && <div className={styles['choice_input_submenu']}>
            {choiceMenu.map(el => <div key={el.id} className={styles['submenu_item']} onClick={() => onItemClick(el.id)}>
              {el.name} {el.belt}
            </div>)}
          </div> || ''}
        </div>
      </div>
    );
};


export default ChoiceInput;