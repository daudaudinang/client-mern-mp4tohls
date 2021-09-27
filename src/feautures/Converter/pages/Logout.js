import { Redirect } from 'react-router-dom';

export const Logout = ({handleLogout}) => {
    handleLogout();
    return(
        <div>Logout</div>
    )
}
