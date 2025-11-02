import styles from './PhysicalTestPage.module.css';
import cn from 'classnames';
import plus_icon from '/plus.png';
import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import IconButton from '../../component/button/IconButton/IconButton';
import { useEffect, useState } from 'react';
import { getPhysicalTestAPI, postPhysicalTestAPI, getPhysicalTestPointsAPI } from '../../api/api';
import PhysicalTestRow from './PhysicalTestRow';
import PhysicalTestPointRow from './PhysicalTestPointRow';


const PhysicalTestPage = () => {
    const [phTests, setPhTests] = useState([]);
    const [phPoints, setPhPoints] = useState([]);

    useEffect(() => {
         getPhysicalTestAPI().then(data => data.success && setPhTests(data.result));
         getPhysicalTestPointsAPI().then(data => data.success && setPhPoints(data.result));
    }, []);

    const addRow = () => {
        postPhysicalTestAPI().then(data => data.success &&
            setPhTests([...phTests, {'id': data.result.id, 'name': 'Новый комплекс'}])
        );
    };

    return (
      <div className={cn('container_column', styles['align_top'])}>
        <div className={cn('header_menu')}>
          <BackwardButton label='Назад' to='/options/' />
        </div>
        <div className={cn('container_column', styles['align_top'])}>
          <div className={cn('font24', styles['header'])}>
            Виды физических комплексов
          </div>
          <div className={styles['submenu']}>
            <IconButton label='Добавить' icon={plus_icon} onClick={() => addRow()} />
          </div>
          {phTests.map(record =>
            <div key={record.id} className={styles['row']}>
              <PhysicalTestRow record={record} setRecords={setPhTests} />
            </div>
          )}
          <div className={cn('font24')}>
            Процентовка и баллы за физические комплексы
          </div>
          <div className={styles['column']}>
            {phPoints.map(record =>
              <div key={record.id} className={styles['row']}>
                <PhysicalTestPointRow record={record} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
};


export default PhysicalTestPage;