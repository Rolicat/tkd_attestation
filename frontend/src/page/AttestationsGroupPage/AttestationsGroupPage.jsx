import { useNavigate, useParams } from 'react-router';
import styles from './AttestationsGroupPage.module.css';
import cn from 'classnames';
import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import SubmitButton from '../../component/button/SubmitButton/SubmitButton';
import { useEffect, useState } from 'react';
import SelectInput from '../../component/input/SelectInput/SelectInput';
import AttestationsParticipant from './AttestationsParticipant';
import { completeGroupAPI, getComplexGroupAPI, getParticipantGroupAPI } from '../../api/api';


const AttestationsGroupPage = () => {
    const {groupId} = useParams();
    const [sportsInRow, setSportsInRow] = useState(1);
    const [selectedComplex, setSelectedComplex] = useState();
    const [complexes, setComplexes] = useState([]);
    const [group, setGroup] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getParticipantGroupAPI(groupId).then(data => data.success && setGroup(data.result[0]));
    }, [groupId]);

    useEffect(() => {
        getComplexGroupAPI().then(data => {
            if (data.success) {
                setComplexes(data.result);
                setSelectedComplex(data.result[0].id);
            }
        });
    }, []);

    const completeAttestation = () => {
        completeGroupAPI(groupId).then(data => {
            if (data.success) {
                return navigate('/attestations/');
            }
        });
    };
    return (
      <div className={cn('container_column', styles['align_top'])}>
        <div className={cn('header_menu')}>
          <BackwardButton label='Назад' to='/attestations' />
        </div>
        <div className={cn('container_column', styles['align_top'])}>
          <SubmitButton label="Завершить" onClick={() => completeAttestation()} />
          <div className={cn('font24')}>
            Аттестация "{group.name}"
          </div>
          <div className={styles['submenu']}>
            <SelectInput label='Группа комплекса' value={selectedComplex} options={complexes} onChange={setSelectedComplex}/>
          </div>
          <div className={styles['submenu']}>
            Количество спортсменов в ряд: 
            <input type='number' min={1} max={15} value={sportsInRow} onChange={(e) => setSportsInRow(e.target.value)} />
          </div>
          <div className={styles['content']} style={{width: `${170*sportsInRow}px`}}>
            {group.properties?.map(el => <AttestationsParticipant key={el.id} participant={el} complexGroup={selectedComplex} groupId={groupId} />)}
          </div>
        </div>
      </div>
    );
};


export default AttestationsGroupPage;