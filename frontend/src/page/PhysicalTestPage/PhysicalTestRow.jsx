import styles from './PhysicalTestPage.module.css';
import { useState } from 'react';
import IconButton from '../../component/button/IconButton/IconButton';
import edit_icon from '/edit.png';
import confirm_icon from '/confirm.png';
import trash_icon from '/trash.png';
import cn from 'classnames';
import { deletePhysicalTestAPI, patchPhysicalTestAPI } from '../../api/api';


const PhysicalTestRow = ({ record, setRecords }) => {
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(record.name);

    const changeRecord = () => {
        patchPhysicalTestAPI(record.id, name).then(data => {
            if (data.success) {
                setRecords(prev => prev.map(el => {
                    if (el.id !== record.id) {
                        return el;
                    } else {
                        return {id: record.id, name: name};
                    }
            }));
            }
        });
    };

    const deleteRow = () => {
        deletePhysicalTestAPI(record.id).then(data => data.success && setRecords(prev =>
            prev.filter(el => el.id !== record.id)
        ));
    };

    return (
      <div className={cn(styles['width100'], styles['row_menu'])}>
        {!editMode && name}
        {editMode && <input className={cn(styles['width150'], styles['input'])}
              type='text' name='name' value={name}
              onChange={(e) => setName(e.target.value)}
        />}
        {!editMode && <IconButton icon={edit_icon} onClick={() => setEditMode(true)} />}
        {editMode && <IconButton icon={confirm_icon} onClick={() => {setEditMode(false); changeRecord();}} />}
        <IconButton icon={trash_icon} onClick={() => deleteRow()} />
      </div>
    );
};


export default PhysicalTestRow;