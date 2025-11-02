import { postAdditionalTestDemandAPI, removeAdditionalTestDemandAPI } from '../../../api/api';
import { useState } from 'react';
import styles from './AdditionalDemandWidget.module.css';
import triangle_down from '/triangle_down.png';
import triangle_right from '/triangle_right.png';
import IconButtonNoBG from '../../button/IconButtonNoBG/IconButtonNoBG';


const AdditionalDemandWidget = ({ demand, setAdditionalDemands, belt }) => {
    const [showProperties, setShowProperties] = useState(false);

    const changeAdditionalTest = (row_id, checked) => {
        if (checked) {
            postAdditionalTestDemandAPI(belt, row_id);
        }
        else {
            removeAdditionalTestDemandAPI(belt, row_id);
        }
        setAdditionalDemands(prev => prev.map(cur_demand => {
            if (cur_demand.id !== demand.id) {
                return cur_demand;
            } else {
                return {...cur_demand, properties: cur_demand.properties.map(cur_row => {
                    if (cur_row.id !== row_id) {
                        return cur_row;
                    } else {
                        return {...cur_row, used: !cur_row.used};
                    }
                })};
            }
        }));
    };

    return (
      <div className={styles['container']}>
        <div className={styles['header']}>
          {showProperties && <IconButtonNoBG icon={triangle_down} onClick={() => setShowProperties(false)} />}
          {!showProperties && <IconButtonNoBG icon={triangle_right} onClick={() => setShowProperties(true)} />}
          {demand.name}
        </div>
        {showProperties && <div className={styles['demand_container']}>
          {demand.properties.map(row => <div key={row.id}>
              <input type='checkbox' id={row.id} checked={row.used} onChange={(e) => changeAdditionalTest(row.id, e.target.checked)} />
              <label htmlFor={row.id}> {row.name} </label>
            </div>
          )}
        </div>}
      </div>
    );
};


export default AdditionalDemandWidget;