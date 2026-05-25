import React, { useState, useEffect } from "react";

const SUPABASE_URL = "https://vfsimyiojhulpagnqzpb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmc2lteWlvamh1bHBhZ25xenBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzODg4ODEsImV4cCI6MjA5NDk2NDg4MX0.eJJXnrMKOlm6bg7wZdKqbjiq66vVmmqD889NK1dUBL4";

const HEADERS = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation",
};

const SEED_PLAYERS = [
  {name:"Alamin",position:"Defender",goals:3,assists:1,clean_sheets:17},
  {name:"Tobe",position:"Defender",goals:1,assists:2,clean_sheets:15},
  {name:"Dalu",position:"Defender",goals:0,assists:1,clean_sheets:8},
  {name:"Wavy",position:"Defender",goals:0,assists:0,clean_sheets:0},
  {name:"Ijora",position:"Defender",goals:2,assists:0,clean_sheets:6},
  {name:"Jagun Jagun",position:"Defender",goals:0,assists:0,clean_sheets:0},
  {name:"Kcee",position:"Defender",goals:0,assists:0,clean_sheets:0},
  {name:"Kosi",position:"Defender",goals:0,assists:0,clean_sheets:0},
  {name:"Godwin",position:"Defender",goals:0,assists:0,clean_sheets:0},
  {name:"Ayo",position:"Defender",goals:0,assists:0,clean_sheets:0},
  {name:"Ore",position:"Defender",goals:0,assists:0,clean_sheets:1},
  {name:"Aiboje",position:"Defender",goals:0,assists:0,clean_sheets:0},
  {name:"Jibola",position:"Defender",goals:0,assists:1,clean_sheets:2},
  {name:"Anthony",position:"Defender",goals:0,assists:0,clean_sheets:2},
  {name:"Flo",position:"Midfielder",goals:2,assists:4,clean_sheets:0},
  {name:"Linguini",position:"Midfielder",goals:0,assists:0,clean_sheets:0},
  {name:"Derick",position:"Midfielder",goals:1,assists:1,clean_sheets:0},
  {name:"Bright",position:"Midfielder",goals:1,assists:0,clean_sheets:0},
  {name:"Ebuka",position:"Midfielder",goals:0,assists:0,clean_sheets:0},
  {name:"Emeke",position:"Midfielder",goals:0,assists:0,clean_sheets:0},
  {name:"Nuru",position:"Midfielder",goals:2,assists:1,clean_sheets:0},
  {name:"Zirkzee",position:"Midfielder",goals:6,assists:3,clean_sheets:0},
  {name:"Cheta",position:"Midfielder",goals:0,assists:0,clean_sheets:0},
  {name:"Chibueze",position:"Midfielder",goals:2,assists:1,clean_sheets:0},
  {name:"Kelvin",position:"Midfielder",goals:7,assists:2,clean_sheets:0},
  {name:"Philip",position:"Midfielder",goals:0,assists:0,clean_sheets:0},
  {name:"Quan",position:"Midfielder",goals:3,assists:0,clean_sheets:0},
  {name:"Daniel",position:"Midfielder",goals:0,assists:0,clean_sheets:0},
  {name:"Calistus",position:"Midfielder",goals:1,assists:0,clean_sheets:0},
  {name:"Corne",position:"Midfielder",goals:1,assists:1,clean_sheets:0},
  {name:"Zikora",position:"Midfielder",goals:1,assists:1,clean_sheets:0},
  {name:"JJ",position:"Midfielder",goals:0,assists:3,clean_sheets:0},
  {name:"Osimhen",position:"Striker",goals:0,assists:0,clean_sheets:0},
  {name:"Zeebo",position:"Striker",goals:0,assists:0,clean_sheets:0},
  {name:"Dada",position:"Striker",goals:1,assists:0,clean_sheets:0},
  {name:"Sniper",position:"Striker",goals:12,assists:3,clean_sheets:0},
  {name:"Nimfas",position:"Striker",goals:16,assists:8,clean_sheets:0},
  {name:"Timo",position:"Striker",goals:1,assists:1,clean_sheets:0},
  {name:"James",position:"Striker",goals:0,assists:0,clean_sheets:0},
  {name:"Febe",position:"Striker",goals:0,assists:0,clean_sheets:0},
  {name:"Doctor",position:"Striker",goals:11,assists:2,clean_sheets:0},
  {name:"Chibuike",position:"Striker",goals:2,assists:5,clean_sheets:0},
  {name:"Tochukwu",position:"Striker",goals:0,assists:0,clean_sheets:0},
  {name:"Nonso",position:"Striker",goals:0,assists:1,clean_sheets:0},
  {name:"Montero",position:"Striker",goals:0,assists:0,clean_sheets:0},
  {name:"Henry",position:"Striker",goals:1,assists:0,clean_sheets:1},
  {name:"Melvin",position:"Striker",goals:1,assists:0,clean_sheets:0},
];

