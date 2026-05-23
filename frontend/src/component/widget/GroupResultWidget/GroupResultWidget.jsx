import styles from './GroupResultWidget.module.css';
import close_icon from '/close.png';
import IconButton from '../../button/IconButton/IconButton';
import ParticipantResultWidget from './ParticipantResultWidget';



const GroupResultWidget = ({groupResults, setVisible}) => {

    return (
      <div className={styles['result_container']}>
        <div className={styles['result_close']}>
          <IconButton icon={close_icon} onClick={() => setVisible(false)}/>
        </div>
        {groupResults.map(el => <div className={styles['row_result']} key={el.id} >
            <ParticipantResultWidget element={el}/>
          </div>)
        }
      </div>
    );
};


export default GroupResultWidget;