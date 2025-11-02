import styles from './AdditionalTestPage.module.css';
import cn from 'classnames';
import plus_icon from '/plus.png';
import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import IconButton from '../../component/button/IconButton/IconButton';
import { useEffect, useState } from 'react';
import { getCriteriaTreeAPI, postAdditionalTestAPI } from '../../api/api';
import AdditionalTestWidget from '../../component/widget/AdditionalTestWidget/AdditionalTestWidget';


const AdditionalTestPage = () => {
    const [tests, setTests] = useState([]);

    useEffect(() => {
        getCriteriaTreeAPI().then(data => data.success && setTests(data.result));
    }, []);

    const addTest = () => {
        postAdditionalTestAPI().then(data => {
            if (data.success){
                setTests(prev => [
                    ...prev,
                    {
                        'id': data.result.id,
                        'name': 'Новый комплекс',
                        'properties': []
                    }
                  ]
                );
            }
          });
    };

    return (
      <div className={cn('container_column', styles['align_top'])}>
        <div className={cn('header_menu')}>
          <BackwardButton label='Назад' to='/options' />
        </div>
        <div className={cn('container_column', styles['align_top'])}>
          <div className={cn('font24')}>
            Дополнительные комплексы
          </div>
          <div className={styles['submenu']}>
            <IconButton label='Добавить комплекс' icon={plus_icon} onClick={() => addTest()}/>
          </div>
          {tests.map(test => <AdditionalTestWidget key={test.id} test={test} setTests={setTests} />)}
        </div>
      </div>
    );
};


export default AdditionalTestPage;