const positionColors = { Striker: "#ef4444", Midfielder: "#f59e0b", Defender: "#3b82f6" };
const positionEmoji = { Striker: "⚡", Midfielder: "🎯", Defender: "🛡️" };
const STARMAN = "✍️Starman⭐️";

function generateInsights(players) {
  if (!players.length) return [];
  const insights = [];

  const sorted_goals = [...players].sort((a, b) => b.goals - a.goals);
  const sorted_assists = [...players].sort((a, b) => b.assists - a.assists);
  const sorted_cs = [...players].sort((a, b) => b.clean_sheets - a.clean_sheets);

  const top1 = sorted_goals[0];
  const top2 = sorted_goals[1];
  const topA1 = sorted_assists[0];
  const topA2 = sorted_assists[1];
  const topCS1 = sorted_cs[0];
  const topCS2 = sorted_cs[1];

  const totalGoals = players.reduce((a, p) => a + p.goals, 0);
  const totalAssists = players.reduce((a, p) => a + p.assists, 0);
  const strikers = players.filter(p => p.position === "Striker");
  const mids = players.filter(p => p.position === "Midfielder");
  const defs = players.filter(p => p.position === "Defender");
  const strikerGoals = strikers.reduce((a, p) => a + p.goals, 0);
  const midGoals = mids.reduce((a, p) => a + p.goals, 0);
  const defGoals = defs.reduce((a, p) => a + p.goals, 0);

  if (top1?.goals > 0) {
    const gap = top1.goals - (top2?.goals || 0);
    if (gap >= 5) {
      insights.push({ emoji: "🔥", color: "#ef4444", text: `${top1.name} is in a league of his own — ${top1.goals} goals and ${gap} clear of the pack. Nobody is catching this man.` });
    } else if (gap >= 2) {
      insights.push({ emoji: "⚽", color: "#ef4444", text: `${top1.name} leads the golden boot race with ${top1.goals} goals, ${gap} ahead of ${top2?.name}. The gap is real.` });
    } else {
      insights.push({ emoji: "⚽", color: "#ef4444", text: `${top1.name} and ${top2?.name} are neck and neck at the top — ${top1.goals} vs ${top2?.goals} goals. This race is not over.` });
    }
  }

  if (top1?.goals > 0 && top1?.assists > 0) {
    const contrib = top1.goals + top1.assists;
    if (contrib >= 15) {
      insights.push({ emoji: "👑", color: "#f59e0b", text: `${top1.name} has ${top1.goals} goals AND ${top1.assists} assists — ${contrib} direct contributions. This man is the liga.` });
    } else if (contrib >= 8) {
      insights.push({ emoji: "💥", color: "#f59e0b", text: `${top1.name} is not just scoring — ${top1.goals} goals and ${top1.assists} assists make him the most complete player in the liga right now.` });
    }
  }

  if (topA1?.assists > 0) {
    if (topA1.name === top1?.name) {
      insights.push({ emoji: "🎯", color: "#f59e0b", text: `${topA1.name} tops both the goals AND assists chart. When he's on the pitch, something is always happening.` });
    } else {
      insights.push({ emoji: "🎯", color: "#f59e0b", text: `${topA1.name} is the liga's chief creator with ${topA1.assists} assists. Behind every great goal, there's a pass from ${topA1.name}.` });
    }
  }

  if (topA1?.assists > 0 && topA2?.assists > 0 && topA1.assists - topA2.assists <= 1) {
    insights.push({ emoji: "🤝", color: "#f59e0b", text: `${topA1.name} and ${topA2.name} are both on ${topA1.assists} and ${topA2.assists} assists respectively. The playmaker crown is still up for grabs.` });
  }

  if (topCS1?.clean_sheets > 0) {
    if (topCS1.clean_sheets >= 15) {
      insights.push({ emoji: "🧱", color: "#3b82f6", text: `${topCS1.clean_sheets} clean sheets for ${topCS1.name}. At this point he's not a defender — he's a wall. A whole wall.` });
    } else if (topCS1.clean_sheets >= 8) {
      insights.push({ emoji: "🛡️", color: "#3b82f6", text: `${topCS1.name} leads the clean sheet chart with ${topCS1.clean_sheets}. Attackers dread facing this man.` });
    } else {
      insights.push({ emoji: "🧤", color: "#3b82f6", text: `${topCS1.name} is the most reliable defender in the liga with ${topCS1.clean_sheets} clean sheets this season.` });
    }
  }

  if (topCS1?.clean_sheets > 0 && topCS2?.clean_sheets > 0) {
    insights.push({ emoji: "🔐", color: "#3b82f6", text: `${topCS1.name} (${topCS1.clean_sheets} CS) and ${topCS2.name} (${topCS2.clean_sheets} CS) are the two best defenders in Greedie Liga. Tough to score past either of them.` });
  }

  const topPos = strikerGoals >= midGoals && strikerGoals >= defGoals ? "Strikers" : midGoals >= defGoals ? "Midfielders" : "Defenders";
  const topPosGoals = topPos === "Strikers" ? strikerGoals : topPos === "Midfielders" ? midGoals : defGoals;
  const pct = totalGoals > 0 ? Math.round((topPosGoals / totalGoals) * 100) : 0;
  if (pct > 0) {
    insights.push({ emoji: "📊", color: "#a855f7", text: `${topPos} are responsible for ${pct}% of all goals in the liga (${topPosGoals} out of ${totalGoals}). The numbers don't lie.` });
  }

  const scoringDef = [...defs].sort((a, b) => b.goals - a.goals)[0];
  if (scoringDef?.goals >= 3) {
    insights.push({ emoji: "😤", color: "#3b82f6", text: `${scoringDef.name} is a defender with ${scoringDef.goals} goals. Somebody tell him to stay back — actually, don't.` });
  }

  const silentStriker = strikers.find(p => p.goals === 0);
  if (silentStriker) {
    insights.push({ emoji: "🤫", color: "#666", text: `${silentStriker.name} is registered as a Striker but is yet to open his account. The liga is watching and waiting.` });
  }

  const topMid = [...mids].sort((a, b) => b.goals - a.goals)[0];
  if (topMid?.goals >= 6) {
    insights.push({ emoji: "🌪️", color: "#f59e0b", text: `${topMid.name} is a midfielder but you wouldn't know it — ${topMid.goals} goals this season. More dangerous than most strikers.` });
  }

  insights.push({ emoji: "📋", color: "#888", text: `${players.length} players registered. ${totalGoals} goals scored. ${totalAssists} assists recorded. Greedie Liga is alive and buzzing.` });

  return insights;
}

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: HEADERS, ...options });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

