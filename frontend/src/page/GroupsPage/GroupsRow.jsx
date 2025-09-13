import styles from './GroupsPage.module.css';
import cn from 'classnames';
import trash_icon from '/trash.png';
import edit_icon from '/edit.png';
import confirm_icon from '/confirm.png';
import IconButton from '../../component/button/IconButton/IconButton';
import { useState } from 'react';
import GroupStructureWidget from '../../component/widget/GroupStructureWidget/GroupStructureWidget';
import SelectInput from '../../component/input/SelectInput/SelectInput';
import { changeGroupAPI, deleteGroupAPI } from '../../api/api';


const GroupsRow = ({record, setRecords, belts}) => {
    const [name, setName] = useState(record.name);
    const [yearStart, setYearStart] = useState(record.year_start);
    const [yearEnd, setYearEnd] = useState(record.year_end);
    const [beltStart, setBeltStart] = useState(belts.find(el => el.id == record.belt_start)?.name);
    const [beltEnd, setBeltEnd] = useState(belts.find(el => el.id == record.belt_end)?.name);
    const [beltAttestation, setBeltAttestation] = useState(belts.find(el => el.id == record.belt_attestation)?.name);
    const [editMode, setEditMode] = useState(false);
    const [selectedBeltStart, setSelectedBeltStart] = useState(record.belt_start);
    const [selectedBeltEnd, setSelectedBeltEnd] = useState(record.belt_end);
    const [selectedBeltAttestation, setSelectedBeltAttestation] = useState(record.belt_attestation);

    const deleteRow = () => deleteGroupAPI(record.id).then(data => data.success && 
      setRecords(prev => prev.filter(cur_record => record.id !== cur_record.id))
    );

    const changeRecord = () => {
        const group = {
            'name': name,
            'year_start': yearStart,
            'year_end': yearEnd,
            'belt_start': selectedBeltStart,
            'belt_end': selectedBeltEnd,
            'belt_attestation': selectedBeltAttestation
        };
        changeGroupAPI(record.id, group).then(data => data.success &&
            setRecords(prev => prev.map(cur_record => {
                if (cur_record.id === record.id) {
                    return {
                        'id': cur_record.id,
                        'name': name,
                        'year_start': yearStart,
                        'year_end': yearEnd,
                        'belt_Start': selectedBeltStart,
                        'belt_end': selectedBeltEnd,
                        'belt_attestation': selectedBeltAttestation,
                        'properties': cur_record.properties
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
            {!editMode && <span className={styles['group']}>
              {name}
              <GroupStructureWidget groupRecord={record} setRecords={setRecords} />
            </span>}
            {editMode && <input className={cn(styles['width150'], styles['input'])}
              type='text' name='name' value={name}
              onChange={(e) => setName(e.target.value)}
            />}
          </div>
          <div className={styles['width50']}>
            {!editMode && yearStart}
            {editMode && <input className={cn(styles['width50'], styles['input'])}
              type='text' name='year_start' value={yearStart}
              onChange={(e) => setYearStart(e.target.value)}
            />}
          </div>
          <div className={styles['width50']}>
            {!editMode && yearEnd}
            {editMode && <input className={cn(styles['width50'], styles['input'])}
              type='text' name='year_end' value={yearEnd}
              onChange={(e) => setYearEnd(e.target.value)}
            />}
          </div>
          <div className={styles['width100']}>
            {!editMode && beltStart}
            {editMode && <SelectInput className={cn(styles['width100'], styles['input'])}
              name='belt_start' value={selectedBeltStart} options={belts}
              onChange={(value) => {
                  setSelectedBeltStart(value);
                  setBeltStart(belts.find(el => el.id == value).name);
              }}
            />}
          </div>
          <div className={styles['width100']}>
            {!editMode && beltEnd}
            {editMode && <SelectInput className={cn(styles['width100'], styles['input'])}
              name='belt_end' value={selectedBeltEnd} options={belts}
              onChange={(value) => {
                  setSelectedBeltEnd(value);
                  setBeltEnd(belts.find(el => el.id == value).name);
              }}
            />}
          </div>
          <div className={styles['width100']}>
            {!editMode && beltAttestation}
            {editMode && <SelectInput className={cn(styles['width100'], styles['input'])}
              name='belt_attestation' value={selectedBeltAttestation} options={belts}
              onChange={(value) => {
                  setSelectedBeltAttestation(value);
                  setBeltAttestation(belts.find(el => el.id == value).name);
              }}
            />}
          </div>
        </div>
    );
};


export default GroupsRow;