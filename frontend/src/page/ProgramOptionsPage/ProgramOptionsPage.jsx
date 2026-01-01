import styles from './ProgramOptionsPage.module.css';
import cn from 'classnames';
import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import { useEffect, useState } from 'react';
import { getOptionsAPI, getUsersAPI, postOptionsAPI, postUploadComplexes, postUploadUpgrade } from '../../api/api';
import LabelInput from '../../component/input/LabelInput/LabelInput';
import SelectInput from '../../component/input/SelectInput/SelectInput';
import LabelCheckInput from '../../component/input/LabelCheckInput/LabelCheckInput';


const ProgramOptionsPage = () => {
    const [participantsInRow, setParticipantsInRow] = useState(1);
    const [whoFinish, setWhoFinish] = useState();
    const [whoFinishOptions, setWhoFinishOptions] = useState([]);
    const [allowRegistration, setAllowRegistration] = useState(true);

    const saveOption = (name, value) => {
        postOptionsAPI(name, value);
    };

    useEffect(() => {
        getOptionsAPI().then(data => data.success &&
            data.result.forEach(option => {
                if (option.name == 'participants_in_row') {
                    setParticipantsInRow(option.value);
                }
                else if (option.name == 'who_finished_attestation') {
                    setWhoFinish(option.value);
                }
                else if (option.name == 'registration_allowed') {
                    setAllowRegistration(option.value=='True' ? true : false);
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
            <SelectInput label='Кто заканчивает аттестацию' value={whoFinish} options={whoFinishOptions} 
              onChange={(val) => {setWhoFinish(val); saveOption('who_finished_attestation', val);}} />
          </div>
          <div>
            <LabelCheckInput label='Разрешить регистрацию' id='allow_registration' checked={allowRegistration}
              onChange={(val) => {setAllowRegistration(val); saveOption('registration_allowed', val);}} />
          </div>
          <div>
            Загрузить комплексы: 
            <input id='load_complexes' type='file' 
              onChange={(e) => postUploadComplexes(e.target.files).then(() => alert('Загрузка завершена.'))} />
          </div>
          <div>
            Загрузить обновление программы:
            <input id='load_upgrade' type='file' 
              onChange={(e) => postUploadUpgrade(e.target.files).then(() => alert('Файл успешно загружен. Обновите страницу через 1 мин.'))} />
          </div>
        </div>
      </div>
    );
};


export default ProgramOptionsPage;