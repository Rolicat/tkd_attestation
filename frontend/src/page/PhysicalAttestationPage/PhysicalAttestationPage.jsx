import styles from './PhysicalAttestationPage.module.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import cn from 'classnames';
import { getDemandsByGroupAndTestAPI, getParticipantGroupAPI, getOptionsAPI, getPhysicalTestsByGroup } from '../../api/api';
import PhysicalAttestationParticipant from './PhysicalAttestationParticipant';
import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import SelectInput from '../../component/input/SelectInput/SelectInput';


const PhysicalAttestationPage = () => {
    const {groupId} = useParams();
    const [sportsInRow, setSportsInRow] = useState(1);
    const [group, setGroup] = useState({});
    const [selectedPhysicalTest, setSelectedPhysicalTest] = useState();
    const [physicalTests, setPhysicalTests] = useState();
    const [demandsByGroupAndTest, setDemandsByGroupAndTest] = useState([]);

    useEffect(() => {
        getParticipantGroupAPI(groupId).then(data => data.success && setGroup(data.result[0]));
    }, [groupId]);

    useEffect(() => {
        getOptionsAPI().then(data => data.success && 
            data.result.forEach(option => {
                if (option.name == 'participants_in_row') {
                    setSportsInRow(option.value);
                }
            })
        );
    }, []);

    useEffect(() => {
        getPhysicalTestsByGroup(groupId).then(data => {
            if (data.success) {
                setPhysicalTests(data.result);
                if (data.result.length) {
                    setSelectedPhysicalTest(data.result[0].id);
                }
            }
        });
    }, [groupId]);

    useEffect(() => {
        if (!selectedPhysicalTest) {
            return;
        }
        getDemandsByGroupAndTestAPI(groupId, selectedPhysicalTest).then(data => data.success && setDemandsByGroupAndTest(data.result));
    }, [selectedPhysicalTest, groupId]);

    return (
      <div className={cn('container_column', styles['align_top'])}>
        <div className={cn('header_menu')}>
          <BackwardButton label='Назад' to='/attestations' />
        </div>
        <div className={cn('container_column', styles['align_top'])}>
          <div className={cn('font24')}>
            Аттестация "{group.name}"
          </div>
          <div className={styles['row']}>
            <div className={styles['submenu']}>
              <SelectInput label='Физические комплексы' value={selectedPhysicalTest} options={physicalTests} onChange={setSelectedPhysicalTest}/>
            </div>
            <div className={styles['submenu_column']}>
              {demandsByGroupAndTest.map(el => <div>
                  Оценка: {el.points} - м: {el.criteria_male} ж: {el.criteria_female} раз(а)
              </div>)}
            </div>
          </div>
          <div className={styles['submenu']}>
            Количество спортсменов в ряд: 
            <input type='number' min={1} max={15} value={sportsInRow} onChange={(e) => setSportsInRow(e.target.value)} />
          </div>
          <div className={styles['content']} style={{width: `${170*sportsInRow}px`}}>
            {group.properties?.map(el => <PhysicalAttestationParticipant key={el.id} participant={el} physicalTest={selectedPhysicalTest} groupId={groupId} />)}
          </div>
        </div>
      </div>
    );
};


export default PhysicalAttestationPage;