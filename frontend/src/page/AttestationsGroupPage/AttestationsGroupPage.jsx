import { useNavigate, useParams } from 'react-router';
import styles from './AttestationsGroupPage.module.css';
import cn from 'classnames';
import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import SubmitButton from '../../component/button/SubmitButton/SubmitButton';
import { useEffect, useState } from 'react';
import SelectInput from '../../component/input/SelectInput/SelectInput';
import AttestationsParticipant from './AttestationsParticipant';
import { completeGroupAPI, getComplexGroupAPI, getOptionsAPI,
  getParticipantGroupAPI, getProfileAPI, getComplexesInGroupAPI,
  getAdditionalInfoAPI, setAdditionalInfoAPI } from '../../api/api';


const AttestationsGroupPage = () => {
    const {groupId} = useParams();
    const [sportsInRow, setSportsInRow] = useState(1);
    const [whoFinish, setWhoFinish] = useState();
    const [profile, setProfile] = useState({});
    const [selectedComplexGroup, setSelectedComplexGroup] = useState(undefined);
    const [selectedComplex, setSelectedComplex] = useState();
    const [complexes, setComplexes] = useState([]);
    const [complexesGroups, setComplexesGroups] = useState([]);
    const [group, setGroup] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getParticipantGroupAPI(groupId).then(data => data.success && setGroup(data.result[0]));
    }, [groupId]);

    useEffect(() => {
        getComplexGroupAPI().then(data => {
            if (data.success && data.result.length) {
                setComplexesGroups(data.result);
                setSelectedComplexGroup(data.result[0].id);
            }
        });
    }, []);

    useEffect(() => {
        getProfileAPI().then(data => data.success && setProfile(data.result));
    }, []);

    useEffect(() => {
        getOptionsAPI().then(data => data.success && 
            data.result.forEach(option => {
                if (option.name == 'participants_in_row') {
                    setSportsInRow(option.value);
                } else if (option.name == 'who_finished_attestation') {
                    setWhoFinish(option.value);
                }
            })
        );
    }, []);

    useEffect(() => {
        if (!selectedComplexGroup) {
            return;
        }
        getComplexesInGroupAPI(selectedComplexGroup, groupId).then(data => {
            if (data.success) {
                setComplexes(data.result);
            }
        });
    }, [selectedComplexGroup, groupId]);

    useEffect(() => {
        getAdditionalInfoAPI(groupId).then(data => {
              if (data.success) {
                  setSelectedComplexGroup(data.result.complex_group);
                  setSelectedComplex(data.result.complex);
              }
          });
        const intervalId = setInterval(() => {
            getAdditionalInfoAPI(groupId).then(data => {
                if (data.success) {
                    setSelectedComplexGroup(data.result.complex_group);
                    setSelectedComplex(data.result.complex);
                }
            });
        }, 5000);
        return () => clearInterval(intervalId);
    }, [groupId]);

    const completeAttestation = () => {
        completeGroupAPI(groupId).then(data => {
            if (data.success) {
                return navigate('/attestations/');
            }
        });
    };

    const changeAttestationInfo = (complex_group, complex) => {
        setAdditionalInfoAPI(groupId, complex_group, complex);
    };

    return (
      <div className={cn('container_column', styles['align_top'])}>
        <div className={cn('header_menu')}>
          <BackwardButton label='Назад' to='/attestations' />
        </div>
        <div className={cn('container_column', styles['align_top'])}>
          {whoFinish == profile?.id && <SubmitButton label="Завершить" onClick={() => completeAttestation()} />}
          <div className={cn('font24')}>
            Аттестация "{group.name}"
          </div>
          {whoFinish == profile?.id &&
            <div className={styles['row']}>
              <div className={styles['submenu']}>
                <SelectInput label='Группа комплекса' value={selectedComplexGroup} options={complexesGroups} onChange={(value) => {setSelectedComplexGroup(value); changeAttestationInfo(value, selectedComplex);}}/>
              </div>
              <div className={styles['submenu']}>
                <SelectInput label='Комплекс' value={selectedComplex} options={complexes} onChange={(value) => {setSelectedComplex(value); changeAttestationInfo(selectedComplexGroup, value);}}/>
              </div>
            </div>
          }
          <div className={styles['submenu']}>
            Количество спортсменов в ряд: 
            <input type='number' min={1} max={15} value={sportsInRow} onChange={(e) => setSportsInRow(e.target.value)} />
          </div>
          <div className={styles['content']} style={{width: `${170*sportsInRow}px`}}>
            {group.properties?.map(el => <AttestationsParticipant key={el.id} participant={el} complex={selectedComplex} groupId={groupId} />)}
          </div>
        </div>
      </div>
    );
};


export default AttestationsGroupPage;