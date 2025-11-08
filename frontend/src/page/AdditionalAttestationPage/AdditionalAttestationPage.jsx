import styles from './AdditionalAttestationPage.module.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import cn from 'classnames';
import { getParticipantGroupAPI, getOptionsAPI, getAdditionalTestsByGroup, getAdditionalTestCriteriasByTestAPI } from '../../api/api';
import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import SelectInput from '../../component/input/SelectInput/SelectInput';
import AdditionalAttestationParticipant from './AdditionalAttestationParticipant';


const AdditionalAttestationPage = () => {
    const {groupId} = useParams();
    const [sportsInRow, setSportsInRow] = useState(1);
    const [group, setGroup] = useState({});
    const [selectedAdditionalTest, setSelectedAdditionalTest] = useState();
    const [additionalTests, setAdditionalTests] = useState();
    const [criterias, setCriterias] = useState([]);

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
        getAdditionalTestsByGroup(groupId).then(data => {
            if (data.success) {
                setAdditionalTests(data.result);
                if (data.result.length) {
                    const test_id = data.result[0].id;
                    setSelectedAdditionalTest(test_id);
                    getAdditionalTestCriteriasByTestAPI(test_id, groupId).then(data => data.success && setCriterias(data.result));
                }
            }
        });
    }, [groupId]);

    return (
      <div className={cn('container_column', styles['align_top'])}>
        <div className={cn('header_menu')}>
          <BackwardButton label='Назад' to='/attestations' />
        </div>
        <div className={cn('container_column', styles['align_top'])}>
          <div className={cn('font24')}>
            Аттестация "{group.name}" (дополнительные комплексы)
          </div>
          <div className={styles['row']}>
            <div className={styles['submenu']}>
              <SelectInput label='Дополнительные комплексы' value={selectedAdditionalTest} options={additionalTests} onChange={setSelectedAdditionalTest}/>
            </div>
          </div>
          <div className={styles['submenu']}>
            Количество спортсменов в ряд: 
            <input type='number' min={1} max={15} value={sportsInRow} onChange={(e) => setSportsInRow(e.target.value)} />
          </div>
          <div className={styles['content']} style={{width: `${170*sportsInRow}px`}}>
            {group.properties?.map(el => <AdditionalAttestationParticipant key={el.id} participant={el} additionalTest={selectedAdditionalTest} groupId={groupId} criterias={criterias} />)}
          </div>
        </div>
      </div>
    );
};


export default AdditionalAttestationPage;