function MiniBar({ value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ background: "#1a1a2e", borderRadius: 4, height: 6, width: "100%", overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.6s ease" }} />
    </div>
  );
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)", border: `1px solid ${color}33`, borderRadius: 16, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 4, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -10, right: -10, fontSize: 60, opacity: 0.06 }}>{icon}</div>
      <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 2, fontFamily: "'Bebas Neue', cursive" }}>{label}</div>
      <div style={{ fontSize: 34, fontWeight: 900, color, fontFamily: "'Bebas Neue', cursive", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#aaa" }}>{sub}</div>
    </div>
  );
}

function LeaderRow({ rank, name, value, max, color, label }) {
  const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: rank <= 3 ? `${color}11` : "transparent", borderRadius: 10, borderLeft: rank <= 3 ? `3px solid ${color}` : "3px solid transparent" }}>
      <div style={{ width: 28, textAlign: "center", fontSize: rank <= 3 ? 18 : 13, color: "#666", fontFamily: "'Bebas Neue', cursive" }}>{medals[rank] || rank}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{name}</span>
          <span style={{ color, fontWeight: 800, fontFamily: "'Bebas Neue', cursive", fontSize: 18 }}>{value} <span style={{ fontSize: 10, color: "#666", fontWeight: 400 }}>{label}</span></span>
        </div>
        <MiniBar value={value} max={max} color={color} />
      </div>
    </div>
  );
}

