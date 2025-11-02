import { useEffect, useState } from 'react';
import styles from './PhysicalAttestationPage.module.css';
import SubmitButton from '../../component/button/SubmitButton/SubmitButton';
import { getPhysicalAttestationResultAPI, postPhysicalAttestationResultAPI } from '../../api/api';


const PhysicalAttestationParticipant = ({ participant, physicalTest, groupId }) => {
    const [scoreTable, setScoreTable] = useState({});
    const judgePoints = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

    useEffect(() => {
        if (!physicalTest) {
            return;
        }
        getPhysicalAttestationResultAPI(participant.id, physicalTest).then(data => data.success && setScoreTable(data.result));
    }, [participant, physicalTest, groupId]);

    const changeResultPoints = (value) => {
        postPhysicalAttestationResultAPI(participant.id, physicalTest, value).then(data => data.success &&
            setScoreTable(prev => {return {...prev, points: value};})
        );
    };

    return (
      <div className={styles['participant']}>
        {participant.name}
        <div className={styles['participant_score']}>
          <div className={styles['participant_score_row']}>
            {scoreTable.name}
            <input className={styles['score']} type="number" min='0' max={scoreTable.max} step='0.5' value={scoreTable.points} onChange={
              (e) => {
                if ((0 <= e.target.value) & (e.target.value <= scoreTable.max)) {
                  changeResultPoints(scoreTable.id, e.target.value);
                } else {
                  alert(`Только от 0 до ${scoreTable.max} баллов`);
                }
              } 
            } />
          </div>
          <div className={styles['points_score_row']}>
            {judgePoints.map(el => <SubmitButton key={el} label={el} onClick={() => changeResultPoints(el)} />)}
          </div>
        </div>
      </div>
    );
};


export default PhysicalAttestationParticipant;