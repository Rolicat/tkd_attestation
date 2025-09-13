import BackwardButton from '../../component/button/BackwardButton/BackwardButton';
import styles from './OptionsPage.module.css';
import cn from 'classnames';
import NavigateButton from '../../component/button/NavigateButton/NavigateButton';


const OptionsPage = () => {
    return (
      <div className={cn('container_column', styles['align_top'])}>
        <div className={cn('header_menu')}>
          <BackwardButton label='Назад' to='/' />
        </div>
        <div className={cn('container_column', styles['align_top'])}>
          <div className={cn('font24', styles['header'])}>
            Настройки
          </div>
          <NavigateButton label='Справочник комплексов' to='/complexes/' />
          <NavigateButton label='Требования к поясам' to='/belt_demands/' />
          <NavigateButton label='Прочие настройки' to='/program_options/' />
        </div>
      </div>
    );
};


export default OptionsPage;