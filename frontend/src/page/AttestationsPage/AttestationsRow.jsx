import { useNavigate } from 'react-router';
import styles from './AttestationsPage.module.css';
import cn from 'classnames';
import IconButton from '../../component/button/IconButton/IconButton';
import refresh_icon from '/refresh.png';
import flag_icon from '/flag.png';
import list_icon from '/list.png';
import play_icon from '/play.png';
import { changeGroupAPI, restartGroupAPI } from '../../api/api';


const AttestationsRow = ({ record, setRecords }) => {
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

    return (
      <div className={styles['row']}>
          <div className={cn(styles['width100'], styles['row_menu'])}>
            {record.status == 'Ожидание' && <IconButton icon={flag_icon} onClick={() => startAttestation()}/>}
            {record.status == 'В процессе' && <div className={styles['row_menu']}>
              <IconButton icon={refresh_icon} onClick={() => restartAttestation()}/>
              <IconButton icon={play_icon} onClick={() => continueAttestation()}/>
            </div>}
            {record.status == 'Завершено' && <IconButton icon={list_icon} />}
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