import { useNavigate } from 'react-router';
import styles from './AttestationsPage.module.css';
import cn from 'classnames';
import IconButton from '../../component/button/IconButton/IconButton';
import refresh_icon from '/refresh.png';
import flag_icon from '/flag.png';
import list_icon from '/list.png';
import play_icon from '/play.png';
import physical_icon from '/physical.png';
import additional_icon from '/additional.png';
import { changeGroupAPI, restartGroupAPI } from '../../api/api';


const AttestationsRow = ({ record, setRecords, showResults, isRuler }) => {
    const navigate = useNavigate();

    const restartAttestation = () => {
        restartGroupAPI(record.id).then(data => data.success &&
            setRecords(prev => prev.map(el => {
                if (el.id != record.id) {
                    return el;
                }
                else {
                    return {...el, status: 'Ожидание'};
                }
            }))
        );
    };
    const startAttestation = () => {
        changeGroupAPI(record.id, {'status': 'В процессе'}).then(data => {
            if (data.success) {
                return navigate(`/attestation/${record.id}`);
            }
        });
    };

    const continueAttestation = () => {
        return navigate(`/attestation/${record.id}`);
    };

    const physicalAttestation = () => {
        return navigate(`/physical_attestation/${record.id}`);
    };

    const additionalAttestation = () => {
        return navigate(`/additional_attestation/${record.id}`);
    };

    return (
      <div className={styles['row']}>
          <div className={cn(styles['width200'], styles['row_menu'])}>
            {isRuler && <span>
              {record.status == 'Ожидание' && <IconButton icon={flag_icon} onClick={() => startAttestation()}/>}
              {record.status == 'В процессе' && <div className={styles['row_menu']}>
                <IconButton icon={refresh_icon} onClick={() => restartAttestation()}/>
                <IconButton icon={play_icon} onClick={() => continueAttestation()}/>
                <IconButton icon={physical_icon} onClick={() => physicalAttestation()} />
                <IconButton icon={additional_icon} onClick={() => additionalAttestation()} />
              </div>}
            </span>
            }
            {record.status == 'Завершено' && <IconButton icon={list_icon} onClick={() => showResults(record.id)} />}
          </div>
          <div className={styles['width150']}>
              {record.name}
          </div>
          <div className={styles['width150']}>
            {record.status}
          </div>
        </div>
    );
};


export default AttestationsRow;