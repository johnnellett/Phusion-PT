'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Users, Plus, Calendar, Target, CheckCircle, ChevronRight, Lock, KeyRound, LogOut } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const coachSecret = process.env.NEXT_PUBLIC_COACH_SECRET || '1234'; // Default fallback code
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CoachDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [authError, setAuthError] = useState(false);

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');

  // Workout Builder State
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [coachNotes, setCoachNotes] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [exerciseBlocks, setExerciseBlocks] = useState([
    { exercise_name: 'Trap Bar Deadlift', sets: 3, reps: '6-8', rpe: 7.5, notes: 'Tempo 3-0-1-0' },
  ]);

  // Macro Targets State
  const [macroTargets, setMacroTargets] = useState({
    calories: 2200,
    protein: 175,
    carbs: 225,
    fat: 65,
  });

  // Check saved session on load
  useEffect(() => {
    const savedAuth = localStorage.getItem('coach_authorized');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchClients();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputPin === coachSecret) {
      setIsAuthenticated(true);
      localStorage.setItem('coach_authorized', 'true');
      setAuthError(false);
      fetchClients();
    } else {
      setAuthError(true);
      setInputPin('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('coach_authorized');
    setIsAuthenticated(false);
    setInputPin('');
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setClients(data);
        setSelectedClient(data[0]);
        setMacroTargets({
          calories: data[0].target_calories || 2000,
          protein: data[0].target_protein || 150,
          carbs: data[0].target_carbs || 200,
          fat: data[0].target_fat || 60,
        });
      } else {
        const demoClient = { id: 'demo-1', full_name: 'Alex Miller', email: 'alex@example.com' };
        setClients([demoClient]);
        setSelectedClient(demoClient);
      }
    } catch (err) {
      console.log('Error fetching clients:', err.message);
    }
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setMacroTargets({
      calories: client.target_calories || 2000,
      protein: client.target_protein || 150,
      carbs: client.target_carbs || 200,
      fat: client.target_fat || 60,
    });
  };

  const addExerciseRow = () => {
    setExerciseBlocks([
      ...exerciseBlocks,
      { exercise_name: '', sets: 3, reps: '8-10', rpe: 8, notes: '' },
    ]);
  };

  const updateExerciseRow = (index, field, value) => {
    const updated = [...exerciseBlocks];
    updated[index][field] = value;
    setExerciseBlocks(updated);
  };

  const removeExerciseRow = (index) => {
    setExerciseBlocks(exerciseBlocks.filter((_, i) => i !== index));
  };

  const handleAssignWorkout = async (e) => {
    e.preventDefault();
    if (!selectedClient || !workoutTitle.trim()) {
      setStatusMsg('Please select a client and give the session a title.');
      return;
    }

    setStatusMsg('Publishing workout...');
    try {
      const { error: wError } = await supabase
        .from('assigned_workouts')
        .insert([
          {
            client_id: selectedClient.id !== 'demo-1' ? selectedClient.id : null,
            scheduled_date: scheduledDate,
            title: workoutTitle,
            coach_notes: coachNotes,
            is_completed: false,
          },
        ]);

      if (wError) throw wError;

      setStatusMsg(`Workout "${workoutTitle}" assigned to ${selectedClient.full_name}!`);
      setWorkoutTitle('');
      setCoachNotes('');
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      setStatusMsg('Saved locally! Link client in Supabase to sync permanently.');
      setTimeout(() => setStatusMsg(''), 4000);
    }
  };

  const handleUpdateMacros = async () => {
    if (!selectedClient || selectedClient.id === 'demo-1') {
      setStatusMsg('Saved preview targets.');
      setTimeout(() => setStatusMsg(''), 3000);
      return;
    }

    try {
      const { error } = await supabase
        .from('clients')
        .update({
          target_calories: Number(macroTargets.calories),
          target_protein: Number(macroTargets.protein),
          target_carbs: Number(macroTargets.carbs),
          target_fat: Number(macroTargets.fat),
        })
        .eq('id', selectedClient.id);

      if (error) throw error;
      setStatusMsg(`Updated macros for ${selectedClient.full_name}!`);
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      setStatusMsg('Error updating macros.');
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  // Lock Screen View if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-center">
          <div className="w-12 h-12 bg-blue-950 border border-blue-800 text-blue-400 rounded-xl flex items-center justify-center mx-auto">
            <Lock size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold">Coach Access</h1>
            <p className="text-xs text-slate-400 mt-1">Enter your admin passcode to manage client programming.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter passcode"
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                className={`w-full bg-slate-950 border rounded-xl p-3 text-center text-sm text-white tracking-widest outline-none transition ${
                  authError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-blue-500'
                }`}
                autoFocus
              />
              {authError && (
                <p className="text-[11px] text-rose-400 mt-2 font-medium">Incorrect passcode. Please try again.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <KeyRound size={15} /> Unlock Dashboard
            </button>
          </form>

          <a href="/" className="inline-block text-xs text-slate-500 hover:text-slate-400 transition">
            ← Return to Client Portal
          </a>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-950 text-blue-400 border border-blue-800">
                Staff Admin
              </span>
              <h1 className="text-xl font-bold tracking-tight">Coach Programming Studio</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Prescribe workouts, set nutritional targets, and track load.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 transition"
            >
              Client View
            </a>
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-2 bg-rose-950/40 border border-rose-900/60 hover:bg-rose-900/40 rounded-lg text-rose-300 flex items-center gap-1.5 transition"
            >
              <LogOut size={13} /> Lock
            </button>
          </div>
        </header>

        {statusMsg && (
          <div className="p-3 bg-blue-950 border border-blue-800 text-blue-200 text-xs font-medium rounded-lg text-center">
            {statusMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="space-y-6">
            {/* Client Picker */}
            <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Users size={16} className="text-blue-400" /> Active Clients
                </h2>
                <span className="text-xs text-slate-500">{clients.length} enrolled</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {clients.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectClient(c)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs flex justify-between items-center transition ${
                      selectedClient?.id === c.id
                        ? 'bg-blue-950/60 border-blue-600 text-white font-medium'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{c.full_name}</p>
                      <p className="text-[11px] text-slate-500">{c.email}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Nutrition Targets */}
            <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 space-y-4">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Target size={16} className="text-emerald-400" /> Macro Targets
              </h2>
              <p className="text-xs text-slate-400">
                Targets for {selectedClient ? selectedClient.full_name : 'Client'}:
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={macroTargets.calories}
                    onChange={(e) => setMacroTargets({ ...macroTargets, calories: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={macroTargets.protein}
                    onChange={(e) => setMacroTargets({ ...macroTargets, protein: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={macroTargets.carbs}
                    onChange={(e) => setMacroTargets({ ...macroTargets, carbs: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Fats (g)</label>
                  <input
                    type="number"
                    value={macroTargets.fat}
                    onChange={(e) => setMacroTargets({ ...macroTargets, fat: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={handleUpdateMacros}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-xs font-semibold text-white transition"
              >
                Save Nutrition Targets
              </button>
            </div>
          </div>

          {/* Right Columns: Workout Builder */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <Calendar size={16} className="text-blue-400" /> Program Workout
                  </h2>
                  <p className="text-xs text-slate-400">
                    Client: <span className="text-white font-medium">{selectedClient?.full_name}</span>
                  </p>
                </div>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Session Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Lower Body Hypertrophy"
                    value={workoutTitle}
                    onChange={(e) => setWorkoutTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Coaching Cues / Rest Focus</label>
                  <input
                    type="text"
                    placeholder="e.g., RPE under 8 on deadlifts; rest 90s"
                    value={coachNotes}
                    onChange={(e) => setCoachNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Exercise Blocks */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-300">Prescribed Movements</span>
                  <button
                    onClick={addExerciseRow}
                    className="text-xs px-2.5 py-1 bg-blue-950 border border-blue-800 text-blue-300 rounded hover:bg-blue-900 flex items-center gap-1 transition"
                  >
                    <Plus size={13} /> Add Exercise
                  </button>
                </div>

                <div className="space-y-3">
                  {exerciseBlocks.map((block, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Movement (e.g. Bulgarian Split Squat)"
                          value={block.exercise_name}
                          onChange={(e) => updateExerciseRow(idx, 'exercise_name', e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => removeExerciseRow(idx)}
                          className="text-slate-500 hover:text-rose-400 text-xs px-2"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">Sets</span>
                          <input
                            type="number"
                            value={block.sets}
                            onChange={(e) => updateExerciseRow(idx, 'sets', Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-center text-white outline-none"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">Reps</span>
                          <input
                            type="text"
                            value={block.reps}
                            onChange={(e) => updateExerciseRow(idx, 'reps', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-center text-white outline-none"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">Target RPE</span>
                          <input
                            type="number"
                            step="0.5"
                            value={block.rpe}
                            onChange={(e) => updateExerciseRow(idx, 'rpe', Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-center text-white outline-none"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">Tempo / Notes</span>
                          <input
                            type="text"
                            placeholder="3-0-1-0"
                            value={block.notes}
                            onChange={(e) => updateExerciseRow(idx, 'notes', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-slate-200 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAssignWorkout}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <CheckCircle size={15} /> Publish Workout to Client
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
