import styles from './AuthLayout.module.css';
import { Outlet } from 'react-router';
import cn from 'classnames';

const AuthLayout = () => {
    return (
      <div className={cn('container_column')}>
        <Outlet />
      </div>
    );
};


export default AuthLayout;