import { useEffect, useState } from 'react';
import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import styles from './AttestationsPage.module.css';
import cn from 'classnames';
import AttestationsRow from './AttestationsRow';
import { getGroupsAPI } from '../../api/api';


const AttestationsPage = () => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        getGroupsAPI().then(data => data.success && setGroups(data.result));
    }, []);

    return (
      <div className={cn('container_column', styles['align_top'])}>
        <div className={cn('header_menu')}>
          <BackwardButton label='Назад' to='/' />
        </div>
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
          {groups.map(record => <AttestationsRow key={record.id} record={record} setRecords={setGroups} />)}
        </div>
      </div>
    );
};


export default AttestationsPage;