import IconButton from '../../button/IconButton/IconButton';
import trash_icon from '/trash.png';
import edit_icon from '/edit.png';
import confirm_icon from '/confirm.png';
import styles from './ComplexWidget.module.css';
import { useState } from 'react';


const ComplexWidget = ({ complex, deleteComplex, changeComplex }) => {
    const [points, setPoints] = useState(complex.points);
    const [name, setName] = useState(complex.name);
    const [editMode, setEditMode] = useState(false);
    
    return (
      <div className={styles['container']}>
        {!editMode && <span> {name} </span>}
        {editMode && <input className={styles['name']} type='text' value={name} onChange={e=> setName(e.target.value)} />}
        <span> - </span>
        {!editMode && points}
        {editMode && <input className={styles['points']} type='text' value={points} onChange={e => setPoints(e.target.value)} />}
        {!editMode && <IconButton icon={edit_icon} onClick={() => setEditMode(true)} />}
        {editMode && <IconButton icon={confirm_icon} onClick={() => {setEditMode(false); changeComplex(complex.id, name, points);}} />}
        <IconButton icon={trash_icon} onClick={() => deleteComplex(complex.id)} />
      </div>
    );
};


export default ComplexWidget;