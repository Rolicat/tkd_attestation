import { useState } from 'react';
import styles from './GroupResultWidget.module.css';
import triangle_down from '/triangle_down.png';
import triangle_right from '/triangle_right.png';
import IconButtonNoBG from '../../button/IconButtonNoBG/IconButtonNoBG';


const ParticipantResultWidget = ({element}) => {
    const [showProperties, setShowProperties] = useState(false);

    return (
      <>
        <div className={styles['participant_result']}>
          {showProperties && <IconButtonNoBG icon={triangle_down} onClick={() => setShowProperties(false)} />}
          {!showProperties && <IconButtonNoBG icon={triangle_right} onClick={() => setShowProperties(true)} />}
          <b>{element.value} ({element.points})</b>
        </div>
        {showProperties && element.complexes.map(complex => <div key={complex.name}>{complex.name} - {complex.point}</div>)}
      </>
    );
};


export default ParticipantResultWidget;