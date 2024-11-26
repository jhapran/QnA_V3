import { Navigate, Route, Routes } from 'react-router-dom';
import { SettingsLayout } from '../../components/settings/SettingsLayout';
import { Profile } from './profile';
import { Security } from './security';
import { Notifications } from './notifications';

export function Settings() {
  return (
    <SettingsLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/settings/profile" replace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/security" element={<Security />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </SettingsLayout>
  );
}