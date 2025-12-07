import styles from './AgePeriodWidget.module.css';
import IconButton from '../../button/IconButton/IconButton';
import close_icon from '/close.png';
import plus_icon from '/plus.png';
import LabelInput from '../../input/LabelInput/LabelInput';
import { useState } from 'react';
import { postAgePeriodsAPI } from '../../../api/api';
import cn from 'classnames';

const AgePeriodWidget = ({setVisible}) => {
    const [ageFrom, setAgeFrom] = useState(0);
    const [ageTo, setAgeTo] = useState(0);
    const [showError, setShowError] = useState(false);

    const addAgePeriod = () => {
        if ((ageFrom > ageTo) || (ageFrom > 100) || (ageTo > 100)) {
            setShowError(true);
            return;
        }
        setShowError(false);
        postAgePeriodsAPI(ageFrom, ageTo);
        setVisible(false);
    };

    return (
      <div className={styles['container']}>
        <div className={styles['content']}>
          <LabelInput label='Возраст (лет) от' type='number' value={ageFrom} onChange={setAgeFrom} />
          <LabelInput label='Возраст (лет) до' type='number' value={ageTo} onChange={setAgeTo} />
        </div>
        <div className={cn(styles['content'], styles['error'])}>
          {showError && 'Ошибка. Проверьте ввод возрастов.'}
        </div>
        <div className={styles['menu']}>
          <IconButton icon={plus_icon} label='Добавить' onClick={() => {addAgePeriod();}} />
          <IconButton icon={close_icon} label='Закрыть' onClick={() => setVisible(false)} />
        </div>
      </div>
    );
};


export default AgePeriodWidget;