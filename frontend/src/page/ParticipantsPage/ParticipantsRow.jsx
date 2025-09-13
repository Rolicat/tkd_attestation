import styles from './ParticipantsPage.module.css';
import cn from 'classnames';
import trash_icon from '/trash.png';
import edit_icon from '/edit.png';
import confirm_icon from '/confirm.png';
import IconButton from '../../component/button/IconButton/IconButton';
import { useState } from 'react';
import SelectInput from '../../component/input/SelectInput/SelectInput';
import { changeParticipantAPI, deleteParticipantAPI } from '../../api/api';
import { formatDateStringToString } from '../../functions/functions';

const ParticipantsRow = ({record, setRecords, belts}) => {
    const [surname, setSurname] = useState(record.surname);
    const [name, setName] = useState(record.name);
    const [patronymic, setPatronymic] = useState(record.patronymic);
    const [birthDate, setBirthDate] = useState(record.birth_date);
    const [belt, setBelt] = useState(belts.find(el => el.id == record.belt)?.name);
    const [selectedBelt, setSelectedBelt] = useState(record.belt);
    const [editMode, setEditMode] = useState(false);

    const deleteRow = () => {
        deleteParticipantAPI(record.id).then(data => data.success &&
            setRecords(prev => prev.filter(cur_record => record.id !== cur_record.id))
        );
    };

    const changeRecord = () => {
        const participant = {
            'surname': surname,
            'name': name,
            'patronymic': patronymic,
            'birth_date': birthDate,
            'belt': selectedBelt
        };
        changeParticipantAPI(record.id, participant).then(data => data.success &&
            setRecords(prev => prev.map(cur_record => {
                if (cur_record.id === record.id) {
                    return {
                        'id': cur_record.id,
                        'surname': surname,
                        'name': name,
                        'patronymic': patronymic,
                        'birth_date': birthDate,
                        'belt': selectedBelt
                    };
                } else {
                    return cur_record;
                }
            }))
        );
    };

    return (
        <div className={styles['row']}>
          <div className={cn(styles['width100'], styles['row_menu'])}>
            {!editMode && <IconButton icon={edit_icon} onClick={() => setEditMode(true)} />}
            {editMode && <IconButton icon={confirm_icon} onClick={() => {setEditMode(false); changeRecord();}} />}
            <IconButton icon={trash_icon} onClick={() => deleteRow()} />
          </div>
          <div className={styles['width150']}>
            {!editMode && surname}
            {editMode && <input className={cn(styles['width150'], styles['input'])}
              type='text' name='surname' value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />}
          </div>
          <div className={styles['width100']}>
            {!editMode && name}
            {editMode && <input className={cn(styles['width100'], styles['input'])}
              type='text' name='name' value={name}
              onChange={(e) => setName(e.target.value)}
            />}
          </div>
          <div className={styles['width150']}>
            {!editMode && patronymic}
            {editMode && <input className={cn(styles['width150'], styles['input'])}
              type='text' name='patronymic' value={patronymic}
              onChange={(e) => setPatronymic(e.target.value)}
            />}
          </div>
          <div className={styles['width100']}>
            {!editMode && formatDateStringToString(birthDate)}
            {editMode && <input className={cn(styles['width100'], styles['input'])}
              type='date' name='birthDate' value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />}
          </div>
          <div className={styles['width100']}>
            {!editMode && belt}
            {editMode && <SelectInput className={cn(styles['width100'], styles['input'])}
              name='belt' value={selectedBelt} options={belts}
              onChange={(value) => {
                  setSelectedBelt(value);
                  setBelt(belts.find(el => el.id == value).name);
              }}
            />}
          </div>
        </div>
    );
};


export default ParticipantsRow;