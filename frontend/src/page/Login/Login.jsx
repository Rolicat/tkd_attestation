import styles from './Login.module.css';
import LabelInput from '../../component/input/LabelInput/LabelInput';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import cn from 'classnames';
import SubmitButton from '../../component/button/SubmitButton/SubmitButton';
import { registerUserAPI, getTokenAPI } from '../../api/api';
import { tokenStore } from '../../store/store';


const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const loginUser = () => {
        getTokenAPI(login, password).then(data => {
            if (data.success) {
                tokenStore.setToken(data.result.access);
                navigate('/');
            }
        });
    };

    const registerUser = () => {
        registerUserAPI(login, password).then(data => {
          if (data.success) {
              getTokenAPI(login, password).then(data => {
                  if (data.success) {
                      tokenStore.setToken(data.result.access);
                      navigate('/');
                  }
              });
           } else {
              alert(data.result.username);
           }
        });
    };

    return (
      <div className={styles['container']}>
        <div className={cn('font24', styles['header'])}>
          Вход / Регистрация
        </div>
        <LabelInput type='text' label='Логин' id='login' name='login' placeholder='Введите логин' value={login} onChange={setLogin}/>
        <LabelInput type='password' label='Пароль' id='pswd' name='pswd' placeholder='Введите пароль' value={password} onChange={setPassword}/>
        <div className={styles['menu_row']}>
          <SubmitButton label='Вход' onClick={loginUser} />
          <SubmitButton label='Регистрация' onClick={registerUser} />
        </div>
      </div>
    );
};


export default Login;