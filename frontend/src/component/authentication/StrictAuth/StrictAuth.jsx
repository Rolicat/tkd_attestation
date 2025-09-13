import { tokenStore } from '../../../store/store';


const StrictAuth = ({ children }) => {
    if (tokenStore.token == null || tokenStore.token == undefined) {
        window.location.href = '/auth/login/';
    }
    return children;
};


export default StrictAuth;