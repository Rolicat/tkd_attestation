import styles from './PhysicalDemandWidget.module.css';
import { useEffect, useState } from 'react';
import { postPhysicalDemandsAPI } from '../../../api/api';


const PhysicalDemandWidget = ({ demand, belt }) => {
    const [criteria, setCriteria] = useState(0);

    const changeCriteria = (value) => {
        setCriteria(value);
        postPhysicalDemandsAPI(demand.test.id, belt, value);
    };

    useEffect(() => {
      setCriteria(demand.criteria);
    }, [demand]);

    return (
      <div className={styles['container']}>
        <div className={styles['header']}>
          <div>
            {demand.test.name}
          </div>
          количество: <input className={styles['points']} type='text' value={criteria} onChange={e => changeCriteria(e.target.value)} />
        </div>
      </div>
    );
};


export default PhysicalDemandWidget;