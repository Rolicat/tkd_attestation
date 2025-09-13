import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import IconButton from '../../component/button/IconButton/IconButton';
import GroupsRow from './GroupsRow';
import styles from './GroupsPage.module.css';
import cn from 'classnames';
import plus_icon from '/plus.png';
import filter_icon from '/filter.png';
import { useState, useEffect } from 'react';
import { getGroupsTreeAPI, getBeltsAPI, postGroupAPI } from '../../api/api';


const GroupsPage = () => {
    const [records, setRecords] = useState([]);

    const [belts, setBelts] = useState([]);

    const addRow = () => postGroupAPI().then(data => data.success && 
        setRecords(
            [
                ...records,
                {
                    'id': data.result.id,
                    'name': 'Новая подгруппа',
                    'year_start': '1900',
                    'year_end': '1900',
                    'belt_start': '1',
                    'belt_end': '1',
                    'belt_attestation': '1',
                    'properties': []
                }
            ]
        )
    );

    useEffect(() => {
        getGroupsTreeAPI().then(data => data.success && setRecords(data.result));
    }, []);

    useEffect(() => {
        getBeltsAPI().then(data => data.success && setBelts(data.result));
    }, []);

    return (
      <div className={cn('container_column', styles['align_top'])}>
        <div className={cn('header_menu')}>
          <BackwardButton label='Назад' to='/' />
        </div>
        <div className={cn('container_column', styles['align_top'])}>
          <div className={cn('font24')}>
            Подгруппы
          </div>
          <div className={styles['submenu']}>
            <IconButton label='Добавить' icon={plus_icon} onClick={() => addRow()} />
            <IconButton label='Фильтр' icon={filter_icon} />
          </div>
          <div className={styles['row']}>
            <div className={styles['width100']}></div>
            <div className={styles['width150']}> Название </div>
            <div className={styles['width50']}> Г.р. от </div>
            <div className={styles['width50']}> Г.р. до </div>
            <div className={styles['width100']}> Пояс от </div>
            <div className={styles['width100']}> Пояс до </div>
            <div className={styles['width100']}> Пояс аттестации </div>
          </div>
          <hr className={styles['hr']} />
          {belts.length && records.map(record => <GroupsRow key={record.id} record={record} setRecords={setRecords} belts={belts}  />) || ''}
        </div>
      </div>
    );
};


export default GroupsPage;