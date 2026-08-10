import { Login } from '../../features/auth/pages/Login/Login';
import { Register } from '../../features/auth/pages/Register/Register';

export const authRoutes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];

export default authRoutes;
