import { useEffect, useState } from 'react';
import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import styles from './AttestationsPage.module.css';
import cn from 'classnames';
import AttestationsRow from './AttestationsRow';
import { getGroupsAPI, getResultsAPI, getOptionsAPI, getProfileAPI, restartGroupsAPI } from '../../api/api';
import IconButton from '../../component/button/IconButton/IconButton';
import IconButtonNoBG from '../../component/button/IconButtonNoBG/IconButtonNoBG';
import refresh_icon from '/refresh.png';
import GroupResultWidget from '../../component/widget/GroupResultWidget/GroupResultWidget';


const AttestationsPage = () => {
    const [groups, setGroups] = useState([]);
    const [groupResults, setGroupResults] = useState([]);
    const [groupResultVisible, setGroupResultVisible] = useState(false);
    const [whoFinish, setWhoFinish] = useState();
    const [profile, setProfile] = useState({});

    useEffect(() => {
        getGroupsAPI().then(data => data.success && setGroups(data.result));
        const timerId = setInterval(() => getGroupsAPI().then(data => data.success && setGroups(data.result)), 3000);
        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        getOptionsAPI().then(data => data.success && 
            data.result.forEach(option => {
                if (option.name == 'who_finished_attestation') {
                    setWhoFinish(option.value);
                }
            })
        );
    }, []);

    useEffect(() => {
            getProfileAPI().then(data => data.success && setProfile(data.result));
        }, []);

    const viewGroupResults = (group_id) => {
        setGroupResultVisible(true);
        getResultsAPI(group_id).then(data => data.success && setGroupResults(data.result));
    };

    const restartGroups = () => {
        if (confirm('ВНИМАНИЕ!!! Будут перезапущены все подгруппы. Продолжить?')) {
            restartGroupsAPI();
        }
    };

    const isRuler = whoFinish == profile.id;

    return (
      <div className={cn('container_column', styles['align_top'])}>
        <div className={cn('header_menu')}>
          <BackwardButton label='Назад' to='/' />
        </div>
        {groupResultVisible && <GroupResultWidget groupResults={groupResults} setVisible={setGroupResultVisible}/>}
        <div className={cn('container_column', styles['align_top'])}>
          <div className={cn('font24', styles['header'])}>
            <div className={styles['row']}>
              Аттестация
              {isRuler && <IconButton icon={refresh_icon} onClick={restartGroups}/>}
            </div>
          </div>
          <div className={styles['row']}>
            <div className={styles['width200']}></div>
            <div className={styles['width150']}> Подгруппа </div>
            <div className={styles['width150']}> Результат </div>
          </div>
          <hr className={styles['hr']} />
          {groups.map(record => <AttestationsRow key={record.id} record={record} setRecords={setGroups} showResults={viewGroupResults} isRuler={isRuler} />)}
        </div>
      </div>
    );
};


export default AttestationsPage;