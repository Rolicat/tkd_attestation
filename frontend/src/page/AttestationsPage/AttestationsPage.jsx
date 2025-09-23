import { useEffect, useState } from 'react';
import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import styles from './AttestationsPage.module.css';
import cn from 'classnames';
import AttestationsRow from './AttestationsRow';
import { getGroupsAPI, getResultsAPI } from '../../api/api';
import IconButton from '../../component/button/IconButton/IconButton';
import close_icon from '/close.png';


const AttestationsPage = () => {
    const [groups, setGroups] = useState([]);
    const [groupResults, setGroupResults] = useState([]);
    const [groupResultVisible, setGroupResultVisible] = useState(false);

    useEffect(() => {
        getGroupsAPI().then(data => data.success && setGroups(data.result));
        const timerId = setInterval(() => getGroupsAPI().then(data => data.success && setGroups(data.result)), 3000);
        return () => clearInterval(timerId);
    }, []);

    const viewGroupResults = (group_id) => {
        setGroupResultVisible(true);
        getResultsAPI(group_id).then(data => data.success && setGroupResults(data.result));
    };

    return (
      <div className={cn('container_column', styles['align_top'])}>
        <div className={cn('header_menu')}>
          <BackwardButton label='Назад' to='/' />
        </div>
        {groupResultVisible &&
          <div className={styles['result_container']}>
            <div className={styles['result_close']}>
              <IconButton icon={close_icon} onClick={() => setGroupResultVisible(false)}/>
            </div>
            {groupResults.map(el => <div key={el.id} >
                {el.value}
              </div>)
            }
          </div>
        }
        <div className={cn('container_column', styles['align_top'])}>
          <div className={cn('font24', styles['header'])}>
            Аттестация
          </div>
          <div className={styles['row']}>
            <div className={styles['width100']}></div>
            <div className={styles['width150']}> Подгруппа </div>
            <div className={styles['width150']}> Результат </div>
          </div>
          <hr className={styles['hr']} />
          {groups.map(record => <AttestationsRow key={record.id} record={record} setRecords={setGroups} showResults={viewGroupResults} />)}
        </div>
      </div>
    );
};


export default AttestationsPage;