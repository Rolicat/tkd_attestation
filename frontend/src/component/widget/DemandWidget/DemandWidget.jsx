import { postBeltDemandAPI, removeBeltDemandAPI } from '../../../api/api';
import { useState } from 'react';
import styles from './DemandWidget.module.css';
import triangle_down from '/triangle_down.png';
import triangle_right from '/triangle_right.png';
import check_icon from '/check.png';
import uncheck_icon from '/uncheck.png';
import IconButtonNoBG from '../../button/IconButtonNoBG/IconButtonNoBG';


const DemandWidget = ({ demand, setDemands, belt }) => {
    const [showProperties, setShowProperties] = useState(false);

    const changeDemand = (row_id, checked) => {
        if (checked) {
            postBeltDemandAPI(belt, row_id);
        }
        else {
            removeBeltDemandAPI(belt, row_id);
        }
        setDemands(prev => prev.map(cur_demand => {
            if (cur_demand.id !== demand.id) {
                return cur_demand;
            } else {
                return {...cur_demand, properties: cur_demand.properties.map(cur_row => {
                    if (cur_row.id !== row_id) {
                        return cur_row;
                    } else {
                        return {...cur_row, used: checked};
                    }
                })};
            }
        }));
    };

    const checkAll = (check) => {
        for (let i=0; i < demand.properties.length; i++) {
            let row = demand.properties[i];
            changeDemand(row.id, check);
        }
    };

    return (
      <div className={styles['container']}>
        <div className={styles['header']}>
          {showProperties && <IconButtonNoBG icon={triangle_down} onClick={() => setShowProperties(false)} />}
          {!showProperties && <IconButtonNoBG icon={triangle_right} onClick={() => setShowProperties(true)} />}
          {demand.name}
          <IconButtonNoBG icon={check_icon} onClick={() => checkAll(true)} />
          <IconButtonNoBG icon={uncheck_icon} onClick={() => checkAll(false)} />
        </div>
        {showProperties && <div className={styles['demand_container']}>
          {demand.properties.map(row => <div key={row.id}>
              <input type='checkbox' id={row.id} checked={row.used} onChange={(e) => changeDemand(row.id, e.target.checked)} />
              <label htmlFor={row.id}> {row.name} </label>
            </div>
          )}
        </div>}
      </div>
    );
};


export default DemandWidget;