import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Login from './page/Login/Login';
import StrictAuth from './component/authentication/StrictAuth/StrictAuth';
import AuthLayout from './layout/AuthLayout/AuthLayout';
import MainPage from './page/MainPage/MainPage';
import ParticipantsPage from './page/ParticipantsPage/ParticipantsPage';
import GroupsPage from './page/GroupsPage/GroupsPage';
import OptionsPage from './page/OptionsPage/OptionsPage';
import AttestationsPage from './page/AttestationsPage/AttestationsPage';
import ComplexesPage from './page/ComplexesPage/ComplexesPage';
import BeltDemands from './page/BeltDemands/BeltDemands';
import AttestationsGroupPage from './page/AttestationsGroupPage/AttestationsGroupPage';


const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <StrictAuth><MainPage/></StrictAuth>
      },
      {
        path: 'attestations/',
        element: <AttestationsPage />
      },
      {
        path: 'attestation/:groupId',
        element: <AttestationsGroupPage />
      },
      {
        path: 'participants/',
        element: <ParticipantsPage />
      },
      {
        path: 'groups/',
        element: <GroupsPage />
      },
      {
        path: 'options/',
        element: <OptionsPage />
      },
      {
        path: 'complexes/',
        element: <ComplexesPage />
      },
      {
        path: 'belt_demands/',
        element: <BeltDemands />
      },
      {
        path: 'auth/',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <Login />
          }
        ]
      }
    ]
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);
