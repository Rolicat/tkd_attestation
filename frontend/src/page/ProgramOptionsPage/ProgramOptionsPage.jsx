import styles from './ProgramOptionsPage.module.css';
import cn from 'classnames';
import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import { useEffect, useState } from 'react';
import { getOptionsAPI, getUsersAPI, postOptionsAPI} from '../../api/api';
import LabelInput from '../../component/input/LabelInput/LabelInput';
import SelectInput from '../../component/input/SelectInput/SelectInput';


const ProgramOptionsPage = () => {
    const [participantsInRow, setParticipantsInRow] = useState(1);
    const [pointsCalc, setPointsCalc] = useState(0);
    const [whoFinish, setWhoFinish] = useState();
    const [whoFinishOptions, setWhoFinishOptions] = useState([]);

    const pointsCalcOptions = [
      { id: 0, name: 'Средний балл'},
      { id: 1, name: 'Общий балл'}
    ];

    const saveOption = (name, value) => {
        postOptionsAPI(name, value);
    };

    useEffect(() => {
        getOptionsAPI().then(data => data.success &&
            data.result.forEach(option => {
                if (option.name == 'participants_in_row') {
                    setParticipantsInRow(option.value);
                }
                else if (option.name == 'points_calc') {
                    setPointsCalc(option.value);
                }
                else if (option.name == 'who_finished_attestation') {
                    setWhoFinish(option.value);
                }
            })
        );
        getUsersAPI().then(data => data.success && setWhoFinishOptions(data.result.map(el => {return {'id': el.id, 'name': el.username};})));
    }, []);

    return (
      <div className={cn('container_column', styles['align_top'])}>
        <div className={cn('header_menu')}>
          <BackwardButton label='Назад' to='/options' />
        </div>
        <div className={cn('container_column', styles['align_top'])}>
          <div className={cn('font24')}>
            Настройки программы
          </div>
          <div>
            <LabelInput label='Спортсменов в ряд' type='number' value={participantsInRow}
              onChange={(val) => {setParticipantsInRow(val); saveOption('participants_in_row', val);}} />
          </div>
          <div>
            <SelectInput label='Подсчет баллов по комплексу' value={pointsCalc} options={pointsCalcOptions}
              onChange={(val) => {setPointsCalc(val); saveOption('points_calc', val);}} />
          </div>
          <div>
            <SelectInput label='Кто заканчивает аттестацию' value={whoFinish} options={whoFinishOptions} 
              onChange={(val) => {setWhoFinish(val); saveOption('who_finished_attestation', val);}} />
          </div>
        </div>
      </div>
    );
};


export default ProgramOptionsPage;