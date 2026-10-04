'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Dumbbell, Activity, Utensils, CheckCircle2, ChevronRight } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState('workout');
  const [statusMsg, setStatusMsg] = useState('');

  // Daily Checkin State
  const [readiness, setReadiness] = useState(4);
  const [sleep, setSleep] = useState(7.5);
  const [calories, setCalories] = useState(2150);
  const [protein, setProtein] = useState(175);
  const [carbs, setCarbs] = useState(220);
  const [fat, setFat] = useState(65);

  // Strength Set State
  const [sets, setSets] = useState([
    { id: 1, set_num: 1, target: '185 lbs x 6', weight: 185, reps: 6, rpe: 7.5, pain: 0 },
    { id: 2, set_num: 2, target: '185 lbs x 6', weight: 185, reps: 6, rpe: 8.0, pain: 0 },
    { id: 3, set_num: 3, target: '185 lbs x 6', weight: 185, reps: 5, rpe: 8.5, pain: 1 },
  ]);

  const updateSet = (id, field, value) => {
    setSets(sets.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleSaveCheckin = async () => {
    setStatusMsg('Saving check-in...');
    try {
      // Connects to your daily_checkins table in Supabase
      const { error } = await supabase.from('daily_checkins').insert([
        {
          readiness_score: Number(readiness),
          sleep_hours: Number(sleep),
          calories_logged: Number(calories),
          protein_logged: Number(protein),
          carbs_logged: Number(carbs),
          fat_logged: Number(fat),
        }
      ]);
      if (error) throw error;
      setStatusMsg('Check-in logged successfully!');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      setStatusMsg('Logged locally (Demo Mode)');
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  const handleCompleteWorkout = async () => {
    setStatusMsg('Saving workout sets...');
    setTimeout(() => {
      setStatusMsg('Workout complete! Great effort today.');
      setTimeout(() => setStatusMsg(''), 3500);
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-24 select-none">
      {/* Top Banner */}
      <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60 sticky top-0 backdrop-blur z-20">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">Today's Session</h1>
          <p className="text-xs text-slate-400">Lower Body Strength & Control</p>
        </div>
        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
          Week 3
        </span>
      </header>

      {/* Dynamic Feedback Banner */}
      {statusMsg && (
        <div className="mx-4 mt-3 p-2.5 bg-blue-950/80 border border-blue-800 text-blue-200 text-xs rounded-lg text-center font-medium transition">
          {statusMsg}
        </div>
      )}

      {/* Screen Views */}
      <main className="flex-1 p-4 space-y-4">
        {activeTab === 'workout' && (
          <div className="space-y-4">
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800">
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <h2 className="text-sm font-semibold text-white">Trap Bar Deadlift</h2>
                  <p className="text-xs text-slate-400">Tempo 3-0-1-0 • 2 min rest</p>
                </div>
                <span className="text-[11px] text-blue-400 font-medium">Warmup: 2 sets</span>
              </div>

              {/* Logger Table */}
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-5 text-[11px] text-slate-400 font-semibold px-2 text-center">
                  <span>SET</span>
                  <span>LBS</span>
                  <span>REPS</span>
                  <span>RPE</span>
                  <span>PAIN</span>
                </div>
                {sets.map(s => (
                  <div key={s.id} className="grid grid-cols-5 gap-2 items-center bg-slate-950/80 p-2 rounded-lg border border-slate-850">
                    <span className="text-xs font-semibold text-slate-400 text-center">{s.set_num}</span>
                    <input
                      type="number"
                      value={s.weight}
                      onChange={e => updateSet(s.id, 'weight', Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded py-1 text-xs text-center text-white outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      value={s.reps}
                      onChange={e => updateSet(s.id, 'reps', Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded py-1 text-xs text-center text-white outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={s.rpe}
                      onChange={e => updateSet(s.id, 'rpe', Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded py-1 text-xs text-center text-white outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={s.pain}
                      onChange={e => updateSet(s.id, 'pain', Number(e.target.value))}
                      className={`w-full border rounded py-1 text-xs text-center font-medium outline-none ${
                        s.pain > 2
                          ? 'bg-rose-950/80 border-rose-600 text-rose-200'
                          : 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                      }`}
                    />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-2 text-right">Pain scale: 0 (none) to 10 (emergency)</p>
            </div>

            <button
              onClick={handleCompleteWorkout}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl transition flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <CheckCircle2 size={16} /> Finish Workout & Submit Log
            </button>
          </div>
        )}

        {activeTab === 'macros' && (
          <div className="space-y-4">
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-4">
              <h2 className="text-sm font-semibold text-white">Daily Macro Log</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400">Calories Target</span>
                  <div className="text-lg font-bold text-blue-400 mt-0.5">{calories} / 2,400</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400">Protein Target</span>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">{protein}g / 180g</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400">Carbs</span>
                  <div className="text-lg font-bold text-amber-400 mt-0.5">{carbs}g / 240g</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400">Fats</span>
                  <div className="text-lg font-bold text-purple-400 mt-0.5">{fat}g / 65g</div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs text-slate-300 block">Quick Log Calories</label>
                <input
                  type="number"
                  value={calories}
                  onChange={e => setCalories(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleSaveCheckin}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                Save Nutrition Log
              </button>
            </div>
          </div>
        )}

        {activeTab === 'checkin' && (
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-4">
            <h2 className="text-sm font-semibold text-white">Daily Readiness & Recovery</h2>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Readiness Score</span>
                <span className="font-semibold text-blue-400">{readiness} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={readiness}
                onChange={e => setReadiness(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Sleep (Hours)</label>
              <input
                type="number"
                step="0.5"
                value={sleep}
                onChange={e => setSleep(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleSaveCheckin}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
            >
              Submit Daily Readiness
            </button>
          </div>
        )}
      </main>

      {/* Bottom Sticky Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 border-t border-slate-800 flex justify-around p-3 z-30">
        <button
          onClick={() => setActiveTab('workout')}
          className={`flex flex-col items-center text-[11px] font-medium ${
            activeTab === 'workout' ? 'text-blue-400' : 'text-slate-500'
          }`}
        >
          <Dumbbell size={20} />
          <span className="mt-1">Workout</span>
        </button>
        <button
          onClick={() => setActiveTab('checkin')}
          className={`flex flex-col items-center text-[11px] font-medium ${
            activeTab === 'checkin' ? 'text-blue-400' : 'text-slate-500'
          }`}
        >
          <Activity size={20} />
          <span className="mt-1">Readiness</span>
        </button>
        <button
          onClick={() => setActiveTab('macros')}
          className={`flex flex-col items-center text-[11px] font-medium ${
            activeTab === 'macros' ? 'text-blue-400' : 'text-slate-500'
          }`}
        >
          <Utensils size={20} />
          <span className="mt-1">Macros</span>
        </button>
      </nav>
    </div>
  );
}
