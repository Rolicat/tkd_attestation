import { useNavigate, useParams } from 'react-router';
import styles from './AttestationsGroupPage.module.css';
import cn from 'classnames';
import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import SubmitButton from '../../component/button/SubmitButton/SubmitButton';
import IconButton from '../../component/button/IconButton/IconButton';
import backward_icon from '/backward.png';
import forward_icon from '/forward.png';
import { useCallback, useEffect, useState } from 'react';
import SelectInput from '../../component/input/SelectInput/SelectInput';
import AttestationsParticipant from './AttestationsParticipant';
import { completeGroupAPI, getComplexGroupsByGroupAPI, getOptionsAPI,
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

    const complexGroupName = complexesGroups.find(el => el.id == selectedComplexGroup);
    const complexName = complexes.find(el => el.id == selectedComplex);
    const isRuler = whoFinish == profile?.id;

    const changeAttestationInfo = useCallback((complex_group, complex) => {
        setAdditionalInfoAPI(groupId, complex_group, complex);
    }, [groupId]);

    useEffect(() => {
        getParticipantGroupAPI(groupId).then(data => data.success && setGroup(data.result[0]));
    }, [groupId]);

    useEffect(() => {
        getComplexGroupsByGroupAPI(groupId).then(complexData => {
            if (complexData.success && complexData.result.length) {
                setComplexesGroups(complexData.result);
                getAdditionalInfoAPI(groupId).then(data => {
                    if (data.success) {
                        setSelectedComplexGroup(data.result.complex_group);
                        setSelectedComplex(data.result.complex);
                    }
                    else {
                        setSelectedComplexGroup(complexData.result[0].id);
                    }
                });
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

    useEffect(() => {
        getProfileAPI().then(data => data.success && setProfile(data.result));
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
                if (data.result.length) {
                    setSelectedComplex(data.result[0].id);
                    if (isRuler) {
                        changeAttestationInfo(selectedComplexGroup, data.result[0].id);
                    }
                }
            }
        });
    }, [selectedComplexGroup, groupId, changeAttestationInfo, isRuler]);

    const completeAttestation = () => {
        completeGroupAPI(groupId).then(data => {
            if (data.success) {
                return navigate('/attestations/');
            }
        });
    };

    const changeCurrentGroupComplex = (step) => {
        const indx = complexesGroups.findIndex((el) => el.id == selectedComplexGroup);
        if (step > 0 && indx < complexesGroups.length) {
            setSelectedComplexGroup(complexesGroups[indx+step].id);
        }
        else if (step < 0 && indx > 0) {
            setSelectedComplexGroup(complexesGroups[indx+step].id);
        }
        else {
            return;
        }
        changeAttestationInfo(complexesGroups[indx+step].id, selectedComplex);
    };

    const changeCurrentComplex = (step) => {
        const indx = complexes.findIndex((el) => el.id == selectedComplex);
        if (step > 0 && indx < complexes.length) {
            setSelectedComplex(complexes[indx+step].id);
        }
        else if (step < 0 && indx > 0) {
            setSelectedComplex(complexes[indx+step].id);
        }
        else {
            return;
        }
        changeAttestationInfo(selectedComplexGroup, complexes[indx+step].id);
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
              <IconButton icon={backward_icon} onClick={() => changeCurrentGroupComplex(-1)}/>
              <div className={styles['submenu']}>
                <SelectInput label='Группа комплекса' value={selectedComplexGroup} options={complexesGroups} onChange={(value) => {setSelectedComplexGroup(value); changeAttestationInfo(value, selectedComplex);}}/>
              </div>
              <IconButton icon={forward_icon} onClick={() => changeCurrentGroupComplex(1)}/>
              <IconButton icon={backward_icon} onClick={() => changeCurrentComplex(-1)} />
              <div className={styles['submenu']}>
                <SelectInput label='Комплекс' value={selectedComplex} options={complexes} onChange={(value) => {setSelectedComplex(value); changeAttestationInfo(selectedComplexGroup, value);}}/>
              </div>
              <IconButton icon={forward_icon} onClick={() => changeCurrentComplex(1)} />
            </div>
          }
          {!isRuler &&
            <div className={styles['row']}>
              <div className={styles['submenu']}>
                Группа комплекса: {complexGroupName?.name}
              </div>
              <div className={styles['submenu']}>
                Комплекс: {complexName?.name}
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