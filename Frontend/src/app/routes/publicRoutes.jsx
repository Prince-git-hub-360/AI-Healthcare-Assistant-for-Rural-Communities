import React from 'react';
import { HomePage } from '../../features/public/pages/Home/HomePage';
import { AboutPage } from '../../features/public/pages/About/AboutPage';

export const publicRoutes = [
  { path: 'landing', component: HomePage },
  { path: 'about', component: AboutPage },
];

export default publicRoutes;
