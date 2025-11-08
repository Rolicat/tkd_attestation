import { useEffect, useState } from 'react';
import styles from './AdditionalAttestationPage.module.css';
import SubmitButton from '../../component/button/SubmitButton/SubmitButton';
import { getAdditionalAttestationResultAPI, postAdditionalAttestationResultAPI } from '../../api/api';
import SelectInput from '../../component/input/SelectInput/SelectInput';


const AdditionalAttestationParticipant = ({ participant, additionalTest, groupId, criterias }) => {
    const [currentCriteria, setCurrentCriteria] = useState('');

    useEffect(() => {
        if (!additionalTest) {
            return;
        }
        getAdditionalAttestationResultAPI(participant.id, additionalTest).then(data => data.success && setCurrentCriteria(data.result.name));
    }, [participant, additionalTest, groupId]);

    const changeResultPoints = (value) => {
        postAdditionalAttestationResultAPI(participant.id, additionalTest, value);
    };

    return (
      <div className={styles['participant']}>
        {participant.name}
        <div className={styles['participant_score']}>
          <div className={styles['participant_score_row']}>
            Результат: {currentCriteria}
          </div>
          <div className={styles['points_score_row']}>
            {criterias.map(el => <SubmitButton key={el.id} label={el.name} onClick={() => {changeResultPoints(el.id); setCurrentCriteria(el.name);}} />)}
          </div>
        </div>
      </div>
    );
};


export default AdditionalAttestationParticipant;