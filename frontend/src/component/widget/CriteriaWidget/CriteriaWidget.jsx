import IconButton from '../../button/IconButton/IconButton';
import trash_icon from '/trash.png';
import edit_icon from '/edit.png';
import confirm_icon from '/confirm.png';
import styles from './CriteriaWidget.module.css';
import { useState } from 'react';


const CriteriaWidget = ({ criteria, deleteCriteria, changeCriteria }) => {
    const [points, setPoints] = useState(criteria.points);
    const [name, setName] = useState(criteria.name);
    const [editMode, setEditMode] = useState(false);
    
    return (
      <div className={styles['container']}>
        {!editMode && <span> {name} </span>}
        {editMode && <input className={styles['name']} type='text' value={name} onChange={e=> setName(e.target.value)} />}
        <span> - </span>
        {!editMode && points}
        {editMode && <input className={styles['points']} type='text' value={points} onChange={e => setPoints(e.target.value)} />}
        {!editMode && <IconButton icon={edit_icon} onClick={() => setEditMode(true)} />}
        {editMode && <IconButton icon={confirm_icon} onClick={() => {setEditMode(false); changeCriteria(criteria.id, name, points);}} />}
        <IconButton icon={trash_icon} onClick={() => deleteCriteria(criteria.id)} />
      </div>
    );
};


export default CriteriaWidget;