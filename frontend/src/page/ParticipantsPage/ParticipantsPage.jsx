import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import IconButton from '../../component/button/IconButton/IconButton';
import styles from './ParticipantsPage.module.css';
import cn from 'classnames';
import plus_icon from '/plus.png';
import filter_icon from '/filter.png';
import { useEffect, useState } from 'react';
import ParticipantsRow from './ParticipantsRow';
import { getBeltsAPI, getParticipantsAPI, postParticipantAPI } from '../../api/api';


const ParticipantsPage = () => {
    const [records, setRecords] = useState([]);
    const [belts, setBelts] = useState([]);

    const addRow = () => {
        postParticipantAPI().then(data => data.success &&
            setRecords(
              [
                  ...records,
                  {
                      'id': data.result.id,
                      'surname': 'Неизвестный',
                      'name': 'Неизвестный',
                      'patronymic': 'Неизвестный',
                      'birth_date': '1900-01-01',
                      'belt': '1'
                  }
              ]
            )
        );
    };

    useEffect(() => {
        getParticipantsAPI().then(data => data.success && setRecords(data.result));
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
            Участники аттестации
          </div>
          <div className={styles['submenu']}>
            <IconButton label='Добавить' icon={plus_icon} onClick={() => addRow()} />
            <IconButton label='Фильтр' icon={filter_icon} />
          </div>
          <div className={styles['row']}>
            <div className={styles['width100']}></div>
            <div className={styles['width150']}> Фамилия </div>
            <div className={styles['width100']}> Имя </div>
            <div className={styles['width150']}> Отчество </div>
            <div className={styles['width100']}> Дата рождения </div>
            <div className={styles['width50']}> Пол </div>
            <div className={styles['width100']}> Пояс </div>
          </div>
          <hr className={styles['hr']} />
          {belts.length && records.map(record => <ParticipantsRow key={record.id} record={record} setRecords={setRecords} belts={belts} />) || ''}
        </div>
      </div>
    );
};


export default ParticipantsPage;