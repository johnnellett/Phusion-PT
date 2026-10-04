'use client';

import React, { useState } from 'react';
import { 
  Dumbbell, 
  Activity, 
  Flame, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  HeartPulse,
  TrendingUp,
  Moon,
  Clock
} from 'lucide-react';

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState('workout');
  const [statusMsg, setStatusMsg] = useState('');

  // Daily Checkin State
  const [readiness, setReadiness] = useState(4);
  const [sleep, setSleep] = useState(7.5);
  const [soreness, setSoreness] = useState(2);

  // Nutrition State
  const [calories, setCalories] = useState(2150);
  const [protein, setProtein] = useState(175);
  const [carbs, setCarbs] = useState(220);
  const [fat, setFat] = useState(65);

  // Targets
  const targetCalories = 2400;
  const targetProtein = 180;
  const targetCarbs = 240;
  const targetFat = 70;

  // Exercise Logger State
  const [sets, setSets] = useState([
    { id: 1, set_num: 1, weight: 185, reps: 6, rpe: 7.5, pain: 0, completed: true },
    { id: 2, set_num: 2, weight: 185, reps: 6, rpe: 8.0, pain: 0, completed: true },
    { id: 3, set_num: 3, weight: 185, reps: 5, rpe: 8.5, pain: 1, completed: false },
  ]);

  const updateSet = (id, field, value) => {
    setSets(sets.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const toggleSetComplete = (id) => {
    setSets(sets.map(s => (s.id === id ? { ...s, completed: !s.completed } : s)));
  };

  const handleSave = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const completedSetsCount = sets.filter(s => s.completed).length;
  const workoutProgress = Math.round((completedSetsCount / sets.length) * 100);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#080B11] text-slate-100 flex flex-col font-sans pb-28 selection:bg-blue-500/30">
      
      {/* Top Header & Session Hero */}
      <header className="p-5 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Phase 2 • Week 3</span>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Day 1 of 4
          </span>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">Lower Body Strength</h1>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <Clock size={12} className="text-slate-500" /> ~45 min • Posterior Chain Focus
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-blue-400">{workoutProgress}%</span>
            <div className="w-16 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${workoutProgress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Dynamic Feedback Toast */}
      {statusMsg && (
        <div className="mx-4 mt-3 p-3 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs rounded-xl text-center font-medium shadow-lg backdrop-blur animate-in fade-in slide-in-from-top-2">
          {statusMsg}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 space-y-4">
        
        {/* WORKOUT TAB */}
        {activeTab === 'workout' && (
          <div className="space-y-4">
            
            {/* Exercise Card */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-slate-800/80 shadow-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">A1</span>
                    <h2 className="text-sm font-bold text-white tracking-tight">Trap Bar Deadlift</h2>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Tempo <span className="text-slate-300 font-medium">3-0-1-0</span> • 2 min rest</p>
                </div>
                <button className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition">
                  Form Cue
                </button>
              </div>

              {/* Set Logger Matrix */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-6 text-[10px] uppercase font-bold text-slate-500 px-1 text-center">
                  <span>Set</span>
                  <span>Lbs</span>
                  <span>Reps</span>
                  <span>RPE</span>
                  <span>Pain</span>
                  <span>Done</span>
                </div>

                {sets.map((s) => (
                  <div 
                    key={s.id} 
                    className={`grid grid-cols-6 gap-1.5 items-center p-2 rounded-xl border transition-all ${
                      s.completed 
                        ? 'bg-blue-950/20 border-blue-500/30' 
                        : 'bg-slate-950/60 border-slate-800/80'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-400 text-center">{s.set_num}</span>
                    
                    <input
                      type="number"
                      value={s.weight}
                      onChange={(e) => updateSet(s.id, 'weight', Number(e.target.value))}
                      className="bg-slate-900 border border-slate-800 rounded-lg py-1 text-xs text-center font-semibold text-white outline-none focus:border-blue-500"
                    />

                    <input
                      type="number"
                      value={s.reps}
                      onChange={(e) => updateSet(s.id, 'reps', Number(e.target.value))}
                      className="bg-slate-900 border border-slate-800 rounded-lg py-1 text-xs text-center font-semibold text-white outline-none focus:border-blue-500"
                    />

                    <input
                      type="number"
                      step="0.5"
                      value={s.rpe}
                      onChange={(e) => updateSet(s.id, 'rpe', Number(e.target.value))}
                      className="bg-slate-900 border border-slate-800 rounded-lg py-1 text-xs text-center font-semibold text-white outline-none focus:border-blue-500"
                    />

                    {/* Pain rating with red warning indicator */}
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={s.pain}
                      onChange={(e) => updateSet(s.id, 'pain', Number(e.target.value))}
                      className={`border rounded-lg py-1 text-xs text-center font-bold outline-none transition ${
                        s.pain > 0 
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 focus:border-blue-500'
                      }`}
                    />

                    <button
                      onClick={() => toggleSetComplete(s.id)}
                      className={`h-7 w-7 rounded-lg flex items-center justify-center mx-auto transition-all ${
                        s.completed 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                          : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                      }`}
                    >
                      <CheckCircle2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                <span>RPE: Rate of Perceived Exertion (1–10)</span>
                <span>Pain scale: 0–10</span>
              </div>
            </div>

            <button
              onClick={() => handleSave('Workout completed and synced with your coach!')}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} /> Complete Today's Workout
            </button>
          </div>
        )}

        {/* NUTRITION & MACROS TAB */}
        {activeTab === 'macros' && (
          <div className="space-y-4">
            {/* Calories Card */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border border-slate-800/80 shadow-xl space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Caloric Target</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-white">{calories}</span>
                    <span className="text-xs text-slate-500 font-medium">/ {targetCalories} kcal</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Flame size={20} />
                </div>
              </div>

              {/* Calorie bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min(100, (calories / targetCalories) * 100)}%` }}
                />
              </div>

              {/* 3 Macro Pillars */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Protein</span>
                  <p className="text-sm font-extrabold text-emerald-400 mt-0.5">{protein}g</p>
                  <span className="text-[10px] text-slate-500">Goal: {targetProtein}g</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Carbs</span>
                  <p className="text-sm font-extrabold text-amber-400 mt-0.5">{carbs}g</p>
                  <span className="text-[10px] text-slate-500">Goal: {targetCarbs}g</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Fats</span>
                  <p className="text-sm font-extrabold text-purple-400 mt-0.5">{fat}g</p>
                  <span className="text-[10px] text-slate-500">Goal: {targetFat}g</span>
                </div>
              </div>

              {/* Quick Log Input */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <label className="text-[11px] font-semibold text-slate-300 block">Log Calories for Today</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleSave('Daily macros saved!')}
                    className="px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* READINESS & WELLNESS TAB */}
        {activeTab === 'checkin' && (
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border border-slate-800/80 shadow-xl space-y-5">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <HeartPulse size={16} className="text-blue-400" /> Daily Readiness Score
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Helps your coach regulate training volume and recovery.</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-400">Readiness / Energy</span>
                  <span className="text-blue-400">{readiness} of 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={readiness}
                  onChange={(e) => setReadiness(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Drained</span>
                  <span>Peak Energy</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-400">Muscle Soreness</span>
                  <span className="text-amber-400">{soreness} of 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={soreness}
                  onChange={(e) => setSoreness(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Sleep Duration</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={sleep}
                    onChange={(e) => setSleep(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500">hours</span>
                </div>
              </div>

              <button
                onClick={() => handleSave('Readiness survey submitted to your coach!')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition active:scale-[0.99]"
              >
                Submit Readiness
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modern Floating Bottom Navigation */}
      <nav className="fixed bottom-3 left-4 right-4 max-w-[390px] mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl flex justify-around p-2 z-40">
        <button
          onClick={() => setActiveTab('workout')}
          className={`flex flex-col items-center py-1.5 px-4 rounded-xl transition ${
            activeTab === 'workout' 
              ? 'text-blue-400 bg-blue-500/10 font-semibold' 
              : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          <Dumbbell size={18} />
          <span className="text-[10px] mt-1">Workout</span>
        </button>
        <button
          onClick={() => setActiveTab('checkin')}
          className={`flex flex-col items-center py-1.5 px-4 rounded-xl transition ${
            activeTab === 'checkin' 
              ? 'text-blue-400 bg-blue-500/10 font-semibold' 
              : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          <Activity size={18} />
          <span className="text-[10px] mt-1">Readiness</span>
        </button>
        <button
          onClick={() => setActiveTab('macros')}
          className={`flex flex-col items-center py-1.5 px-4 rounded-xl transition ${
            activeTab === 'macros' 
              ? 'text-blue-400 bg-blue-500/10 font-semibold' 
              : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          <Flame size={18} />
          <span className="text-[10px] mt-1">Macros</span>
        </button>
      </nav>

    </div>
  );
}
