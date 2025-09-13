import cn from 'classnames';
import styles from './ComplexesPage.module.css';
import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import IconButton from '../../component/button/IconButton/IconButton';
import plus_icon from '/plus.png';
import { useEffect, useState } from 'react';
import ComplexGroupWidget from '../../component/widget/ComplexGroupWidget/ComplexGroupWidget';
import { getComplexTreeAPI, postComplexGroupAPI } from '../../api/api';


const ComplexesPage = () => {
    const [complexes, setComplexes] = useState([]);

    const addGroupComplex = () => {
        postComplexGroupAPI().then(data => {
          if (data.success){
              setComplexes(prev => [
                  ...prev,
                  {
                      'id': data.result.id,
                      'name': 'Новая группа',
                      'properties': []
                  }
                ]
              );
          }
        });
    };
    
    useEffect(() => {
        getComplexTreeAPI().then(data => data.success && setComplexes(data.result));
    }, []);

    return (
      <div className={cn('container_column', styles['align_top'])}>
        <div className={cn('header_menu')}>
          <BackwardButton label='Назад' to='/options' />
        </div>
        <div className={cn('container_column', styles['align_top'])}>
          <div className={cn('font24')}>
            Комплексы
          </div>
          <div className={styles['submenu']}>
            <IconButton label='Добавить группу' icon={plus_icon} onClick={() => addGroupComplex()}/>
          </div>
          {complexes.map(group => <ComplexGroupWidget key={group.id} group={group} setComplexes={setComplexes} />)}
        </div>
      </div>
    );
};


export default ComplexesPage;