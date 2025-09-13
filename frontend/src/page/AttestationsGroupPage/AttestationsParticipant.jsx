import { useEffect, useState } from 'react';
import styles from './AttestationsGroupPage.module.css';
import { getAttestationComplexesAPI, postAttestationComplexAPI } from '../../api/api';


const AttestationsParticipant = ({ participant, complexGroup, groupId }) => {
    const [scoreTable, setScoreTable] = useState([]);

    useEffect(() => {
        getAttestationComplexesAPI(participant.id, complexGroup, groupId).then(data => data.success && setScoreTable(data.result));
    }, [participant, complexGroup, groupId]);

    const changeComplexPoints = (complex_id, points) => {
        postAttestationComplexAPI(participant.id, complex_id, points).then(data => data.success &&
            setScoreTable(prev => prev.map(cur_el => {
                if (complex_id !== cur_el.id) {
                    return cur_el;
                } else {
                    return {...cur_el, points: points};
                }
            }))
        );
    };

    return (
      <div className={styles['participant']}>
        {participant.name}
        <div className={styles['participant_score']}>
          {scoreTable.map(el => <div className={styles['participant_score_row']} key={el.id}>
            {el.name}
            <input className={styles['score']} type="number" min='0' max={el.max} value={el.points} onChange={
              (e) => {
                if ((0 <= e.target.value) & (e.target.value <= el.max)) {
                  changeComplexPoints(el.id, e.target.value);
                } else {
                  alert(`Только от 0 до ${el.max} баллов`);
                }
              } 
            } />
          </div>)}
        </div>
      </div>
    );
};


export default AttestationsParticipant;