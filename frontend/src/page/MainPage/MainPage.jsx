import cn from 'classnames';
import styles from './MainPage.module.css';
import NavigateButton from '../../component/button/NavigateButton/NavigateButton';
import LogoutButton from '../../component/button/LogoutButton/LogoutButton';

const MainPage = () => {
    return (
      <div className={cn('container_column')}>
        <div className={cn('header_menu')}>
          <LogoutButton />
        </div>
        <div className={cn('container_column')}>
          <NavigateButton label='Аттестация' to='/attestations/' />
          <NavigateButton label='Участники' to='/participants/' />
          <NavigateButton label='Подгруппы' to='/groups/' />
          <NavigateButton label='Настройки' to='/options/' />
        </div>
      </div>
    );
};


export default MainPage;