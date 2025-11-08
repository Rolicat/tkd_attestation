import { useEffect, useState } from 'react';
import styles from './AttestationsGroupPage.module.css';
import { getAttestationComplexesAPI, postAttestationComplexAPI } from '../../api/api';
import SubmitButton from '../../component/button/SubmitButton/SubmitButton';


const AttestationsParticipant = ({ participant, complex, groupId }) => {
    const [scoreTable, setScoreTable] = useState({});
    const judgePoints = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

    useEffect(() => {
      if (!complex) {
          return;
      }
        getAttestationComplexesAPI(participant.id, complex, groupId).then(data => data.success && setScoreTable(data.result));
    }, [participant, complex, groupId]);

    const changeComplexPoints = (value) => {
        postAttestationComplexAPI(participant.id, complex, value).then(data => data.success &&
            setScoreTable(prev => {return {...prev, points: value};})
        );
    };

    return (
      <div className={styles['participant']}>
        {participant.name}
        {complex &&
          <div className={styles['participant_score']}>
            <div className={styles['participant_score_row']}>
              {scoreTable.name}
              <input className={styles['score']} type="number" min='0' max={scoreTable.max} step='0.5' value={scoreTable.points} onChange={
                (e) => {
                  if ((0 <= e.target.value) & (e.target.value <= scoreTable.max)) {
                    changeComplexPoints(scoreTable.id, e.target.value);
                  } else {
                    alert(`Только от 0 до ${scoreTable.max} баллов`);
                  }
                } 
              } />
            </div>
            <div className={styles['points_score_row']}>
              {judgePoints.map(el => <SubmitButton key={el} label={el} onClick={() => changeComplexPoints(el)} />)}
            </div>
          </div>
        }
      </div>
    );
};


export default AttestationsParticipant;