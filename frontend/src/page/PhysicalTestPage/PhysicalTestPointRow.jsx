import styles from './PhysicalTestPage.module.css';
import cn from 'classnames';
import { useState } from 'react';
import { patchPhysicalTestPointsAPI } from '../../api/api';


const PhysicalTestPointRow = ({ record }) => {
    const [percent, setPercent] = useState(record.percent);

    const changePercent = (value) => {
        setPercent(value);
        patchPhysicalTestPointsAPI(record.id, value);
    };

    return (
      <div className={styles['row_menu']}>
        {record.points} балл
        <input className={cn(styles['width50'], styles['input'])}
          type='text' name='percent' value={percent}
          onChange={(e) => changePercent(e.target.value)}
        />
      </div>
    );
};

export default PhysicalTestPointRow;