function InsightCard({ emoji, color, text, index }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}0d, #0f0f23)`,
      border: `1px solid ${color}2a`,
      borderRadius: 16,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      animation: `fadeIn 0.4s ease ${index * 0.07}s both`,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ fontSize: 26, lineHeight: 1, marginTop: 2 }}>{emoji}</div>
        <div style={{ flex: 1, color: "#ddd", fontSize: 14, lineHeight: 1.6 }}>{text}</div>
      </div>
      <div style={{ textAlign: "right", fontSize: 12, color: color, fontWeight: 700, fontStyle: "italic", opacity: 0.9 }}>
        {STARMAN}
      </div>
    </div>
  );
}

export default function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editPlayer, setEditPlayer] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm] = useState({ name: "", position: "Midfielder", goals: 0, assists: 0, clean_sheets: 0 });
  const [showAdd, setShowAdd] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [filterPos, setFilterPos] = useState("All");
  const [sortBy, setSortBy] = useState("goals");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Admin PIN state ──────────────────────────────────────────
  const [isAdmin, setIsAdmin] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  // ─────────────────────────────────────────────────────────────

  useEffect(() => { loadPlayers(); }, []);

  async function loadPlayers() {
    try {
      setLoading(true);
      const data = await sbFetch("players?select=*&order=goals.desc");
      if (data.length === 0) {
        await sbFetch("players", { method: "POST", body: JSON.stringify(SEED_PLAYERS) });
        const seeded = await sbFetch("players?select=*&order=goals.desc");
        setPlayers(seeded);
      } else {
        setPlayers(data);
      }
    } catch (e) {
      setError("Could not connect. Check internet connection.");
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  function handlePinSubmit() {
    if (pinInput === "4031") {
      setIsAdmin(true);
      setPinError(false);
      setPinInput("");
    } else {
      setPinError(true);
      setPinInput("");
    }
  }

  function handleLock() {
    setIsAdmin(false);
    setPinInput("");
    setPinError(false);
    setShowAdd(false);
  }

  const [confirmDelete, setConfirmDelete] = useState(null);

  async function deletePlayer(player) {
    setSaving(true);
    try {
      await sbFetch(`players?id=eq.${player.id}`, { method: "DELETE" });
      await loadPlayers();
      setConfirmDelete(null);
      showToast(`${player.name} removed ✅`);
    } catch (e) {
      showToast("Failed to delete.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit() {
    setSaving(true);
    try {
      await sbFetch(`players?id=eq.${editForm.id}`, { method: "PATCH", body: JSON.stringify({ goals: +editForm.goals, assists: +editForm.assists, clean_sheets: +editForm.clean_sheets, position: editForm.position }) });
      await loadPlayers();
      setEditPlayer(null);
      showToast("Stats updated! ✅");
    } catch (e) {
      showToast("Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function addPlayer() {
    if (!addForm.name.trim()) return;
    setSaving(true);
    try {
      await sbFetch("players", { method: "POST", body: JSON.stringify({ ...addForm, goals: +addForm.goals, assists: +addForm.assists, clean_sheets: +addForm.clean_sheets }) });
      await loadPlayers();
      setAddForm({ name: "", position: "Midfielder", goals: 0, assists: 0, clean_sheets: 0 });
      setShowAdd(false);
      showToast("Player added! ⚽");
    } catch (e) {
      showToast("Failed to add player.", "error");
    } finally {
      setSaving(false);
    }
  }

  const totalGoals = players.reduce((a, p) => a + p.goals, 0);
  const totalAssists = players.reduce((a, p) => a + p.assists, 0);
  const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0];
  const topAssist = [...players].sort((a, b) => b.assists - a.assists)[0];
  const topCS = [...players].sort((a, b) => b.clean_sheets - a.clean_sheets)[0];
  const maxGoals = Math.max(...players.map(p => p.goals), 1);
  const maxAssists = Math.max(...players.map(p => p.assists), 1);
  const maxCS = Math.max(...players.map(p => p.clean_sheets), 1);
  const scorers = [...players].filter(p => p.goals > 0).sort((a, b) => b.goals - a.goals);
  const assisters = [...players].filter(p => p.assists > 0).sort((a, b) => b.assists - a.assists);
  const keepers = [...players].filter(p => p.clean_sheets > 0).sort((a, b) => b.clean_sheets - a.clean_sheets);
  const filteredPlayers = [...players].filter(p => filterPos === "All" || p.position === filterPos).filter(p => p.name.toLowerCase().includes(searchQ.toLowerCase())).sort((a, b) => b[sortBy] - a[sortBy]);
  const insights = generateInsights(players);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "insights", label: "Insights", icon: "💬" },
    { id: "scorers", label: "Scorers", icon: "⚽" },
    { id: "assists", label: "Assists", icon: "🎯" },
    { id: "cleansheets", label: "Clean Sheets", icon: "🧤" },
    { id: "squad", label: "Squad", icon: "👥" },
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#07071a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 42, letterSpacing: 4, background: "linear-gradient(135deg, #fff, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GREEDIE LIGA</div>
      <div style={{ color: "#3b82f6", fontSize: 14 }}>Loading stats...</div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", background: "#07071a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 24 }}>
      <div style={{ fontSize: 40 }}>⚠️</div>
      <div style={{ color: "#ef4444", textAlign: "center" }}>{error}</div>
      <button onClick={loadPlayers} style={{ background: "#3b82f6", border: "none", borderRadius: 10, padding: "12px 24px", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Retry</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#07071a", color: "#fff", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0f0f23; } ::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 2px; }
        input, select { outline: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>

      {toast && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 999, background: toast.type === "error" ? "#ef444422" : "#16a34a22", border: `1px solid ${toast.type === "error" ? "#ef4444" : "#16a34a"}`, borderRadius: 10, padding: "12px 20px", color: toast.type === "error" ? "#ef4444" : "#4ade80", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}>{toast.msg}</div>
      )}

      <div style={{ background: "linear-gradient(180deg, #0d0d2b 0%, #07071a 100%)", borderBottom: "1px solid #1a1a3e", padding: "20px 16px 0", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 34, letterSpacing: 3, background: "linear-gradient(135deg, #fff 0%, #3b82f6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GREEDIE LIGA</div>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: 3, textTransform: "uppercase" }}>5-A-Side League · Live Stats</div>
            </div>
            <button onClick={loadPlayers} style={{ background: "#1a1a3e", border: "1px solid #2a2a5e", borderRadius: 8, padding: "8px 14px", color: "#666", cursor: "pointer", fontSize: 12 }}>🔄 Refresh</button>
          </div>
          <div style={{ display: "flex", gap: 2, overflowX: "auto", paddingBottom: 1 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "9px 12px", background: activeTab === t.id ? "rgba(59,130,246,0.15)" : "transparent", border: "none", borderBottom: activeTab === t.id ? "2px solid #3b82f6" : "2px solid transparent", color: activeTab === t.id ? "#3b82f6" : "#666", cursor: "pointer", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", borderRadius: "6px 6px 0 0" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 14px" }}>

        {activeTab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              <StatCard label="Goals" value={totalGoals} sub={`${scorers.length} scorers`} color="#ef4444" icon="⚽" />
              <StatCard label="Assists" value={totalAssists} sub={`${assisters.length} players`} color="#f59e0b" icon="🎯" />
              <StatCard label="Squad" value={players.length} sub="registered" color="#3b82f6" icon="👥" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Golden Boot", player: topScorer, stat: topScorer?.goals, statLabel: "goals", color: "#ef4444", icon: "🥾" },
                { label: "Playmaker", player: topAssist, stat: topAssist?.assists, statLabel: "assists", color: "#f59e0b", icon: "🎯" },
                { label: "Iron Wall", player: topCS, stat: topCS?.clean_sheets, statLabel: "CS", color: "#3b82f6", icon: "🧤" },
              ].map(({ label, player, stat, statLabel, color, icon }) => (
                <div key={label} style={{ background: `linear-gradient(135deg, ${color}11, ${color}05)`, border: `1px solid ${color}33`, borderRadius: 14, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 24 }}>{icon}</div>
                  <div style={{ fontSize: 9, color: "#666", textTransform: "uppercase", letterSpacing: 2, marginTop: 6, fontFamily: "'Bebas Neue', cursive" }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginTop: 2 }}>{player?.name}</div>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, color, lineHeight: 1 }}>{stat}</div>
                  <div style={{ fontSize: 10, color: "#666" }}>{statLabel}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#0f0f23", borderRadius: 16, padding: 18, border: "1px solid #1a1a3e" }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 18, letterSpacing: 2, marginBottom: 14, color: "#888" }}>GOALS BY POSITION</div>
              {["Defender", "Midfielder", "Striker"].map(pos => {
                const posGoals = players.filter(p => p.position === pos).reduce((a, p) => a + p.goals, 0);
                const color = positionColors[pos];
                return (
                  <div key={pos} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ color, fontWeight: 600, fontSize: 13 }}>{positionEmoji[pos]} {pos}s</span>
                      <span style={{ color: "#666", fontSize: 12 }}>{posGoals} goals</span>
                    </div>
                    <MiniBar value={posGoals} max={totalGoals} color={color} />
                  </div>
                );
              })}
            </div>
            <div onClick={() => setActiveTab("insights")} style={{ background: "linear-gradient(135deg, #a855f711, #07071a)", border: "1px solid #a855f733", borderRadius: 16, padding: 18, cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 32 }}>💬</div>
              <div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 16, letterSpacing: 2, color: "#a855f7" }}>LIGA INSIGHTS</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{insights.length} fresh takes from {STARMAN} — tap to read</div>
              </div>
              <div style={{ marginLeft: "auto", color: "#a855f7", fontSize: 18 }}>→</div>
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: 3, color: "#a855f7" }}>💬 LIGA INSIGHTS</div>
            </div>
            <div style={{ background: "#0f0f23", border: "1px solid #a855f733", borderRadius: 12, padding: "12px 16px", fontSize: 12, color: "#888", lineHeight: 1.5 }}>
              Auto-generated from live stats. Updates every time stats change. Signed by {STARMAN}
            </div>
            {insights.map((ins, i) => (
              <InsightCard key={i} index={i} emoji={ins.emoji} color={ins.color} text={ins.text} />
            ))}
          </div>
        )}

        {activeTab === "scorers" && (
          <div style={{ background: "#0f0f23", borderRadius: 16, padding: 20, border: "1px solid #1a1a3e" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: 3, marginBottom: 20, color: "#ef4444" }}>⚽ TOP SCORERS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {scorers.map((p, i) => <LeaderRow key={p.id} rank={i+1} name={p.name} value={p.goals} max={maxGoals} color="#ef4444" label="goals" />)}
            </div>
          </div>
        )}

        {activeTab === "assists" && (
          <div style={{ background: "#0f0f23", borderRadius: 16, padding: 20, border: "1px solid #1a1a3e" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: 3, marginBottom: 20, color: "#f59e0b" }}>🎯 TOP ASSISTS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {assisters.map((p, i) => <LeaderRow key={p.id} rank={i+1} name={p.name} value={p.assists} max={maxAssists} color="#f59e0b" label="assists" />)}
            </div>
          </div>
        )}

        {activeTab === "cleansheets" && (
          <div style={{ background: "#0f0f23", borderRadius: 16, padding: 20, border: "1px solid #1a1a3e" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: 3, marginBottom: 20, color: "#3b82f6" }}>🧤 CLEAN SHEETS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {keepers.map((p, i) => <LeaderRow key={p.id} rank={i+1} name={p.name} value={p.clean_sheets} max={maxCS} color="#3b82f6" label="CS" />)}
            </div>
          </div>
        )}

        {activeTab === "squad" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input placeholder="🔍 Search..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ flex: 1, minWidth: 140, background: "#0f0f23", border: "1px solid #2a2a5e", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13 }} />
              <select value={filterPos} onChange={e => setFilterPos(e.target.value)} style={{ background: "#0f0f23", border: "1px solid #2a2a5e", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, cursor: "pointer" }}>
                <option>All</option><option>Defender</option><option>Midfielder</option><option>Striker</option>
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: "#0f0f23", border: "1px solid #2a2a5e", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, cursor: "pointer" }}>
                <option value="goals">Goals</option><option value="assists">Assists</option><option value="clean_sheets">Clean Sheets</option>
              </select>
            </div>

            {/* Add New Player — admin only */}
            {isAdmin && (
              <>
                <button onClick={() => setShowAdd(!showAdd)} style={{ background: showAdd ? "#1a1a3e" : "linear-gradient(135deg, #1e3a8a, #3b82f6)", border: "none", borderRadius: 10, padding: "12px 20px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                  {showAdd ? "✕ Cancel" : "+ Add New Player"}
                </button>
                {showAdd && (
                  <div style={{ background: "#0f0f23", border: "1px solid #2a2a5e", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 18, letterSpacing: 2, color: "#3b82f6" }}>NEW PLAYER</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {[["Name","name","text"],["Goals","goals","number"],["Assists","assists","number"],["Clean Sheets","clean_sheets","number"]].map(([label, key, type]) => (
                        <div key={key}>
                          <div style={{ fontSize: 11, color: "#666", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
                          <input type={type} value={addForm[key]} onChange={e => setAddForm({...addForm, [key]: e.target.value})} style={{ width: "100%", background: "#1a1a3e", border: "1px solid #2a2a5e", borderRadius: 8, padding: "9px 12px", color: "#fff", fontSize: 13 }} />
                        </div>
                      ))}
                      <div style={{ gridColumn: "1/-1" }}>
                        <div style={{ fontSize: 11, color: "#666", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Position</div>
                        <select value={addForm.position} onChange={e => setAddForm({...addForm, position: e.target.value})} style={{ width: "100%", background: "#1a1a3e", border: "1px solid #2a2a5e", borderRadius: 8, padding: "9px 12px", color: "#fff", fontSize: 13 }}>
                          <option>Defender</option><option>Midfielder</option><option>Striker</option>
                        </select>
                      </div>
                    </div>
                    <button onClick={addPlayer} disabled={saving} style={{ background: "linear-gradient(135deg, #16a34a, #4ade80)", border: "none", borderRadius: 10, padding: "12px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14, opacity: saving ? 0.6 : 1 }}>
                      {saving ? "Adding..." : "✓ Add Player"}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Player list */}
            <div style={{ background: "#0f0f23", borderRadius: 16, border: "1px solid #1a1a3e", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "1fr 60px 44px 44px 44px 48px 48px" : "1fr 80px 44px 44px 44px", padding: "10px 14px", borderBottom: "1px solid #1a1a3e", fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>
                <span>Player</span><span>Pos</span><span style={{textAlign:"center"}}>G</span><span style={{textAlign:"center"}}>A</span><span style={{textAlign:"center"}}>CS</span>{isAdmin && <span></span>}{isAdmin && <span></span>}
              </div>
              {filteredPlayers.map(p => (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: isAdmin ? "1fr 60px 44px 44px 44px 48px 48px" : "1fr 80px 44px 44px 44px", padding: "11px 14px", borderBottom: "1px solid #0d0d1f", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span>
                  <span style={{ fontSize: 10, color: positionColors[p.position], fontWeight: 600 }}>{positionEmoji[p.position]}</span>
                  <span style={{ textAlign: "center", color: p.goals > 0 ? "#ef4444" : "#444", fontWeight: 700 }}>{p.goals}</span>
                  <span style={{ textAlign: "center", color: p.assists > 0 ? "#f59e0b" : "#444", fontWeight: 700 }}>{p.assists}</span>
                  <span style={{ textAlign: "center", color: p.clean_sheets > 0 ? "#3b82f6" : "#444", fontWeight: 700 }}>{p.position === "Defender" ? p.clean_sheets : "—"}</span>
                  {isAdmin && (
                    <button onClick={() => { setEditPlayer(p.name); setEditForm({...p}); }} style={{ background: "rgba(59,130,246,0.15)", border: "none", borderRadius: 6, color: "#3b82f6", cursor: "pointer", padding: "5px 8px", fontSize: 11 }}>Edit</button>
                  )}
                  {isAdmin && (
                    <button onClick={() => setConfirmDelete(p)} style={{ background: "rgba(239,68,68,0.15)", border: "none", borderRadius: 6, color: "#ef4444", cursor: "pointer", padding: "5px 8px", fontSize: 11 }}>Del</button>
                  )}
                </div>
              ))}
            </div>

            {/* ── Admin PIN box ── */}
            <div style={{
              marginTop: 8,
              padding: 20,
              background: "#0d0d2b",
              borderRadius: 14,
              border: isAdmin ? "1px solid #22c55e" : "1px solid #1e1e4a",
              textAlign: "center",
            }}>
              {isAdmin ? (
                <div>
                  <div style={{ color: "#22c55e", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
                    🔓 Admin mode active
                  </div>
                  <button
                    onClick={handleLock}
                    style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                  >
                    🔒 Lock
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ color: "#444", fontSize: 12, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Admin access</div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
                    <input
                      type="password"
                      placeholder="Enter PIN"
                      value={pinInput}
                      onChange={e => { setPinInput(e.target.value); setPinError(false); }}
                      onKeyDown={e => e.key === "Enter" && handlePinSubmit()}
                      style={{
                        background: "#1a1a3e",
                        border: pinError ? "1px solid #ef4444" : "1px solid #2d2d6b",
                        color: "#fff",
                        borderRadius: 8,
                        padding: "10px 16px",
                        fontSize: 16,
                        width: 130,
                        textAlign: "center",
                      }}
                    />
                    <button
                      onClick={handlePinSubmit}
                      style={{ background: "#6d28d9", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}
                    >
                      Unlock
                    </button>
                  </div>
                  {pinError && (
                    <div style={{ color: "#ef4444", fontSize: 12, marginTop: 10 }}>Wrong PIN. Try again.</div>
                  )}
                </div>
              )}
            </div>
            {/* ── End PIN box ── */}

          </div>
        )}
      </div>

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: "#0f0f23", border: "1px solid #ef444455", borderRadius: 20, padding: 28, width: "100%", maxWidth: 360, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 2, color: "#ef4444", marginBottom: 8 }}>DELETE PLAYER</div>
            <div style={{ color: "#aaa", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Are you sure you want to remove <span style={{ color: "#fff", fontWeight: 700 }}>{confirmDelete.name}</span> from the liga?<br />
              <span style={{ color: "#ef4444", fontSize: 12 }}>This cannot be undone.</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, background: "#1a1a3e", border: "none", borderRadius: 10, padding: 13, color: "#888", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={() => deletePlayer(confirmDelete)} disabled={saving} style={{ flex: 1, background: "linear-gradient(135deg, #7f1d1d, #ef4444)", border: "none", borderRadius: 10, padding: 13, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14, opacity: saving ? 0.6 : 1 }}>
                {saving ? "Deleting..." : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editPlayer && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: "#0f0f23", border: "1px solid #2a2a5e", borderRadius: 20, padding: 28, width: "100%", maxWidth: 400 }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 2, marginBottom: 20, color: "#3b82f6" }}>EDIT · {editPlayer}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["Goals","goals"],["Assists","assists"]].map(([label, key]) => (
                <div key={key}>
                  <div style={{ fontSize: 11, color: "#666", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
                  <input type="number" value={editForm[key]} onChange={e => setEditForm({...editForm, [key]: e.target.value})} style={{ width: "100%", background: "#1a1a3e", border: "1px solid #2a2a5e", borderRadius: 8, padding: "12px 14px", color: "#fff", fontSize: 20, fontWeight: 700 }} />
                </div>
              ))}
              {editForm.position === "Defender" && (
                <div>
                  <div style={{ fontSize: 11, color: "#666", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Clean Sheets</div>
                  <input type="number" value={editForm.clean_sheets} onChange={e => setEditForm({...editForm, clean_sheets: e.target.value})} style={{ width: "100%", background: "#1a1a3e", border: "1px solid #2a2a5e", borderRadius: 8, padding: "12px 14px", color: "#fff", fontSize: 20, fontWeight: 700 }} />
                </div>
              )}
              <div>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Position</div>
                <select value={editForm.position} onChange={e => setEditForm({...editForm, position: e.target.value})} style={{ width: "100%", background: "#1a1a3e", border: "1px solid #2a2a5e", borderRadius: 8, padding: "12px 14px", color: "#fff", fontSize: 14 }}>
                  <option>Defender</option><option>Midfielder</option><option>Striker</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setEditPlayer(null)} style={{ flex: 1, background: "#1a1a3e", border: "none", borderRadius: 10, padding: 13, color: "#888", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={saveEdit} disabled={saving} style={{ flex: 2, background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", border: "none", borderRadius: 10, padding: 13, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 15, opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
