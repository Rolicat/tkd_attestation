import styles from './BeltDemands.module.css';
import cn from 'classnames';
import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import DemandWidget from '../../component/widget/DemandWidget/DemandWidget';
import AdditionalDemandWidget from '../../component/widget/AdditionalDemandWidget/AdditionalDemandWidget';
import PhysicalDemandWidget from '../../component/widget/PhysicalDemandWidget/PhysicalDemandWidget';
import { useEffect, useState } from 'react';
import SelectInput from '../../component/input/SelectInput/SelectInput';

import { getBeltDemandsAPI, getBeltsAPI, getAdditionalDemandsAPI, getPhysicalDemandsAPI } from '../../api/api';

const BeltDemands = () => {
    const [belts, setBelts] = useState([]);
    const [demands, setDemands] = useState([]);
    const [selectedBelt, setSelectedBelt] = useState(1);
    const [additionalDemands, setAdditionalDemands] = useState([]);
    const [physicalDemands, setPhysicalDemands] = useState([]);

    useEffect(() => {
        getBeltsAPI().then(data => data.success && setBelts(data.result));
        getBeltDemandsAPI(1).then(data => data.success && setDemands(data.result));
        getAdditionalDemandsAPI(1).then(data => data.success && setAdditionalDemands(data.result));
        getPhysicalDemandsAPI(1).then(data => data.success && setPhysicalDemands(data.result));
    }, []);

    useEffect(() => {
        getBeltDemandsAPI(selectedBelt).then(data => data.success && setDemands(data.result));
        getAdditionalDemandsAPI(selectedBelt).then(data => data.success && setAdditionalDemands(data.result));
        getPhysicalDemandsAPI(selectedBelt).then(data => data.success && setPhysicalDemands(data.result));
    }, [selectedBelt]);

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
          {physicalDemands.map(demand => <PhysicalDemandWidget key={demand.test.id} demand={demand} setPhysicalDemands={setPhysicalDemands} belt={selectedBelt} />)}
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