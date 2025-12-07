import styles from './PhysicalDemandWidget.module.css';
import { useEffect, useState } from 'react';
import { postPhysicalDemandsAPI } from '../../../api/api';


const PhysicalDemandWidget = ({ demand, belt, agePeriod }) => {
    const [criteriaMale, setCriteriaMale] = useState(0);
    const [criteriaFemale, setCriteriaFemale] = useState(0);

    const changeCriteriaMale = (value) => {
        setCriteriaMale(value);
        postPhysicalDemandsAPI(demand.test.id, belt, agePeriod, value, criteriaFemale);
    };

    const changeCriteriaFemale = (value) => {
        setCriteriaFemale(value);
        postPhysicalDemandsAPI(demand.test.id, belt, agePeriod, criteriaMale, value);
    };

    useEffect(() => {
      setCriteriaMale(demand.criteria_male);
      setCriteriaFemale(demand.criteria_female);
    }, [demand]);

    return (
      <div className={styles['container']}>
        <div className={styles['header']}>
          <div>
            {demand.test.name}
          </div>
          количество (м): <input className={styles['points']} type='text' value={criteriaMale} onChange={e => changeCriteriaMale(e.target.value)} />
          количество (ж): <input className={styles['points']} type='text' value={criteriaFemale} onChange={e => changeCriteriaFemale(e.target.value)} />
        </div>
      </div>
    );
};


export default PhysicalDemandWidget;