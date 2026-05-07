import { useState } from 'react';
import type { UserProfile, CoupleProfile } from './types';
import Header from './components/Header';
import InputForm from './components/InputForm';
import SajuResult from './components/SajuResult';
import CoupleInputForm from './components/CoupleInputForm';
import CoupleResult from './components/CoupleResult';
import ProfileList from './components/ProfileList';

type View = 'form' | 'result' | 'couple-result' | 'profiles';
type FormMode = 'individual' | 'couple';

export default function App() {
  const [view, setView] = useState<View>('form');
  const [formMode, setFormMode] = useState<FormMode>('individual');
  const [activeTab, setActiveTab] = useState<'form' | 'profiles'>('form');
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [currentCouple, setCurrentCouple] = useState<CoupleProfile | null>(null);
  const [profilesRefreshKey, setProfilesRefreshKey] = useState(0);

  function handleTabChange(tab: 'form' | 'profiles') {
    setActiveTab(tab);
    setView(tab);
    if (tab === 'profiles') setProfilesRefreshKey(k => k + 1);
  }

  function handleBack() {
    setView(activeTab);
    if (activeTab === 'profiles') setProfilesRefreshKey(k => k + 1);
  }

  function handleDelete() {
    setProfilesRefreshKey(k => k + 1);
    setView('profiles');
    setActiveTab('profiles');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={handleTabChange} currentView={view} />

      <main className="pb-16">
        {view === 'form' && (
          <>
            <div className="max-w-lg mx-auto px-4 pt-6">
              <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setFormMode('individual')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${formMode === 'individual' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  👤 개인 분석
                </button>
                <button
                  onClick={() => setFormMode('couple')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${formMode === 'couple' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  💑 커플 분석
                </button>
              </div>
            </div>

            {formMode === 'individual' ? (
              <InputForm onResult={profile => { setCurrentProfile(profile); setView('result'); }} />
            ) : (
              <CoupleInputForm onResult={couple => { setCurrentCouple(couple); setView('couple-result'); }} />
            )}
          </>
        )}

        {view === 'result' && currentProfile && (
          <SajuResult profile={currentProfile} onBack={handleBack} onDelete={handleDelete} />
        )}

        {view === 'couple-result' && currentCouple && (
          <CoupleResult couple={currentCouple} onBack={handleBack} onDelete={handleDelete} />
        )}

        {view === 'profiles' && (
          <ProfileList
            onSelectIndividual={profile => { setCurrentProfile(profile); setView('result'); }}
            onSelectCouple={couple => { setCurrentCouple(couple); setView('couple-result'); }}
            onNew={() => { setActiveTab('form'); setView('form'); }}
            refreshKey={profilesRefreshKey}
          />
        )}
      </main>
    </div>
  );
}
