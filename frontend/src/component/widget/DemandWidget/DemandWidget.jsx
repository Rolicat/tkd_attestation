import { postBeltDemandAPI, removeBeltDemandAPI } from '../../../api/api';
import styles from './DemandWidget.module.css';


const DemandWidget = ({ demand, setDemands, belt }) => {
    const changeDemand = (row_id) => {
        setDemands(prev => prev.map(cur_demand => {
            if (cur_demand.id !== demand.id) {
                return cur_demand;
            } else {
                return {...cur_demand, properties: cur_demand.properties.map(cur_row => {
                    if (cur_row.id !== row_id) {
                        return cur_row;
                    } else {
                        if (cur_row.used) {
                            removeBeltDemandAPI(belt, cur_row.id);
                        } else {
                            postBeltDemandAPI(belt, cur_row.id);
                        }
                        return {...cur_row, used: !cur_row.used};
                    }
                })};
            }
        }));
    };

    return (
      <div className={styles['container']}>
        <div className={styles['header']}>
          {demand.name}
        </div>
        <div className={styles['demand_container']}>
          {demand.properties.map(row => <div key={row.id}>
              <input type='checkbox' id={row.id} checked={row.used} onChange={() => changeDemand(row.id)} />
              <label htmlFor={row.id}> {row.name} </label>
            </div>
          )}
        </div>
      </div>
    );
};


export default DemandWidget;