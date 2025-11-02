import styles from './AdditionalTestWidget.module.css';
import plus_icon from '/plus.png';
import trash_icon from '/trash.png';
import edit_icon from '/edit.png';
import confirm_icon from '/confirm.png';
import triangle_down from '/triangle_down.png';
import triangle_right from '/triangle_right.png';
import IconButton from '../../button/IconButton/IconButton';
import IconButtonNoBG from '../../button/IconButtonNoBG/IconButtonNoBG';
import CriteriaWidget from '../CriteriaWidget/CriteriaWidget';
import { useState } from 'react';
import { changeCriteriaAPI, changeAdditionalTestAPI, deleteAdditionalTestAPI, deleteCriteriaAPI, postCriteriaAPI } from '../../../api/api';


const AdditionalTestWidget = ({ test, setTests }) => {
    const [editMode, setEditMode] = useState(false);
    const [testName, setTestName] = useState(test.name);
    const [showProperties, setShowProperties] = useState(false);

    const deleteCriteria = (criteria_id) => {
        deleteCriteriaAPI(criteria_id).then(data => {
            if (data.success) {
                setTests(prev => prev.map(cur_test => {
                    if (test.id != cur_test.id) {
                        return cur_test;
                    } else {
                        cur_test.properties = cur_test.properties.filter(cur_criteria => cur_criteria.id != criteria_id);
                        return cur_test;
                    }
                  }
                ));
            }
          }
        );
    };

    const deleteTest = () => {
        deleteAdditionalTestAPI(test.id).then(data => {
            if (data.success) {
                setTests(prev => prev.filter(cur_test => cur_test.id != test.id));
            }
        });
    };

    const changeTest = () => {
        changeAdditionalTestAPI(test.id, testName).then(data => {
            if (data.success) {
                setTests(prev => prev.map(cur_test => {
                    if (cur_test.id !== test.id) {
                        return cur_test;
                    } else {
                        return {...cur_test, name: testName};
                    }
                }));
            }
        });
    };

    const addCriteria = () => {
        setShowProperties(true);
        postCriteriaAPI(test.id).then(data => data.success && setTests(prev => prev.map(cur_test => {
                if (test.id != cur_test.id) {
                    return cur_test;
                } else {
                    return {
                        ...cur_test,
                        properties: [
                            ...cur_test.properties, {
                                'id': data.result.id,
                                'name': 'Новый критерий',
                                'points': '0'
                            }
                        ]
                    };
                }
            })));
    };

    const changeCriteria = (id, name, points) => {
        changeCriteriaAPI(id, name, points).then(data => data.success && setTests(prev => prev.map(cur_test => {
            if (test.id !== cur_test.id) {
                return cur_test;
            } else {
              return {
                  ...cur_test,
                  properties: cur_test.properties.map(cur_prop => {
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
          {!editMode && showProperties && <IconButtonNoBG icon={triangle_down} onClick={() => setShowProperties(false)} />}
          {!editMode && !showProperties && <IconButtonNoBG icon={triangle_right} onClick={() => setShowProperties(true)} />}
          {!editMode && testName}
          {editMode && <input className={styles['name']} type='text' value={testName} onChange={e=> setTestName(e.target.value)} />}
          <IconButton icon={plus_icon} onClick={() => addCriteria()} />
          {!editMode && <IconButton icon={edit_icon} onClick={() => setEditMode(true)} />}
          {editMode && <IconButton icon={confirm_icon} onClick={() => {setEditMode(false); changeTest();}} />}
          <IconButton icon={trash_icon} onClick={() => deleteTest()} />
        </div>
        {showProperties && <div className={styles['complex_container']}>
          {test.properties.map(criteria => <CriteriaWidget key={criteria.id} criteria={criteria} deleteCriteria={deleteCriteria} changeCriteria={changeCriteria} />)}
        </div>}
      </div>
    );
};


export default AdditionalTestWidget;