import styles from './BeltDemands.module.css';
import cn from 'classnames';
import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import DemandWidget from '../../component/widget/DemandWidget/DemandWidget';
import AdditionalDemandWidget from '../../component/widget/AdditionalDemandWidget/AdditionalDemandWidget';
import PhysicalDemandWidget from '../../component/widget/PhysicalDemandWidget/PhysicalDemandWidget';
import { useEffect, useState } from 'react';
import SelectInput from '../../component/input/SelectInput/SelectInput';
import IconButton from '../../component/button/IconButton/IconButton';
import plus_icon from '/plus.png';

import { getBeltDemandsAPI, getBeltsAPI, getAdditionalDemandsAPI, getPhysicalDemandsAPI, getAgePeriodsAPI } from '../../api/api';
import AgePeriodWidget from '../../component/widget/AgePeriodWidget/AgePeriodWidget';

const BeltDemands = () => {
    const [belts, setBelts] = useState([]);
    const [agePeriods, setAgePeriods] = useState([]);
    const [selectedAgePeriod, setSelectedAgePeriod] = useState(undefined);
    const [demands, setDemands] = useState([]);
    const [selectedBelt, setSelectedBelt] = useState(1);
    const [additionalDemands, setAdditionalDemands] = useState([]);
    const [physicalDemands, setPhysicalDemands] = useState([]);
    const [addAgePeriod, setAddAgePeriod] = useState(false);

    useEffect(() => {
        getBeltsAPI().then(data => data.success && setBelts(data.result));
        getAdditionalDemandsAPI(1).then(data => data.success && setAdditionalDemands(data.result));
        getBeltDemandsAPI(1).then(data => data.success && setDemands(data.result));
    }, []);

    useEffect(() => {
        if (addAgePeriod) {
            return;
        }
        getAgePeriodsAPI().then(data => { if (data.success) {
            setAgePeriods(data.result);
            if (data.result.length > 0) {
                setSelectedAgePeriod(data.result[0].id);
            }
          }
        });
    }, [addAgePeriod]);

    useEffect(() => {
        getBeltDemandsAPI(selectedBelt).then(data => data.success && setDemands(data.result));
        getAdditionalDemandsAPI(selectedBelt).then(data => data.success && setAdditionalDemands(data.result));
    }, [selectedBelt]);

    useEffect(() => {
        if (!selectedAgePeriod) {
            return;
        }
        getPhysicalDemandsAPI(selectedBelt, selectedAgePeriod).then(data => data.success && setPhysicalDemands(data.result));
    }, [selectedAgePeriod, selectedBelt]);

    return (
      <div className={cn('container_column', styles['align_top'])}>
        <div className={cn('header_menu')}>
          <BackwardButton label='Назад' to='/options' />
        </div>
        <div className={cn('container_column', styles['align_top'])}>
          <div className={cn('font24')}>
            Требования по поясам
          </div>
          <div>
            <SelectInput label='Пояс' options={belts} name='belt' value={selectedBelt} onChange={setSelectedBelt} />
          </div>
          {demands.map(demand => <DemandWidget key={demand.id}  demand={demand} setDemands={setDemands} belt={selectedBelt} />)}
        </div>
        <div className={cn('container_column', styles['align_top'])}>
          <div className={cn('font24')}>
            Физические комплексы
          </div>
          <div className={styles['submenu']}>
            <SelectInput label='Возраста' options={agePeriods} name='age_period' value={selectedAgePeriod} onChange={setSelectedAgePeriod} />
            <IconButton icon={plus_icon} label='Добавить возраста' onClick={() => setAddAgePeriod(true)}/>
            {addAgePeriod && <AgePeriodWidget setVisible={setAddAgePeriod} />}
          </div>
          {physicalDemands.map(demand => <PhysicalDemandWidget key={demand.test.id} demand={demand} setPhysicalDemands={setPhysicalDemands} belt={selectedBelt} agePeriod={selectedAgePeriod} />)}
        </div>
        <div className={cn('container_column', styles['align_top'])}>
          <div className={cn('font24')}>
            Дополнительные комплексы
          </div>
          {additionalDemands.map(demand => <AdditionalDemandWidget key={demand.id} demand={demand} setAdditionalDemands={setAdditionalDemands} belt={selectedBelt} />)}
        </div>
      </div>
    );
};


export default BeltDemands;