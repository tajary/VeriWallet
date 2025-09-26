import Header from './Header';
import MyCredentials from './MyCredentials';
import AvailableCredentials from './AvailableCredentials';
import { useState } from 'react';

export default function Dashboard() {

  const [updateData, setUpdateData] = useState(0);

  function onUpdate() {
    setUpdateData(updateData+1);
  }
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <MyCredentials updateData={updateData}/>
        <AvailableCredentials onUpdate={onUpdate} />
      </main>
    </div>
  );
}