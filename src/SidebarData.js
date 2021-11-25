import React from 'react';
import * as BsIcons from 'react-icons/bs';
export const SidebarData = [
  {
    title: 'Home',
    path: './MainScreen',
    icon: <BsIcons.BsPersonBoundingBox />,
    cName: 'nav-text'
  },
  {
    title: 'all',
    path: './pages/all',
    icon: <BsIcons.BsFillHouseDoorFill />,
    cName: 'nav-text'
  },
  {
    title: 'completed',
    path: './pages/completed',
    icon: <BsIcons.BsFillInfoCircleFill />,
    cName: 'nav-text'
  },
  {
    title: 'not completed',
    path: './pages/not_completed',
    icon: <BsIcons.BsEnvelopeFill />,
    cName: 'nav-text'
  },
  {
    title: 'daily',
    path: './pages/daily',
    icon: <BsIcons.BsEnvelopeFill />,
    cName: 'nav-text'
  }
];