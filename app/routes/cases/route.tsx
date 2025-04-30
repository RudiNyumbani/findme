import type { MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Cases' },
    { name: 'description', content: 'View case details' },
  ];
};

export default function Test() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <Outlet />
    </div>
  );
}
