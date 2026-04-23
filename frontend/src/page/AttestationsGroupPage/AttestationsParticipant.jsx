import { useEffect, useState } from 'react';
import styles from './AttestationsGroupPage.module.css';
import { getAttestationComplexesAPI, postAttestationComplexAPI } from '../../api/api';
import SubmitButton from '../../component/button/SubmitButton/SubmitButton';
import { useRef } from 'react';


const AttestationsParticipant = ({ participant, complex, groupId }) => {
    const [scoreTable, setScoreTable] = useState({});
    const judgePoints = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    const divScoreRef = useRef(null);


    useEffect(() => {
      if (!complex) {
          return;
      }
        getAttestationComplexesAPI(participant.id, complex, groupId).then(data => data.success && setScoreTable(data.result));
    }, [participant, complex, groupId]);

    const changeComplexPoints = (participant_id, value) => {
        postAttestationComplexAPI(participant.id, complex, value).then(data => data.success &&
            setScoreTable(prev => {return {...prev, points: value};})
        );
    };

    const handleKeyDown = (event) => {
        switch (parseInt(event.key)) {
            case 1:
                changeComplexPoints(participant.id, 1);
                break;
            case 2:
                changeComplexPoints(participant.id, 1.5);
                break;
            case 3:
                changeComplexPoints(participant.id, 2);
                break;
            case 4:
                changeComplexPoints(participant.id, 2.5);
                break;
            case 5:
                changeComplexPoints(participant.id, 3);
                break;
            case 6:
                changeComplexPoints(participant.id, 3.5);
                break;
            case 7:
                changeComplexPoints(participant.id, 4);
                break;
            case 8:
                changeComplexPoints(participant.id, 4.5);
                break;
            case 9:
                changeComplexPoints(participant.id, 5);
                break;
        }
    };

    return (
      <div className={styles['participant']} onMouseEnter={() => divScoreRef.current.focus()}>
        {participant.name}
        {complex &&
          <div id="participant_score" className={styles['participant_score']} ref={divScoreRef} tabIndex={0} onKeyDown={handleKeyDown}>
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
              {judgePoints.map(el => <SubmitButton key={el} label={el} onClick={() => changeComplexPoints(participant.id, el)} />)}
            </div>
          </div>
        }
      </div>
    );
};


export default AttestationsParticipant;