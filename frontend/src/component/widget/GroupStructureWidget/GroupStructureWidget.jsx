import IconButton from '../../button/IconButton/IconButton';
import styles from './GroupStructureWidget.module.css';
import trash_icon from '/trash.png';
import refresh_icon from '/refresh.png';
import { fillParticipantGroupAPI, deleteParticipantGroupAPI, appendParticipantGroupAPI } from '../../../api/api';
import ChoiceInput from '../../input/ChoiceInput/ChoiceInput';
import { useState } from 'react';


const GroupStructureWidget = ({ groupRecord, setRecords }) => {
    const [searchField, setSearchField] = useState('');

    const fillParticipantGroup = () => {
        fillParticipantGroupAPI(groupRecord.id).then(data => data.success && 
            setRecords(prev => prev.map(el => {
                if (el.id !== groupRecord.id) {
                    return el;
                } else {
                    return {...el, properties: data.result};
                }
            }))
        );
    };

    const deleteParticipantGroup = (participant_id) => {
        deleteParticipantGroupAPI(groupRecord.id, participant_id).then(data => data.success &&
            setRecords(prev => prev.map(cur_record => {
                if (cur_record.id !== groupRecord.id) {
                    return cur_record;
                } else {
                    return {...cur_record, properties: cur_record.properties.filter(el => el.id !== participant_id)};
                }
            }))
        );
    };

    const itemClick = (participant_id) => {
        setSearchField('');
        appendParticipantGroupAPI(groupRecord.id, participant_id).then(data => data.success &&
            setRecords(prev => prev.map(el => {
                if (el.id !== groupRecord.id) {
                    return el;
                } else {
                    return {...el, properties: [...el.properties, data.result]};
                }
            }))
        );
    };

    return (
      <div className={styles['group_properties']}>
        <div>
          <ChoiceInput label='Поиск' name='search' value={searchField} onChange={setSearchField} onItemClick={itemClick}/>
        </div>
        <div className={styles['row']}>
          Состав: <IconButton icon={refresh_icon} onClick={() => fillParticipantGroup()}/>
        </div>
        {groupRecord.properties.map(el => <div key={el.id} className={styles['row']}>
          {el.name} ({el.belt})
          <IconButton icon={trash_icon} onClick={() => deleteParticipantGroup(el.id)} />
        </div>)}
      </div>
    );
};


export default GroupStructureWidget;