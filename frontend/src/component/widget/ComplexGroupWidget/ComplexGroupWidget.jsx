import styles from './ComplexGroupWidget.module.css';
import plus_icon from '/plus.png';
import trash_icon from '/trash.png';
import edit_icon from '/edit.png';
import confirm_icon from '/confirm.png';
import IconButton from '../../button/IconButton/IconButton';
import ComplexWidget from '../ComplexWidget/ComplexWidget';
import { useState } from 'react';
import { changeComplexAPI, changeComplexGroupAPI, deleteComplexAPI, deleteComplexGroupAPI, postComplexAPI } from '../../../api/api';


const ComplexGroupWidget = ({ group, setComplexes }) => {
    const [editMode, setEditMode] = useState(false);
    const [groupName, setGroupName] = useState(group.name);

    const deleteComplex = (complex_id) => {
        deleteComplexAPI(complex_id).then(data => {
            if (data.success) {
                setComplexes(prev => prev.map(cur_group => {
                    if (group.id != cur_group.id) {
                        return cur_group;
                    } else {
                        cur_group.properties = cur_group.properties.filter(cur_complex => cur_complex.id != complex_id);
                        return cur_group;
                    }
                  }
                ));
            }
          }
        );
    };

    const deleteGroup = () => {
        deleteComplexGroupAPI(group.id).then(data => {
            if (data.success) {
                setComplexes(prev => prev.filter(cur_group => cur_group.id != group.id));
            }
        });
    };

    const changeGroup = () => {
        changeComplexGroupAPI(group.id, groupName).then(data => {
            if (data.success) {
                setComplexes(prev => prev.map(cur_group => {
                    if (cur_group.id !== group.id) {
                        return cur_group;
                    } else {
                        return {...cur_group, name: groupName};
                    }
                }));
            }
        });
    };

    const addComplex = () => {
        postComplexAPI(group.id).then(data => data.success && setComplexes(prev => prev.map(cur_group => {
                if (group.id != cur_group.id) {
                    return cur_group;
                } else {
                    return {
                        ...cur_group,
                        properties: [
                            ...cur_group.properties, {
                                'id': data.result.id,
                                'name': 'Новый комплекс',
                                'points': '0'
                            }
                        ]
                    };
                }
            })));
    };

    const changeComplex = (id, name, points) => {
        changeComplexAPI(id, name, points).then(data => data.success && setComplexes(prev => prev.map(cur_group => {
            if (group.id !== cur_group.id) {
                return cur_group;
            } else {
              return {
                  ...cur_group,
                  properties: cur_group.properties.map(cur_prop => {
                      if (cur_prop.id !== id) {
                          return cur_prop;
                      } else {
                          return {
                              'id': cur_prop.id,
                              'name': name,
                              'points': points
                          };
                      }
                  })
              };
            }
        })));
    };

    return (
      <div className={styles['container']}>
        <div className={styles['header']}>
          {!editMode && groupName}
          {editMode && <input className={styles['name']} type='text' value={groupName} onChange={e=> setGroupName(e.target.value)} />}
          <IconButton icon={plus_icon} onClick={() => addComplex()} />
          {!editMode && <IconButton icon={edit_icon} onClick={() => setEditMode(true)} />}
          {editMode && <IconButton icon={confirm_icon} onClick={() => {setEditMode(false); changeGroup();}} />}
          <IconButton icon={trash_icon} onClick={() => deleteGroup()} />
        </div>
        <div className={styles['complex_container']}>
          {group.properties.map(complex => <ComplexWidget key={complex.id} complex={complex} deleteComplex={deleteComplex} changeComplex={changeComplex} />)}
        </div>
      </div>
    );
};


export default ComplexGroupWidget;