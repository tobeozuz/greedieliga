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
const positionEmoji = { Striker: "⚡", Midfielder: "⚙️", Defender: "🛡️" };
const STARMAN = "✍️Starman⭐";

// ---------- FPL ----------
// Budget per manager, in millions of naira. Edit this one number to rebalance the whole game.
// Raised from ₦35m to ₦50m when substitutes were added, to fit the 2 extra paid slots while
// staying tighter than the straight ~1.5x-headroom math (₦52.5m) would have allowed.
const FPL_BUDGET = 50;
// Outfield starters each manager picks (Defender/Midfielder/Striker) — the goalie below doesn't count toward this.
const FPL_SQUAD_SIZE = 4;
// Substitute picks, on top of the starters above — same price as a starter, but only earn a
// fraction of the points (see FPL_SUB_POINT_FACTOR) since they're bench cover, not a starting XI slot.
const FPL_SUB_SIZE = 2;
const FPL_TOTAL_PICKS = FPL_SQUAD_SIZE + FPL_SUB_SIZE;
const FPL_SUB_POINT_FACTOR = 1 / 3;
// Real-FPL-style "sell-on fee": selling a player only banks half of any price rise since you
// bought them — the rest stays lost, which is what stops budgets from inflating forever as prices climb.
// A player who's fallen in price since purchase sells for the lower current price, no fee on a loss.
const FPL_SELL_FEE_RATE = 0.5;
// Points awarded per stat when a manager's picked player records it (captain doubles these).
const FPL_POINTS = { goal: 4, assist: 3, cleanSheet: 4 };
// Every squad gets the same fixed goalkeeper — free, undroppable, no stats tracked for the position,
// shown purely so the pitch reads like a real lineup with a keeper at the back.
const FPL_GOALKEEPER = { name: "Goalkeeper", position: "Goalkeeper" };
const GOALKEEPER_STYLE = { color: "#94a3b8", emoji: "🧤" };
// Squad lock window, in the viewer's own local time. On a gameday, squads lock at 5:00pm and
// reopen at 8:00pm — no building or editing during that window, same as real FPL's deadline.
// getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat.
const FPL_GAMEDAYS = [0, 1, 3, 5, 6]; // Sunday, Monday, Wednesday, Friday, Saturday
const FPL_LOCK_HOUR = 17; // 5:00pm
const FPL_UNLOCK_HOUR = 20; // 8:00pm
function isFplLocked(date) {
  if (!FPL_GAMEDAYS.includes(date.getDay())) return false;
  const hour = date.getHours() + date.getMinutes() / 60;
  return hour >= FPL_LOCK_HOUR && hour < FPL_UNLOCK_HOUR;
}
// "Most Selected" is live all day — updates instantly as managers save squads — but goes
// blank overnight (11pm–7am) once the day's matches are done, same idea as quiet hours.
const FPL_STAT_HIDE_HOUR = 23; // 11:00pm
const FPL_STAT_SHOW_HOUR = 7; // 7:00am
function isMostSelectedVisible(date) {
  const hour = date.getHours() + date.getMinutes() / 60;
  return hour >= FPL_STAT_SHOW_HOUR && hour < FPL_STAT_HIDE_HOUR;
}

// ---------- FPL pricing ----------
// A player's price is a STORED number (players.base_price) — not something recalculated live
// from cumulative stats on every render. It only ever changes two ways:
//   1. An admin sets it directly (Admin · Player Values panel) — takes effect immediately.
//   2. "Start New Week" applies one small, capped bump per player based on THAT WEEK's stat
//      changes only (never the season total), same moment Player of the Week gets computed.
// This mirrors real FPL: prices move once per gameweek, not continuously as stats are edited.
function fplStatForm(stats) {
  if (!stats) return 0;
  return stats.goals * 3 + stats.assists * 2 + (stats.position === "Defender" ? stats.clean_sheets * 2 : 0);
}
// Used once, at a season reset, to seed next season's starting prices from the season that
// just ended — so players don't all flatten back to a bare ₦4m the moment stats reset to zero.
function seasonReputationPrice(stats) {
  const drift = Math.max(-6, Math.min(6, fplStatForm(stats) * 0.05));
  return Math.round(Math.max(0, Math.min(4 + drift, 20)) * 2) / 2;
}
// Used by "Start New Week" — a small, capped nudge from THIS week's stat delta only.
// Goes up to +₦2m for a strong week, but also nudges DOWN ₦1m for a totally quiet one (no goals,
// assists, or clean sheets that week) — prices now move both directions, same as real FPL.
function weeklyPriceBump(dGoals, dAssists, dCS, position) {
  const formPts = dGoals * 3 + dAssists * 2 + (position === "Defender" ? dCS * 2 : 0);
  if (formPts > 0) return Math.min(2, formPts * 0.15);
  return -1;
}
function priceOf(player) {
  return player.base_price != null ? player.base_price : 4;
}
// Real-FPL-style sell-on fee: a price RISE since purchase only refunds half (rounded down to the
// nearest ₦0.5m); a price FALL just sells at the lower current price, no extra penalty on a loss.
function sellValueOf(purchasePrice, currentPrice) {
  if (currentPrice <= purchasePrice) return currentPrice;
  const gain = currentPrice - purchasePrice;
  const keptGain = Math.floor(gain * FPL_SELL_FEE_RATE * 2) / 2;
  return purchasePrice + keptGain;
}

// ---------- Theme ----------
const THEMES = {
  dark: {
    name: "dark",
    pageBg: "#07071a",
    headerGrad: "linear-gradient(180deg, #0d0d2b 0%, #07071a 100%)",
    headerBorder: "#1a1a3e",
    cardBg: "#0f0f23",
    cardGrad: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)",
    border: "#1a1a3e",
    borderLight: "#2a2a5e",
    inputBg: "#1a1a3e",
    text: "#fff",
    textDim: "#888",
    textMuted: "#666",
    textFaint: "#555",
    textGhost: "#444",
    rowBorder: "#0d0d1f",
    logoGrad: "linear-gradient(135deg, #fff 0%, #3b82f6 100%)",
    trackBg: "#1a1a2e",
    toggleBg: "#1a1a3e",
    toggleBorder: "#2a2a5e",
    overlay: "rgba(0,0,0,0.85)",
  },
  light: {
    name: "light",
    pageBg: "#f3f4fb",
    headerGrad: "linear-gradient(180deg, #ffffff 0%, #f3f4fb 100%)",
    headerBorder: "#e1e3f3",
    cardBg: "#ffffff",
    cardGrad: "linear-gradient(135deg, #ffffff 0%, #eef0fb 100%)",
    border: "#e1e3f3",
    borderLight: "#d6d9f0",
    inputBg: "#ffffff",
    text: "#0f0f23",
    textDim: "#5a5d78",
    textMuted: "#7a7d99",
    textFaint: "#9294b3",
    textGhost: "#b3b5cf",
    rowBorder: "#edeefa",
    logoGrad: "linear-gradient(135deg, #0f0f23 0%, #3b82f6 100%)",
    trackBg: "#e8e9f5",
    toggleBg: "#ffffff",
    toggleBorder: "#d6d9f0",
    overlay: "rgba(20,20,40,0.55)",
  },
};

// ---------- Insights engine ----------
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
      insights.push({ emoji: "🐐", color: "#ef4444", text: `${top1.name} is in a league of his own — ${top1.goals} goals and ${gap} clear of the pack. Nobody is catching this man.` });
    } else if (gap >= 2) {
      insights.push({ emoji: "🔥", color: "#ef4444", text: `${top1.name} leads the golden boot race with ${top1.goals} goals, ${gap} ahead of ${top2?.name}. The gap is real.` });
    } else {
      insights.push({ emoji: "⚔️", color: "#ef4444", text: `${top1.name} and ${top2?.name} are neck and neck at the top — ${top1.goals} vs ${top2?.goals} goals. This race is not over.` });
    }
  }
  if (top1?.goals > 0 && top1?.assists > 0) {
    const contrib = top1.goals + top1.assists;
    if (contrib >= 15) {
      insights.push({ emoji: "👑", color: "#f59e0b", text: `${top1.name} has ${top1.goals} goals AND ${top1.assists} assists — ${contrib} direct contributions. This man is the liga.` });
    } else if (contrib >= 8) {
      insights.push({ emoji: "💪", color: "#f59e0b", text: `${top1.name} is not just scoring — ${top1.goals} goals and ${top1.assists} assists make him the most complete player in the liga right now.` });
    }
  }
  if (topA1?.assists > 0) {
    if (topA1.name === top1?.name) {
      insights.push({ emoji: "🎯", color: "#f59e0b", text: `${topA1.name} tops both the goals AND assists chart. When he's on the pitch, something is always happening.` });
    } else {
      insights.push({ emoji: "🪄", color: "#f59e0b", text: `${topA1.name} is the liga's chief creator with ${topA1.assists} assists. Behind every great goal, there's a pass from ${topA1.name}.` });
    }
  }
  if (topA1?.assists > 0 && topA2?.assists > 0 && topA1.assists - topA2.assists <= 1) {
    insights.push({ emoji: "🤝", color: "#f59e0b", text: `${topA1.name} and ${topA2.name} are both on ${topA1.assists} and ${topA2.assists} assists respectively. The playmaker crown is still up for grabs.` });
  }
  if (topCS1?.clean_sheets > 0) {
    if (topCS1.clean_sheets >= 15) {
      insights.push({ emoji: "🧱", color: "#3b82f6", text: `${topCS1.clean_sheets} clean sheets for ${topCS1.name}. At this point he's not a defender — he's a wall. A whole wall.` });
    } else if (topCS1.clean_sheets >= 8) {
      insights.push({ emoji: "🥅", color: "#3b82f6", text: `${topCS1.name} leads the clean sheet chart with ${topCS1.clean_sheets}. Attackers dread facing this man.` });
    } else {
      insights.push({ emoji: "🛡️", color: "#3b82f6", text: `${topCS1.name} is the most reliable defender in the liga with ${topCS1.clean_sheets} clean sheets this season.` });
    }
  }
  if (topCS1?.clean_sheets > 0 && topCS2?.clean_sheets > 0) {
    insights.push({ emoji: "🔒", color: "#3b82f6", text: `${topCS1.name} (${topCS1.clean_sheets} CS) and ${topCS2.name} (${topCS2.clean_sheets} CS) are the two best defenders in Greedie Liga. Tough to score past either of them.` });
  }
  const topPos = strikerGoals >= midGoals && strikerGoals >= defGoals ? "Strikers" : midGoals >= defGoals ? "Midfielders" : "Defenders";
  const topPosGoals = topPos === "Strikers" ? strikerGoals : topPos === "Midfielders" ? midGoals : defGoals;
  const pct = totalGoals > 0 ? Math.round((topPosGoals / totalGoals) * 100) : 0;
  if (pct > 0) {
    insights.push({ emoji: "📊", color: "#a855f7", text: `${topPos} are responsible for ${pct}% of all goals in the liga (${topPosGoals} out of ${totalGoals}). The numbers don't lie.` });
  }
  const scoringDef = [...defs].sort((a, b) => b.goals - a.goals)[0];
  if (scoringDef?.goals >= 3) {
    insights.push({ emoji: "😳", color: "#3b82f6", text: `${scoringDef.name} is a defender with ${scoringDef.goals} goals. Somebody tell him to stay back — actually, don't.` });
  }
  const silentStriker = strikers.find(p => p.goals === 0);
  if (silentStriker) {
    insights.push({ emoji: "🙈", color: "#666", text: `${silentStriker.name} is registered as a Striker but is yet to open his account. The liga is watching and waiting.` });
  }
  const topMid = [...mids].sort((a, b) => b.goals - a.goals)[0];
  if (topMid?.goals >= 6) {
    insights.push({ emoji: "🎩", color: "#f59e0b", text: `${topMid.name} is a midfielder but you wouldn't know it — ${topMid.goals} goals this season. More dangerous than most strikers.` });
  }
  insights.push({ emoji: "📋", color: "#888", text: `${players.length} players registered. ${totalGoals} goals scored. ${totalAssists} assists recorded. Greedie Liga is alive and buzzing.` });
  return insights;
}

// ---------- Supabase helpers ----------
async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: { ...HEADERS, ...(options.headers || {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

async function getMeta(key) {
  const rows = await sbFetch(`app_meta?key=eq.${encodeURIComponent(key)}&select=value`);
  return rows.length ? rows[0].value : null;
}

async function setMeta(key, value) {
  await sbFetch(`app_meta?on_conflict=key`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify([{ key, value }]),
  });
}

// ---------- Share-as-image (pure Canvas, no external libs) ----------
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function newShareCanvas(w = 1080, h = 1350) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function paintBrandBg(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#0d0d2b");
  g.addColorStop(1, "#07071a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const g2 = ctx.createRadialGradient(w * 0.8, h * 0.06, 10, w * 0.8, h * 0.06, w * 0.65);
  g2.addColorStop(0, "rgba(59,130,246,0.20)");
  g2.addColorStop(1, "rgba(59,130,246,0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, w, h);
}

function drawShareHeader(ctx, w, subtitle) {
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 64px Arial, sans-serif";
  ctx.fillText("GREEDIE LIGA", w / 2, 150);
  ctx.fillStyle = "#5b8def";
  ctx.font = "700 24px Arial, sans-serif";
  ctx.fillText("5-A-SIDE LEAGUE · LIVE STATS", w / 2, 188);
  ctx.fillStyle = "#aaaaaa";
  ctx.font = "500 30px Arial, sans-serif";
  ctx.fillText(subtitle, w / 2, 248);
}

function drawShareFooter(ctx, w, h) {
  ctx.textAlign = "center";
  ctx.fillStyle = "#a855f7";
  ctx.font = "italic 700 28px Arial, sans-serif";
  ctx.fillText(STARMAN, w / 2, h - 66);
  ctx.fillStyle = "#555";
  ctx.font = "500 20px Arial, sans-serif";
  ctx.fillText(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), w / 2, h - 34);
}

// highlights: 3 spotlight chips ({label,name,value,statLabel,color}).
// players: full squad, each stat row shows Goals, Assists and Clean Sheets together.
// Three vertical leaderboards side by side: Top Scorers | Top Assists | Clean Sheets — full lists, ranked.
function buildLeaderboardsShareCard(scorers, assisters, keepers, motm) {
  const w = 1080;
  const headerH = 290;
  const motmH = motm ? 180 : 0;
  const colHeaderH = 66;
  const rowH = 40;
  const footerH = 130;
  const padBottom = 30;
  const maxRows = Math.max(scorers.length, assisters.length, keepers.length, 1);
  const h = headerH + motmH + colHeaderH + maxRows * rowH + footerH + padBottom;

  const c = newShareCanvas(w, h);
  const ctx = c.getContext("2d");
  paintBrandBg(ctx, w, h);
  drawShareHeader(ctx, w, "Season Leaderboards");

  if (motm) {
    const bx = 80, by = headerH, bw = w - 160, bh = motmH - 30;
    ctx.fillStyle = "rgba(251,146,60,0.08)";
    roundRectPath(ctx, bx, by, bw, bh, 20);
    ctx.fill();
    ctx.strokeStyle = "#fb923c66";
    ctx.lineWidth = 3;
    roundRectPath(ctx, bx, by, bw, bh, 20);
    ctx.stroke();
    ctx.textAlign = "left";
    ctx.font = "62px Arial, sans-serif";
    ctx.fillText("🏆", bx + 28, by + bh / 2 + 22);
    ctx.fillStyle = "#fb923c";
    ctx.font = "800 20px Arial, sans-serif";
    ctx.fillText("MAN OF THE MATCH", bx + 120, by + 46);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 42px Arial, sans-serif";
    ctx.fillText(motm.name, bx + 120, by + 92);
    if (motm.note) {
      ctx.fillStyle = "#aaaaaa";
      ctx.font = "italic 500 20px Arial, sans-serif";
      let note = motm.note;
      const maxW = bw - 160;
      while (ctx.measureText(note).width > maxW && note.length > 1) note = note.slice(0, -1);
      if (note !== motm.note) note = `${note.slice(0, -1)}…`;
      ctx.fillText(`"${note}"`, bx + 120, by + 122);
    }
  }

  const marginX = 50;
  const gap = 20;
  const colW = (w - marginX * 2 - gap * 2) / 3;
  const columns = [
    { x: marginX, title: "TOP SCORERS", color: "#ef4444", data: scorers, key: "goals" },
    { x: marginX + colW + gap, title: "TOP ASSISTS", color: "#f59e0b", data: assisters, key: "assists" },
    { x: marginX + (colW + gap) * 2, title: "CLEAN SHEETS", color: "#3b82f6", data: keepers, key: "clean_sheets" },
  ];

  const colHeaderY = headerH + motmH;
  columns.forEach((col) => {
    ctx.fillStyle = `${col.color}22`;
    roundRectPath(ctx, col.x, colHeaderY, colW, 46, 12);
    ctx.fill();
    ctx.strokeStyle = `${col.color}66`;
    ctx.lineWidth = 2;
    roundRectPath(ctx, col.x, colHeaderY, colW, 46, 12);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = col.color;
    ctx.font = "800 19px Arial, sans-serif";
    ctx.fillText(col.title, col.x + colW / 2, colHeaderY + 30);

    let y = colHeaderY + colHeaderH;
    col.data.forEach((p, i) => {
      if (i % 2 === 1) {
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        ctx.fillRect(col.x, y, colW, rowH);
      }
      ctx.textAlign = "left";
      ctx.fillStyle = "#666";
      ctx.font = "700 15px Arial, sans-serif";
      ctx.fillText(`${i + 1}`, col.x + 10, y + rowH / 2 + 5);

      ctx.fillStyle = "#ffffff";
      ctx.font = "600 17px Arial, sans-serif";
      let name = p.name;
      const maxNameWidth = colW - 85;
      while (ctx.measureText(name).width > maxNameWidth && name.length > 1) {
        name = name.slice(0, -1);
      }
      if (name !== p.name) name = `${name.slice(0, -1)}…`;
      ctx.fillText(name, col.x + 32, y + rowH / 2 + 5);

      ctx.textAlign = "right";
      ctx.fillStyle = col.color;
      ctx.font = "800 18px Arial, sans-serif";
      ctx.fillText(String(p[col.key]), col.x + colW - 10, y + rowH / 2 + 5);
      y += rowH;
    });

    if (col.data.length === 0) {
      ctx.textAlign = "center";
      ctx.fillStyle = "#555";
      ctx.font = "500 15px Arial, sans-serif";
      ctx.fillText("No data yet", col.x + colW / 2, y + rowH / 2 + 5);
    }
  });

  drawShareFooter(ctx, w, h);
  return c;
}

function buildPOTWShareCard(potw) {
  const w = 1080, h = 1350;
  const c = newShareCanvas(w, h);
  const ctx = c.getContext("2d");
  paintBrandBg(ctx, w, h);
  ctx.textAlign = "center";
  ctx.font = "80px Arial, sans-serif";
  ctx.fillText("🌟", w / 2, 230);
  ctx.fillStyle = "#facc15";
  ctx.font = "700 28px Arial, sans-serif";
  ctx.fillText("PLAYER OF THE WEEK", w / 2, 288);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 78px Arial, sans-serif";
  ctx.fillText(potw.name, w / 2, 396);
  ctx.fillStyle = "#8a8a9a";
  ctx.font = "600 26px Arial, sans-serif";
  ctx.fillText(potw.position || "", w / 2, 434);

  const stats = [
    { label: "GOALS", value: potw.goals, color: "#ef4444" },
    { label: "ASSISTS", value: potw.assists, color: "#f59e0b" },
    { label: "CLEAN SHEETS", value: potw.clean_sheets, color: "#3b82f6" },
  ];
  const tileW = 280, tileH = 220, gap = 20;
  const startX = w / 2 - (tileW * 3 + gap * 2) / 2;
  const y = 520;
  stats.forEach((s, i) => {
    const x = startX + i * (tileW + gap);
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    roundRectPath(ctx, x, y, tileW, tileH, 20);
    ctx.fill();
    ctx.strokeStyle = `${s.color}66`;
    ctx.lineWidth = 3;
    roundRectPath(ctx, x, y, tileW, tileH, 20);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = s.color;
    ctx.font = "900 68px Arial, sans-serif";
    ctx.fillText(String(s.value), x + tileW / 2, y + 108);
    ctx.fillStyle = "#8a8a9a";
    ctx.font = "600 18px Arial, sans-serif";
    ctx.fillText(s.label, x + tileW / 2, y + 156);
  });
  ctx.fillStyle = "#666";
  ctx.font = "500 22px Arial, sans-serif";
  ctx.fillText("SINCE LAST WEEK", w / 2, y + 260);
  drawShareFooter(ctx, w, h);
  return c;
}

function buildMOTMShareCard(motm) {
  const w = 1080, h = 1080;
  const c = newShareCanvas(w, h);
  const ctx = c.getContext("2d");
  paintBrandBg(ctx, w, h);
  ctx.textAlign = "center";
  ctx.font = "110px Arial, sans-serif";
  ctx.fillText("🏆", w / 2, 320);
  ctx.fillStyle = "#fb923c";
  ctx.font = "700 30px Arial, sans-serif";
  ctx.fillText("MAN OF THE MATCH", w / 2, 390);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 82px Arial, sans-serif";
  ctx.fillText(motm.name, w / 2, 500);
  ctx.fillStyle = "#8a8a9a";
  ctx.font = "600 26px Arial, sans-serif";
  ctx.fillText(motm.position || "", w / 2, 540);
  if (motm.note) {
    ctx.fillStyle = "#cccccc";
    ctx.font = "italic 500 24px Arial, sans-serif";
    let note = motm.note;
    const maxW = w - 200;
    while (ctx.measureText(note).width > maxW && note.length > 1) note = note.slice(0, -1);
    if (note !== motm.note) note = `${note.slice(0, -1)}…`;
    ctx.fillText(`"${note}"`, w / 2, 600);
  }
  drawShareFooter(ctx, w, h);
  return c;
}

function shareCanvasAsImage(canvas, filename) {
  canvas.toBlob(async (blob) => {
    if (!blob) return;
    try {
      const file = new File([blob], filename, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Greedie Liga", text: "Greedie Liga stats 🏆" });
        return;
      }
    } catch (e) {
      if (e && e.name === "AbortError") return;
    }
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }, "image/png", 0.95);
}

// ---------- Small components ----------
function MiniBar({ value, max, color, t }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ background: t.trackBg, borderRadius: 4, height: 6, width: "100%", overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.6s ease" }} />
    </div>
  );
}

function StatCard({ label, value, sub, color, icon, t }) {
  return (
    <div style={{ background: t.cardGrad, border: `1px solid ${color}33`, borderRadius: 16, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 4, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -10, right: -10, fontSize: 60, opacity: 0.08 }}>{icon}</div>
      <div style={{ fontSize: 11, color: t.textMuted, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'Bebas Neue', cursive" }}>{label}</div>
      <div style={{ fontSize: 34, fontWeight: 900, color, fontFamily: "'Bebas Neue', cursive", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: t.textFaint }}>{sub}</div>
    </div>
  );
}

function LeaderRow({ rank, name, value, max, color, label, t, onClick }) {
  const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: rank <= 3 ? `${color}11` : "transparent", borderRadius: 10, borderLeft: rank <= 3 ? `3px solid ${color}` : "3px solid transparent", cursor: onClick ? "pointer" : "default" }}>
      <div style={{ width: 28, textAlign: "center", fontSize: rank <= 3 ? 18 : 13, color: t.textMuted, fontFamily: "'Bebas Neue', cursive" }}>{medals[rank] || rank}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ color: t.text, fontWeight: 600, fontSize: 14 }}>{name}</span>
          <span style={{ color, fontWeight: 800, fontFamily: "'Bebas Neue', cursive", fontSize: 18 }}>{value} <span style={{ fontSize: 10, color: t.textMuted, fontWeight: 400 }}>{label}</span></span>
        </div>
        <MiniBar value={value} max={max} color={color} t={t} />
      </div>
    </div>
  );
}

// Initials for a pitch shirt badge — same plain, iconless marker style as the main player list
// (colored by position), instead of a decorative emoji picture.
function initialsOf(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
// A shirt-style player card for the FPL pitch view — badge for price, optional "C" for captain,
// optional "✕" to remove (edit mode), tap the shirt to make them captain (edit mode).
function PitchPlayerCard({ player, price, points, isCaptain, isSub, onRemove, onMakeCaptain, onToggleSub }) {
  const isGoalkeeper = player.position === "Goalkeeper";
  const color = isGoalkeeper ? GOALKEEPER_STYLE.color : positionColors[player.position];
  const badgeText = isGoalkeeper ? "GK" : initialsOf(player.name);
  return (
    <div style={{ position: "relative", width: 88, display: "flex", flexDirection: "column", alignItems: "center", opacity: isSub ? 0.72 : 1 }}>
      <div style={{ position: "absolute", top: -8, left: -4, background: "#0d0d2b", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "2px 6px", fontSize: 10, fontWeight: 800, color: "#fff", zIndex: 2, whiteSpace: "nowrap" }}>
        {price == null ? "FIXED" : `₦${price}m`}
      </div>
      {onRemove && (
        <button onClick={onRemove} style={{ position: "absolute", top: -8, right: -4, width: 20, height: 20, borderRadius: "50%", background: "#1a1a3e", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", fontSize: 11, cursor: "pointer", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 1 }}>✕</button>
      )}
      <div
        onClick={onMakeCaptain}
        style={{
          width: 62, height: 62, borderRadius: "14px 14px 6px 6px",
          background: `linear-gradient(160deg, ${color}, ${color}aa)`,
          border: isCaptain ? "2px solid #facc15" : isSub ? "2px dashed rgba(255,255,255,0.5)" : "2px solid rgba(255,255,255,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: 0.5,
          marginTop: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
          cursor: onMakeCaptain ? "pointer" : "default",
        }}
      >
        {isCaptain ? "C" : badgeText}
      </div>
      <div style={{ background: "#ffffff", color: "#111", borderRadius: 6, padding: "3px 6px", fontSize: 10, fontWeight: 700, marginTop: 6, maxWidth: 84, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {player.name}{isCaptain ? " (C)" : ""}
      </div>
      {isSub && (
        <div style={{ background: "#94a3b833", color: "#cbd5e1", borderRadius: 6, padding: "2px 6px", fontSize: 9, fontWeight: 700, marginTop: 4, letterSpacing: 0.5 }}>
          SUB · ⅓ PTS
        </div>
      )}
      {points != null && (
        <div style={{ background: "#16a34a", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 800, marginTop: 4 }}>
          {points} pt{points === 1 ? "" : "s"}
        </div>
      )}
      {onToggleSub && (
        <button onClick={onToggleSub} style={{ marginTop: 4, background: "transparent", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 6, color: "#fff", fontSize: 9, cursor: "pointer", padding: "3px 6px" }}>
          {isSub ? "↑ Start" : "↓ Bench"}
        </button>
      )}
    </div>
  );
}

// Green pitch backdrop the shirt cards sit on, with faint pitch markings.
function Pitch({ children }) {
  return (
    <div style={{ position: "relative", background: "linear-gradient(180deg, #1a8f3c 0%, #14742f 100%)", borderRadius: 16, padding: "26px 10px 22px", overflow: "hidden", border: "2px solid #0d5c22" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 34px, transparent 34px, transparent 68px)" }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 100, height: 100, marginLeft: -50, marginTop: -50, border: "2px solid rgba(255,255,255,0.3)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, background: "rgba(255,255,255,0.3)" }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 24 }}>{children}</div>
    </div>
  );
}

function InsightCard({ emoji, color, text, index, t }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${color}0d, ${t.cardBg})`, border: `1px solid ${color}2a`, borderRadius: 16, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10, animation: `fadeIn 0.4s ease ${index * 0.07}s both` }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ fontSize: 26, lineHeight: 1, marginTop: 2 }}>{emoji}</div>
        <div style={{ flex: 1, color: t.textDim, fontSize: 14, lineHeight: 1.6 }}>{text}</div>
      </div>
      <div style={{ textAlign: "right", fontSize: 12, color, fontWeight: 700, fontStyle: "italic", opacity: 0.9 }}>{STARMAN}</div>
    </div>
  );
}

// ---------- Main App ----------
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmDeleteTeam, setConfirmDeleteTeam] = useState(null); // an over-budget fpl_teams row admin is about to remove

  // Theme
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem("greedie_theme");
      return saved ? saved === "dark" : true;
    } catch {
      return true;
    }
  });
  useEffect(() => {
    try { localStorage.setItem("greedie_theme", isDark ? "dark" : "light"); } catch {}
  }, [isDark]);
  const t = isDark ? THEMES.dark : THEMES.light;

  // Player of the Week / season meta
  const [potw, setPotw] = useState(null);
  const [lastSnapshot, setLastSnapshot] = useState(null);
  const [seasonArchive, setSeasonArchive] = useState([]);
  const [confirmSeasonReset, setConfirmSeasonReset] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Man of the Match
  const [motm, setMotm] = useState(null);
  const [motmHistory, setMotmHistory] = useState([]);
  const [showMotmAward, setShowMotmAward] = useState(false);
  const [showMotmHistory, setShowMotmHistory] = useState(false);
  const [motmForm, setMotmForm] = useState({ name: "", note: "" });

  // FPL
  const [fplManager, setFplManager] = useState(() => {
    try {
      const saved = localStorage.getItem("greedie_fpl_manager");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [fplManagers, setFplManagers] = useState([]);
  const [fplTeams, setFplTeams] = useState([]);
  const [fplSignInName, setFplSignInName] = useState("");
  const [fplSignInPin, setFplSignInPin] = useState("");
  const [fplSignInError, setFplSignInError] = useState("");
  const [fplSaving, setFplSaving] = useState(false);
  const [fplEditing, setFplEditing] = useState(false);
  const [fplDraftPicks, setFplDraftPicks] = useState([]);
  const [fplDraftCaptain, setFplDraftCaptain] = useState(null);
  const [fplDraftSubs, setFplDraftSubs] = useState([]); // subset of fplDraftPicks marked as substitutes (max FPL_SUB_SIZE)
  const [fplDraftBank, setFplDraftBank] = useState(FPL_BUDGET); // unspent budget during this edit — the buy/sell ledger's running balance
  const [fplDraftPurchasePrices, setFplDraftPurchasePrices] = useState({}); // playerId -> price paid, for the sell-on fee calc
  const [fplSearchQ, setFplSearchQ] = useState("");
  const [priceEditId, setPriceEditId] = useState(null);
  const [priceEditValue, setPriceEditValue] = useState("");
  const [viewingTeam, setViewingTeam] = useState(null); // an fpl_teams row being viewed read-only from the leaderboard
  const [now, setNow] = useState(() => new Date()); // ticks so the squad lock window flips live, no refresh needed

  useEffect(() => { loadPlayers(); loadMeta(); loadFplData(); }, []);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000); // check twice a minute — plenty for a 5pm/8pm cutoff
    return () => clearInterval(id);
  }, []);

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

  async function loadMeta() {
    try {
      const rows = await sbFetch(`app_meta?key=in.(last_week_snapshot,current_potw,season_archive,motm_history)&select=key,value`);
      const map = {};
      rows.forEach((r) => { map[r.key] = r.value; });
      setLastSnapshot(map.last_week_snapshot || null);
      setPotw(map.current_potw || null);
      setSeasonArchive(map.season_archive || []);
      const history = map.motm_history || [];
      setMotmHistory(history);
      setMotm(history[0] || null);
    } catch (e) {
      // app_meta table not created yet (or offline) — new features degrade gracefully
      console.warn("Greedie Liga: app_meta unavailable", e);
    }
  }

  async function loadFplData() {
    try {
      const [managers, teams] = await Promise.all([
        sbFetch("fpl_managers?select=id,name"),
        sbFetch("fpl_teams?select=*"),
      ]);
      setFplManagers(managers);
      setFplTeams(teams);
    } catch (e) {
      // fpl_managers / fpl_teams tables not created yet (or offline) — FPL degrades gracefully
      console.warn("Greedie Liga: FPL tables unavailable", e);
    }
  }

  // A team's unspent budget. Persisted going forward once they save — but a squad that was
  // saved before the buy/sell ledger existed has no `bank` yet, so treat it as if it had just
  // bought its current picks today at today's prices (a one-time, on-the-fly migration).
  function getTeamBank(team) {
    if (team.bank != null) return team.bank;
    const spent = (team.player_ids || []).reduce((sum, id) => { const p = players.find((pl) => pl.id === id); return sum + (p ? priceOf(p) : 0); }, 0);
    return FPL_BUDGET - spent;
  }
  function getTeamPurchasePrices(team) {
    if (team.purchase_prices && Object.keys(team.purchase_prices).length) return team.purchase_prices;
    const map = {};
    (team.player_ids || []).forEach((id) => { const p = players.find((pl) => pl.id === id); if (p) map[id] = priceOf(p); });
    return map;
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  function handlePinSubmit() {
    if (pinInput === "4031") { setIsAdmin(true); setPinError(false); setPinInput(""); }
    else { setPinError(true); setPinInput(""); }
  }

  function handleLock() { setIsAdmin(false); setPinInput(""); setPinError(false); setShowAdd(false); }

  async function deletePlayer(player) {
    setSaving(true);
    try {
      await sbFetch(`players?id=eq.${player.id}`, { method: "DELETE" });
      // Clean up any FPL squads that had this player picked, so nothing dangles. Refund whatever
      // they'd paid straight back to the bank — this is a forced removal, not a sale, so no sell-on fee.
      const affected = fplTeams.filter((team) => (team.player_ids || []).includes(player.id));
      if (affected.length) {
        await Promise.all(affected.map((team) => {
          const purchasePrices = getTeamPurchasePrices(team);
          const refund = purchasePrices[player.id] != null ? purchasePrices[player.id] : priceOf(player);
          const nextPurchasePrices = { ...purchasePrices };
          delete nextPurchasePrices[player.id];
          return sbFetch(`fpl_teams?id=eq.${team.id}`, {
            method: "PATCH",
            body: JSON.stringify({
              player_ids: (team.player_ids || []).filter((id) => id !== player.id),
              sub_ids: (team.sub_ids || []).filter((id) => id !== player.id),
              captain_id: team.captain_id === player.id ? null : team.captain_id,
              bank: getTeamBank(team) + refund,
              purchase_prices: nextPurchasePrices,
            }),
          });
        }));
        await loadFplData();
      }
      await loadPlayers();
      setConfirmDelete(null);
      showToast(`${player.name} removed ✅`);
    } catch (e) { showToast("Failed to delete.", "error"); }
    finally { setSaving(false); }
  }

  // Admin cleanup: removes an old squad (e.g. one saved before a budget cut) from the leaderboard entirely.
  async function deleteFplTeam(team) {
    setSaving(true);
    try {
      await sbFetch(`fpl_teams?id=eq.${team.id}`, { method: "DELETE" });
      await loadFplData();
      setConfirmDeleteTeam(null);
      showToast(`${team.managerName || "Squad"} removed from leaderboard ✅`);
    } catch (e) { showToast("Failed to remove squad.", "error"); }
    finally { setSaving(false); }
  }

  // Applies a points delta (from one player's stat change) to every FPL squad that has them picked.
  // Captains earn double. This is what makes FPL scoring "live" — it fires on every stat save.
  async function applyFplPointsDelta(playerId, pointsDelta) {
    if (!pointsDelta) return;
    try {
      const affected = fplTeams.filter((team) => (team.player_ids || []).includes(playerId));
      if (!affected.length) return;
      await Promise.all(affected.map((team) => {
        const isCaptain = team.captain_id === playerId;
        const isSub = (team.sub_ids || []).includes(playerId);
        const teamDelta = Math.round(pointsDelta * (isSub ? FPL_SUB_POINT_FACTOR : 1) * (isCaptain ? 2 : 1));
        const newTotal = (team.total_points || 0) + teamDelta;
        // Per-player ledger so managers can see how each squad member contributed,
        // not just the team's combined total.
        const newPlayerPoints = { ...(team.player_points || {}) };
        newPlayerPoints[playerId] = (newPlayerPoints[playerId] || 0) + teamDelta;
        return sbFetch(`fpl_teams?id=eq.${team.id}`, { method: "PATCH", body: JSON.stringify({ total_points: newTotal, player_points: newPlayerPoints, updated_at: new Date().toISOString() }) });
      }));
      await loadFplData();
    } catch (e) {
      console.warn("Greedie Liga: FPL scoring update failed", e);
    }
  }

  async function saveEdit() {
    setSaving(true);
    try {
      const before = players.find((p) => p.id === editForm.id);
      const newGoals = +editForm.goals, newAssists = +editForm.assists, newCS = +editForm.clean_sheets;
      await sbFetch(`players?id=eq.${editForm.id}`, { method: "PATCH", body: JSON.stringify({ goals: newGoals, assists: newAssists, clean_sheets: newCS, position: editForm.position }) });
      if (before) {
        const dGoals = newGoals - before.goals;
        const dAssists = newAssists - before.assists;
        const dCS = editForm.position === "Defender" ? newCS - before.clean_sheets : 0;
        const pointsDelta = dGoals * FPL_POINTS.goal + dAssists * FPL_POINTS.assist + dCS * FPL_POINTS.cleanSheet;
        await applyFplPointsDelta(editForm.id, pointsDelta);
      }
      await loadPlayers(); setEditPlayer(null); showToast("Stats updated! ✅");
    } catch (e) { showToast("Failed to save.", "error"); }
    finally { setSaving(false); }
  }

  async function addPlayer() {
    if (!addForm.name.trim()) return;
    setSaving(true);
    try {
      await sbFetch("players", { method: "POST", body: JSON.stringify({ ...addForm, goals: +addForm.goals, assists: +addForm.assists, clean_sheets: +addForm.clean_sheets }) });
      await loadPlayers();
      setAddForm({ name: "", position: "Midfielder", goals: 0, assists: 0, clean_sheets: 0 });
      setShowAdd(false); showToast("Player added! 🎉");
    } catch (e) { showToast("Failed to add player.", "error"); }
    finally { setSaving(false); }
  }

  // ---- Player of the Week ----
  async function startNewWeek() {
    setSaving(true);
    try {
      const snapshotPlayers = players.map((p) => ({ id: p.id, name: p.name, position: p.position, goals: p.goals, assists: p.assists, clean_sheets: p.clean_sheets }));
      if (lastSnapshot && lastSnapshot.players && lastSnapshot.players.length) {
        const prevMap = {};
        lastSnapshot.players.forEach((p) => { prevMap[p.id] = p; });
        let best = null;
        const priceUpdates = [];
        players.forEach((p) => {
          const prev = prevMap[p.id];
          const dGoals = prev ? Math.max(0, p.goals - prev.goals) : p.goals;
          const dAssists = prev ? Math.max(0, p.assists - prev.assists) : p.assists;
          const dCS = prev ? Math.max(0, p.clean_sheets - prev.clean_sheets) : p.clean_sheets;
          const score = dGoals * 3 + dAssists * 2 + dCS * 2;
          if (score > 0 && (!best || score > best.score)) {
            best = { name: p.name, position: p.position, goals: dGoals, assists: dAssists, clean_sheets: dCS, score, computed_at: new Date().toISOString() };
          }
          // Price moves once here, by a small capped amount based on THIS week's contribution only.
          const bump = weeklyPriceBump(dGoals, dAssists, dCS, p.position);
          if (bump !== 0) {
            const current = priceOf(p);
            const next = Math.round(Math.max(0, Math.min(current + bump, 20)) * 2) / 2;
            if (next !== current) priceUpdates.push({ id: p.id, base_price: next });
          }
        });
        if (best) {
          await setMeta("current_potw", best);
          setPotw(best);
          showToast(`🌟 ${best.name} is Player of the Week!`);
        } else {
          showToast("No stat changes since last week — POTW unchanged.", "error");
        }
        if (priceUpdates.length) {
          await Promise.all(priceUpdates.map((u) => sbFetch(`players?id=eq.${u.id}`, { method: "PATCH", body: JSON.stringify({ base_price: u.base_price }) })));
        }
      } else {
        showToast("Baseline saved. POTW and price changes will show from your next update. ✅");
      }
      const snap = { saved_at: new Date().toISOString(), players: snapshotPlayers };
      await setMeta("last_week_snapshot", snap);
      setLastSnapshot(snap);
      await loadPlayers();
    } catch (e) {
      showToast("Failed to update week. Did you create the app_meta table?", "error");
    } finally {
      setSaving(false);
    }
  }

  // ---- Man of the Match ----
  async function awardMotm() {
    if (!motmForm.name) return;
    setSaving(true);
    try {
      const player = players.find((p) => p.name === motmForm.name);
      const entry = { name: motmForm.name, position: player?.position || "", note: motmForm.note.trim(), awarded_at: new Date().toISOString() };
      const updated = [entry, ...motmHistory].slice(0, 50);
      await setMeta("motm_history", updated);
      setMotmHistory(updated);
      setMotm(entry);
      setShowMotmAward(false);
      setMotmForm({ name: "", note: "" });
      showToast(`🏆 ${entry.name} named Man of the Match!`);
    } catch (e) {
      showToast("Failed to save MOTM. Did you create the app_meta table?", "error");
    } finally {
      setSaving(false);
    }
  }

  // ---- New Season ----
  async function startNewSeason() {
    setSaving(true);
    try {
      const archive = {
        archived_at: new Date().toISOString(),
        label: `Season ending ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`,
        players: players.map((p) => ({ name: p.name, position: p.position, goals: p.goals, assists: p.assists, clean_sheets: p.clean_sheets })),
      };
      const existing = (await getMeta("season_archive")) || [];
      const updated = [archive, ...existing].slice(0, 20);
      await setMeta("season_archive", updated);
      setSeasonArchive(updated);
      // Seed next season's starting prices from the season that just ended, so players don't
      // all flatten back to a bare ₦4m the moment their stats reset to zero — a returning
      // star keeps a meaningful price from day one, same as real FPL does off reputation.
      await Promise.all(players.map((p) => sbFetch(`players?id=eq.${p.id}`, { method: "PATCH", body: JSON.stringify({ goals: 0, assists: 0, clean_sheets: 0, base_price: seasonReputationPrice(p) }) })));
      await setMeta("last_week_snapshot", null);
      await setMeta("current_potw", null);
      setLastSnapshot(null);
      setPotw(null);
      // Fresh FPL competition too — squads stay intact, points reset to zero. Prices just got
      // reseeded above, so the buy/sell ledger resets too (null bank / empty purchase_prices is
      // read as "as if bought fresh today" — see getTeamBank) rather than carrying stale figures
      // from last season's price scale into the new one.
      if (fplTeams.length) {
        await Promise.all(fplTeams.map((team) => sbFetch(`fpl_teams?id=eq.${team.id}`, { method: "PATCH", body: JSON.stringify({ total_points: 0, player_points: {}, bank: null, purchase_prices: {} }) })));
        await loadFplData();
      }
      await loadPlayers();
      setConfirmSeasonReset(false);
      showToast("🔄 New season started! Previous season archived.");
    } catch (e) {
      showToast("Failed to reset season. Did you create the app_meta table?", "error");
    } finally {
      setSaving(false);
    }
  }

  // ---- FPL ----
  const fplTeam = fplManager ? fplTeams.find((team) => team.manager_id === fplManager.id) : null;

  async function handleFplAuth() {
    const name = fplSignInName.trim();
    if (!name || !fplSignInPin.trim()) return;
    setFplSaving(true);
    setFplSignInError("");
    try {
      const existing = await sbFetch(`fpl_managers?name=eq.${encodeURIComponent(name)}&select=id,name,pin`);
      if (existing.length) {
        if (existing[0].pin !== fplSignInPin.trim()) {
          setFplSignInError("Wrong PIN for that name.");
          setFplSaving(false);
          return;
        }
        const manager = { id: existing[0].id, name: existing[0].name };
        setFplManager(manager);
        try { localStorage.setItem("greedie_fpl_manager", JSON.stringify(manager)); } catch {}
        showToast(`Welcome back, ${manager.name}! 👋`);
      } else {
        const created = await sbFetch("fpl_managers", { method: "POST", body: JSON.stringify({ name, pin: fplSignInPin.trim() }) });
        const manager = { id: created[0].id, name: created[0].name };
        setFplManager(manager);
        try { localStorage.setItem("greedie_fpl_manager", JSON.stringify(manager)); } catch {}
        await loadFplData();
        showToast(`Team created! Welcome, ${manager.name} 🎮`);
      }
      setFplSignInName("");
      setFplSignInPin("");
    } catch (e) {
      setFplSignInError("Couldn't sign in. Did you create the fpl_managers table?");
    } finally {
      setFplSaving(false);
    }
  }

  function handleFplSignOut() {
    setFplManager(null);
    setFplEditing(false);
    setFplDraftPicks([]);
    setFplDraftCaptain(null);
    try { localStorage.removeItem("greedie_fpl_manager"); } catch {}
  }

  function startFplBuild() {
    if (isFplLocked(now)) {
      showToast(`Squads are locked until 8:00pm on gamedays. Try again after 8pm.`, "error");
      return;
    }
    if (fplTeam) {
      setFplDraftPicks([...(fplTeam.player_ids || [])]);
      setFplDraftCaptain(fplTeam.captain_id || null);
      setFplDraftSubs([...(fplTeam.sub_ids || [])]);
      setFplDraftBank(getTeamBank(fplTeam));
      setFplDraftPurchasePrices({ ...getTeamPurchasePrices(fplTeam) });
    } else {
      setFplDraftPicks([]);
      setFplDraftCaptain(null);
      setFplDraftSubs([]);
      setFplDraftBank(FPL_BUDGET);
      setFplDraftPurchasePrices({});
    }
    setFplEditing(true);
  }

  // Removing a pick "sells" it at its sell-on-fee-adjusted value; adding one "buys" it at today's
  // live price. Both move the draft bank, same as a real transfer would.
  function toggleFplPick(playerId) {
    if (fplDraftPicks.includes(playerId)) {
      const player = players.find((p) => p.id === playerId);
      const purchasePrice = fplDraftPurchasePrices[playerId];
      const sellPrice = player ? (purchasePrice != null ? sellValueOf(purchasePrice, priceOf(player)) : priceOf(player)) : 0;
      setFplDraftPicks(fplDraftPicks.filter((id) => id !== playerId));
      setFplDraftSubs(fplDraftSubs.filter((id) => id !== playerId));
      if (fplDraftCaptain === playerId) setFplDraftCaptain(null);
      setFplDraftBank(fplDraftBank + sellPrice);
      setFplDraftPurchasePrices((prev) => { const next = { ...prev }; delete next[playerId]; return next; });
      return;
    }
    if (fplDraftPicks.length >= FPL_TOTAL_PICKS) return;
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    const cost = priceOf(player);
    if (fplDraftBank - cost < 0) return;
    setFplDraftPicks([...fplDraftPicks, playerId]);
    setFplDraftBank(fplDraftBank - cost);
    setFplDraftPurchasePrices((prev) => ({ ...prev, [playerId]: cost }));
  }

  // Moves a pick between the starting XI and the bench. Captain must be a starter, so benching
  // the current captain clears the armband rather than leaving it on a sub.
  function toggleSubStatus(playerId) {
    if (fplDraftSubs.includes(playerId)) {
      setFplDraftSubs(fplDraftSubs.filter((id) => id !== playerId));
      return;
    }
    if (fplDraftSubs.length >= FPL_SUB_SIZE) return;
    setFplDraftSubs([...fplDraftSubs, playerId]);
    if (fplDraftCaptain === playerId) setFplDraftCaptain(null);
  }

  async function saveFplTeam() {
    if (!fplManager) return;
    if (isFplLocked(now)) {
      showToast(`Squads are locked until 8:00pm on gamedays. Try again after 8pm.`, "error");
      return;
    }
    if (fplDraftPicks.length !== FPL_TOTAL_PICKS) {
      showToast(`Pick exactly ${FPL_TOTAL_PICKS} players (${FPL_SQUAD_SIZE} starters + ${FPL_SUB_SIZE} subs) before saving.`, "error");
      return;
    }
    if (fplDraftSubs.length !== FPL_SUB_SIZE) {
      showToast(`Bench exactly ${FPL_SUB_SIZE} of your picks as substitutes before saving.`, "error");
      return;
    }
    if (fplDraftBank < 0) {
      showToast(`Over budget by ₦${Math.abs(fplDraftBank).toFixed(1)}m — sell a player before saving.`, "error");
      return;
    }
    setFplSaving(true);
    try {
      const starters = fplDraftPicks.filter((id) => !fplDraftSubs.includes(id));
      const captain = fplDraftCaptain && starters.includes(fplDraftCaptain) ? fplDraftCaptain : starters[0];
      const body = { player_ids: fplDraftPicks, sub_ids: fplDraftSubs, captain_id: captain, bank: fplDraftBank, purchase_prices: fplDraftPurchasePrices };
      if (fplTeam) {
        await sbFetch(`fpl_teams?id=eq.${fplTeam.id}`, { method: "PATCH", body: JSON.stringify({ ...body, updated_at: new Date().toISOString() }) });
        showToast("Team updated! ✅");
      } else {
        await sbFetch("fpl_teams", { method: "POST", body: JSON.stringify({ manager_id: fplManager.id, ...body, total_points: 0 }) });
        showToast("Team saved! ⚽");
      }
      await loadFplData();
      setFplEditing(false);
    } catch (e) {
      showToast("Failed to save team. Did you create the fpl_teams table?", "error");
    } finally {
      setFplSaving(false);
    }
  }

  // ---- Admin: set each player's current price directly — see the pricing model note above priceOf() ----
  function startPriceEdit(player) {
    setPriceEditId(player.id);
    setPriceEditValue(player.base_price != null ? String(player.base_price) : "");
  }
  async function saveBasePrice(player) {
    const raw = priceEditValue.trim();
    let basePrice = null;
    if (raw !== "") {
      const parsed = parseFloat(raw);
      if (isNaN(parsed) || parsed < 0) { showToast("Enter a valid price.", "error"); return; }
      basePrice = Math.round(parsed * 2) / 2; // snap to nearest ₦0.5m
    }
    setSaving(true);
    try {
      const updated = await sbFetch(`players?id=eq.${player.id}`, { method: "PATCH", body: JSON.stringify({ base_price: basePrice }) });
      // Apply the server-confirmed row straight into state so every price display (admin panel,
      // squad builder, pitch cards) updates instantly, instead of depending on a second fetch.
      if (updated && updated[0]) {
        const saved = updated[0];
        setPlayers((prev) => prev.map((p) => (p.id === player.id ? { ...p, ...saved } : p)));
      } else {
        await loadPlayers();
      }
      setPriceEditId(null);
      showToast(basePrice == null ? "Reset to default price. ✅" : "Price updated! ✅");
    } catch (e) {
      showToast("Failed to update price. Did you add the base_price column in Supabase?", "error");
    } finally {
      setSaving(false);
    }
  }

  // ---- Share ----
  function handleShareOverview() {
    const canvas = buildLeaderboardsShareCard(scorers, assisters, keepers, motm);
    shareCanvasAsImage(canvas, "greedie-liga-leaderboards.png");
  }

  function handleShareMotm() {
    if (!motm) return;
    const canvas = buildMOTMShareCard(motm);
    shareCanvasAsImage(canvas, `greedie-liga-motm-${motm.name.toLowerCase().replace(/\s+/g, "-")}.png`);
  }

  function handleSharePOTW() {
    if (!potw) return;
    const canvas = buildPOTWShareCard(potw);
    shareCanvasAsImage(canvas, `greedie-liga-potw-${potw.name.toLowerCase().replace(/\s+/g, "-")}.png`);
  }

  const totalGoals = players.reduce((a, p) => a + p.goals, 0);
  const totalAssists = players.reduce((a, p) => a + p.assists, 0);
  const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0];
  const topAssist = [...players].sort((a, b) => b.assists - a.assists)[0];
  const topCS = [...players].sort((a, b) => b.clean_sheets - a.clean_sheets)[0];
  const maxGoals = Math.max(...players.map((p) => p.goals), 1);
  const maxAssists = Math.max(...players.map((p) => p.assists), 1);
  const maxCS = Math.max(...players.map((p) => p.clean_sheets), 1);
  const scorers = [...players].filter((p) => p.goals > 0).sort((a, b) => b.goals - a.goals);
  const assisters = [...players].filter((p) => p.assists > 0).sort((a, b) => b.assists - a.assists);
  const keepers = [...players].filter((p) => p.clean_sheets > 0).sort((a, b) => b.clean_sheets - a.clean_sheets);
  const filteredPlayers = [...players].filter((p) => filterPos === "All" || p.position === filterPos).filter((p) => p.name.toLowerCase().includes(searchQ.toLowerCase())).sort((a, b) => b[sortBy] - a[sortBy]);
  const insights = generateInsights(players);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "insights", label: "Insights", icon: "💬" },
    { id: "scorers", label: "Scorers", icon: "⚽" },
    { id: "assists", label: "Assists", icon: "🎯" },
    { id: "ga", label: "G/A", icon: "🏅" },
    { id: "inv", label: "INV%", icon: "📈" },
    { id: "ratio", label: "Ratio", icon: "🧮" },
    { id: "cleansheets", label: "Clean Sheets", icon: "🧤" },
    { id: "squad", label: "Squad", icon: "👥" },
    { id: "fpl", label: "FPL", icon: "🎮" },
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", background: t.pageBg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 42, letterSpacing: 4, background: t.logoGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GREEDIE LIGA</div>
      <div style={{ color: "#3b82f6", fontSize: 14 }}>Loading stats...</div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", background: t.pageBg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 24 }}>
      <div style={{ fontSize: 40 }}>⚠️</div>
      <div style={{ color: "#ef4444", textAlign: "center" }}>{error}</div>
      <button onClick={loadPlayers} style={{ background: "#3b82f6", border: "none", borderRadius: 10, padding: "12px 24px", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Retry</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${t.cardBg}; } ::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 2px; }
        input, select { outline: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>

      {toast && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 999, background: toast.type === "error" ? "#ef444422" : "#16a34a22", border: `1px solid ${toast.type === "error" ? "#ef4444" : "#16a34a"}`, borderRadius: 10, padding: "12px 20px", color: toast.type === "error" ? "#ef4444" : "#4ade80", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}>{toast.msg}</div>
      )}

      <div style={{ background: t.headerGrad, borderBottom: `1px solid ${t.headerBorder}`, padding: "20px 16px 0", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 8, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 34, letterSpacing: 3, background: t.logoGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GREEDIE LIGA</div>
              <div style={{ fontSize: 10, color: t.textFaint, letterSpacing: 3, textTransform: "uppercase" }}>5-A-Side League · Live Stats</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setIsDark(!isDark)} title="Toggle theme" style={{ background: t.toggleBg, border: `1px solid ${t.toggleBorder}`, borderRadius: 8, padding: "8px 12px", color: t.textDim, cursor: "pointer", fontSize: 14 }}>{isDark ? "🌙" : "☀️"}</button>
              <button onClick={handleShareOverview} title="Share snapshot" style={{ background: t.toggleBg, border: `1px solid ${t.toggleBorder}`, borderRadius: 8, padding: "8px 12px", color: t.textDim, cursor: "pointer", fontSize: 12 }}>📤 Share</button>
              <button onClick={loadPlayers} style={{ background: t.toggleBg, border: `1px solid ${t.toggleBorder}`, borderRadius: 8, padding: "8px 14px", color: t.textDim, cursor: "pointer", fontSize: 12 }}>🔄 Refresh</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 2, overflowX: "auto", paddingBottom: 1 }}>
            {tabs.map((tb) => (
              <button key={tb.id} onClick={() => setActiveTab(tb.id)} style={{ padding: "9px 12px", background: activeTab === tb.id ? "rgba(59,130,246,0.15)" : "transparent", border: "none", borderBottom: activeTab === tb.id ? "2px solid #3b82f6" : "2px solid transparent", color: activeTab === tb.id ? "#3b82f6" : t.textMuted, cursor: "pointer", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", borderRadius: "6px 6px 0 0" }}>
                {tb.icon} {tb.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 14px" }}>
        {activeTab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              <StatCard label="Goals" value={totalGoals} sub={`${scorers.length} scorers`} color="#ef4444" icon="⚽" t={t} />
              <StatCard label="Assists" value={totalAssists} sub={`${assisters.length} players`} color="#f59e0b" icon="🎯" t={t} />
              <StatCard label="Squad" value={players.length} sub="registered" color="#3b82f6" icon="👥" t={t} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Golden Boot", player: topScorer, stat: topScorer?.goals, statLabel: "goals", color: "#ef4444", icon: "👑" },
                { label: "Playmaker", player: topAssist, stat: topAssist?.assists, statLabel: "assists", color: "#f59e0b", icon: "🪄" },
                { label: "Iron Wall", player: topCS, stat: topCS?.clean_sheets, statLabel: "CS", color: "#3b82f6", icon: "🧱" },
              ].map(({ label, player, stat, statLabel, color, icon }) => (
                <div key={label} style={{ background: `linear-gradient(135deg, ${color}11, ${color}05)`, border: `1px solid ${color}33`, borderRadius: 14, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 24 }}>{icon}</div>
                  <div style={{ fontSize: 9, color: t.textMuted, textTransform: "uppercase", letterSpacing: 2, marginTop: 6, fontFamily: "'Bebas Neue', cursive" }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: t.text, marginTop: 2 }}>{player?.name}</div>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, color, lineHeight: 1 }}>{stat}</div>
                  <div style={{ fontSize: 10, color: t.textMuted }}>{statLabel}</div>
                </div>
              ))}
            </div>

            {/* Man of the Match */}
            {motm ? (
              <div style={{ background: "linear-gradient(135deg, #fb923c11, #07071a)", border: "1px solid #fb923c33", borderRadius: 16, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 26 }}>🏆</div>
                    <div>
                      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 16, letterSpacing: 2, color: "#fb923c" }}>MAN OF THE MATCH</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: t.text }}>{motm.name} <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>{motm.position}</span></div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setShowMotmHistory(true)} style={{ background: t.toggleBg, border: `1px solid ${t.toggleBorder}`, borderRadius: 8, padding: "7px 12px", color: t.textDim, cursor: "pointer", fontSize: 12 }}>📜 History</button>
                    <button onClick={handleShareMotm} style={{ background: t.toggleBg, border: `1px solid ${t.toggleBorder}`, borderRadius: 8, padding: "7px 12px", color: t.textDim, cursor: "pointer", fontSize: 12 }}>📤 Share</button>
                  </div>
                </div>
                {motm.note && <div style={{ fontSize: 13, color: t.textDim, fontStyle: "italic", marginTop: 8 }}>"{motm.note}"</div>}
                <div style={{ fontSize: 10, color: t.textFaint, marginTop: 10, textTransform: "uppercase", letterSpacing: 1 }}>
                  Awarded {new Date(motm.awarded_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · Won {motmHistory.filter((m) => m.name === motm.name).length}× this season
                </div>
              </div>
            ) : (
              <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 26, opacity: 0.5 }}>🏆</div>
                <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.5 }}>No Man of the Match yet. An admin can award one from the Squad tab — <span style={{ color: t.textDim }}>Admin Tools → Award MOTM</span>.</div>
              </div>
            )}

            {/* Player of the Week */}
            {potw ? (
              <div style={{ background: "linear-gradient(135deg, #facc1511, #07071a)", border: "1px solid #facc1533", borderRadius: 16, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 26 }}>🌟</div>
                    <div>
                      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 16, letterSpacing: 2, color: "#facc15" }}>PLAYER OF THE WEEK</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: t.text }}>{potw.name} <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>{potw.position}</span></div>
                    </div>
                  </div>
                  <button onClick={handleSharePOTW} style={{ background: t.toggleBg, border: `1px solid ${t.toggleBorder}`, borderRadius: 8, padding: "7px 12px", color: t.textDim, cursor: "pointer", fontSize: 12 }}>📤 Share</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  <div style={{ background: "#ef444411", borderRadius: 8, padding: "8px 4px", textAlign: "center" }}><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 20, color: "#ef4444" }}>{potw.goals}</div><div style={{ fontSize: 9, color: t.textMuted }}>GOALS</div></div>
                  <div style={{ background: "#f59e0b11", borderRadius: 8, padding: "8px 4px", textAlign: "center" }}><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 20, color: "#f59e0b" }}>{potw.assists}</div><div style={{ fontSize: 9, color: t.textMuted }}>ASSISTS</div></div>
                  <div style={{ background: "#3b82f611", borderRadius: 8, padding: "8px 4px", textAlign: "center" }}><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 20, color: "#3b82f6" }}>{potw.clean_sheets}</div><div style={{ fontSize: 9, color: t.textMuted }}>CLEAN SHEETS</div></div>
                </div>
                <div style={{ fontSize: 10, color: t.textFaint, marginTop: 10, textTransform: "uppercase", letterSpacing: 1 }}>Since last week</div>
              </div>
            ) : (
              <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 26, opacity: 0.5 }}>🌟</div>
                <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.5 }}>Player of the Week isn't tracking yet. An admin can kick it off from the Squad tab — <span style={{ color: t.textDim }}>Admin Tools → Start New Week</span>.</div>
              </div>
            )}

            <div style={{ background: t.cardBg, borderRadius: 16, padding: 18, border: `1px solid ${t.border}` }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 18, letterSpacing: 2, marginBottom: 14, color: t.textDim }}>GOALS BY POSITION</div>
              {["Defender", "Midfielder", "Striker"].map((pos) => {
                const posGoals = players.filter((p) => p.position === pos).reduce((a, p) => a + p.goals, 0);
                const color = positionColors[pos];
                return (
                  <div key={pos} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ color, fontWeight: 600, fontSize: 13 }}>{positionEmoji[pos]} {pos}s</span>
                      <span style={{ color: t.textMuted, fontSize: 12 }}>{posGoals} goals</span>
                    </div>
                    <MiniBar value={posGoals} max={totalGoals} color={color} t={t} />
                  </div>
                );
              })}
            </div>

            <div onClick={() => setActiveTab("insights")} style={{ background: "linear-gradient(135deg, #a855f711, #07071a)", border: "1px solid #a855f733", borderRadius: 16, padding: 18, cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 32 }}>💬</div>
              <div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 16, letterSpacing: 2, color: "#a855f7" }}>LIGA INSIGHTS</div>
                <div style={{ fontSize: 12, color: t.textDim, marginTop: 2 }}>{insights.length} fresh takes from {STARMAN} — tap to read</div>
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
            <div style={{ background: t.cardBg, border: "1px solid #a855f733", borderRadius: 12, padding: "12px 16px", fontSize: 12, color: t.textDim, lineHeight: 1.5 }}>
              Auto-generated from live stats. Updates every time stats change. Signed by {STARMAN}
            </div>
            {insights.map((ins, i) => (
              <InsightCard key={i} index={i} emoji={ins.emoji} color={ins.color} text={ins.text} t={t} />
            ))}
          </div>
        )}

        {activeTab === "scorers" && (
          <div style={{ background: t.cardBg, borderRadius: 16, padding: 20, border: `1px solid ${t.border}` }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: 3, marginBottom: 20, color: "#ef4444" }}>⚽ TOP SCORERS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {scorers.map((p, i) => <LeaderRow key={p.id} rank={i + 1} name={p.name} value={p.goals} max={maxGoals} color="#ef4444" label="goals" t={t} />)}
            </div>
          </div>
        )}

        {activeTab === "assists" && (
          <div style={{ background: t.cardBg, borderRadius: 16, padding: 20, border: `1px solid ${t.border}` }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: 3, marginBottom: 20, color: "#f59e0b" }}>🎯 TOP ASSISTS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {assisters.map((p, i) => <LeaderRow key={p.id} rank={i + 1} name={p.name} value={p.assists} max={maxAssists} color="#f59e0b" label="assists" t={t} />)}
            </div>
          </div>
        )}

        {activeTab === "ga" && (() => {
          const tg = players.reduce((a, p) => a + p.goals, 0);
          const gaPlayers = [...players].map((p) => ({ ...p, ga: p.goals + p.assists, involvement: tg > 0 ? Math.round(((p.goals + p.assists) / tg) * 100) : 0, ratio: p.assists > 0 ? (p.goals / p.assists).toFixed(1) : p.goals > 0 ? "∞" : "—" })).filter((p) => p.ga > 0).sort((a, b) => b.ga - a.ga || b.goals - a.goals);
          const maxGA = Math.max(...gaPlayers.map((p) => p.ga), 1);
          const medals = { 0: "🥇", 1: "🥈", 2: "🥉" };
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "linear-gradient(135deg, #1a0533, #0f0f23)", border: "1px solid #a855f733", borderRadius: 16, padding: 20 }}>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: 3, color: "#a855f7", marginBottom: 4 }}>🏅 GOALS + ASSISTS</div>
                <div style={{ fontSize: 12, color: "#999" }}>Season rankings — combined goal contributions</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {[{ label: "G/A", desc: "Combined", color: "#a855f7" }, { label: "G", desc: "Goals", color: "#ef4444" }, { label: "A", desc: "Assists", color: "#f59e0b" }, { label: "INV%", desc: "Involvement", color: "#22c55e" }].map(({ label, desc, color }) => (
                  <div key={label} style={{ background: t.cardBg, border: `1px solid ${color}33`, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 18, color, lineHeight: 1 }}>{label}</div>
                    <div style={{ fontSize: 10, color: t.textFaint, marginTop: 2 }}>{desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: t.cardBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
                {gaPlayers.map((p, i) => (
                  <div key={p.id} style={{ padding: "14px 16px", borderBottom: `1px solid ${t.rowBorder}`, background: i < 3 ? "#a855f708" : "transparent", borderLeft: i < 3 ? "3px solid #a855f7" : "3px solid transparent" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 28, textAlign: "center", fontSize: i < 3 ? 18 : 13, color: t.textMuted, fontFamily: "'Bebas Neue', cursive", flexShrink: 0 }}>{medals[i] || i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>{p.name}</div>
                        <div style={{ fontSize: 10, color: positionColors[p.position], fontWeight: 600, marginTop: 1 }}>{positionEmoji[p.position]} {p.position}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, color: "#a855f7", lineHeight: 1 }}>{p.ga}</div>
                        <div style={{ fontSize: 10, color: t.textFaint }}>G/A</div>
                      </div>
                    </div>
                    <div style={{ marginBottom: 10 }}><MiniBar value={p.ga} max={maxGA} color="#a855f7" t={t} /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                      <div style={{ background: "#ef444411", borderRadius: 8, padding: "6px 4px", textAlign: "center" }}><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 16, color: "#ef4444" }}>{p.goals}</div><div style={{ fontSize: 9, color: t.textMuted }}>GOALS</div></div>
                      <div style={{ background: "#f59e0b11", borderRadius: 8, padding: "6px 4px", textAlign: "center" }}><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 16, color: "#f59e0b" }}>{p.assists}</div><div style={{ fontSize: 9, color: t.textMuted }}>ASSISTS</div></div>
                      <div style={{ background: "#22c55e11", borderRadius: 8, padding: "6px 4px", textAlign: "center" }}><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 16, color: "#22c55e" }}>{p.involvement}%</div><div style={{ fontSize: 9, color: t.textMuted }}>INVOLV.</div></div>
                      <div style={{ background: "#38bdf811", borderRadius: 8, padding: "6px 4px", textAlign: "center" }}><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 16, color: "#38bdf8" }}>{p.ratio}</div><div style={{ fontSize: 9, color: t.textMuted }}>G/A RATIO</div></div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 11, color: t.textFaint, lineHeight: 1.6 }}>
                <span style={{ color: "#a855f7" }}>INV%</span> = % of all liga goals the player directly contributed to &nbsp;·&nbsp; <span style={{ color: "#38bdf8" }}>G/A Ratio</span> = goals per assist (∞ means scorer with no assists)
              </div>
            </div>
          );
        })()}

        {activeTab === "inv" && (() => {
          const tg = players.reduce((a, p) => a + p.goals, 0);
          const invPlayers = [...players].map((p) => ({ ...p, inv: tg > 0 ? Math.round(((p.goals + p.assists) / tg) * 100) : 0 })).filter((p) => p.inv > 0).sort((a, b) => b.inv - a.inv || b.goals - a.goals);
          const maxInv = Math.max(...invPlayers.map((p) => p.inv), 1);
          const medals = { 0: "🥇", 1: "🥈", 2: "🥉" };
          return (
            <div style={{ background: t.cardBg, borderRadius: 16, padding: 20, border: `1px solid ${t.border}` }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: 3, marginBottom: 6, color: "#22c55e" }}>📈 GOAL INVOLVEMENT</div>
              <div style={{ fontSize: 12, color: t.textFaint, marginBottom: 20 }}>% of all liga goals each player directly contributed to (goals + assists ÷ total goals)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {invPlayers.map((p, i) => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: i < 3 ? "#22c55e11" : "transparent", borderRadius: 10, borderLeft: i < 3 ? "3px solid #22c55e" : "3px solid transparent" }}>
                    <div style={{ width: 28, textAlign: "center", fontSize: i < 3 ? 18 : 13, color: t.textMuted, fontFamily: "'Bebas Neue', cursive" }}>{medals[i] || i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <div><span style={{ color: t.text, fontWeight: 600, fontSize: 14 }}>{p.name}</span><span style={{ fontSize: 10, color: positionColors[p.position], marginLeft: 8 }}>{positionEmoji[p.position]}</span></div>
                        <span style={{ color: "#22c55e", fontWeight: 800, fontFamily: "'Bebas Neue', cursive", fontSize: 20 }}>{p.inv}%</span>
                      </div>
                      <MiniBar value={p.inv} max={maxInv} color="#22c55e" t={t} />
                      <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: "#ef4444" }}>⚽ {p.goals}G</span>
                        <span style={{ fontSize: 11, color: "#f59e0b" }}>🎯 {p.assists}A</span>
                        <span style={{ fontSize: 11, color: t.textMuted }}>of {tg} total goals</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {activeTab === "ratio" && (() => {
          const ratioPlayers = [...players].filter((p) => p.goals > 0 || p.assists > 0).map((p) => ({ ...p, ratioNum: p.assists > 0 ? p.goals / p.assists : p.goals > 0 ? 999 : 0, ratioDisplay: p.assists > 0 ? (p.goals / p.assists).toFixed(2) : p.goals > 0 ? "∞" : "—" })).sort((a, b) => b.ratioNum - a.ratioNum || b.goals - a.goals);
          const medals = { 0: "🥇", 1: "🥈", 2: "🥉" };
          return (
            <div style={{ background: t.cardBg, borderRadius: 16, padding: 20, border: `1px solid ${t.border}` }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: 3, marginBottom: 6, color: "#38bdf8" }}>🧮 G/A RATIO</div>
              <div style={{ fontSize: 12, color: t.textFaint, marginBottom: 20 }}>Goals per assist — higher means more finisher, lower means more creator. ∞ = scorer with zero assists.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {ratioPlayers.map((p, i) => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: i < 3 ? "#38bdf811" : "transparent", borderRadius: 10, borderLeft: i < 3 ? "3px solid #38bdf8" : "3px solid transparent" }}>
                    <div style={{ width: 28, textAlign: "center", fontSize: i < 3 ? 18 : 13, color: t.textMuted, fontFamily: "'Bebas Neue', cursive" }}>{medals[i] || i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div><span style={{ color: t.text, fontWeight: 600, fontSize: 14 }}>{p.name}</span><span style={{ fontSize: 10, color: positionColors[p.position], marginLeft: 8 }}>{positionEmoji[p.position]}</span></div>
                        <span style={{ color: "#38bdf8", fontWeight: 800, fontFamily: "'Bebas Neue', cursive", fontSize: 22 }}>{p.ratioDisplay}</span>
                      </div>
                      <div style={{ display: "flex", gap: 16 }}>
                        <span style={{ fontSize: 11, color: "#ef4444" }}>⚽ {p.goals} goals</span>
                        <span style={{ fontSize: 11, color: "#f59e0b" }}>🎯 {p.assists} assists</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {activeTab === "cleansheets" && (
          <div style={{ background: t.cardBg, borderRadius: 16, padding: 20, border: `1px solid ${t.border}` }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: 3, marginBottom: 20, color: "#3b82f6" }}>🧤 CLEAN SHEETS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {keepers.map((p, i) => <LeaderRow key={p.id} rank={i + 1} name={p.name} value={p.clean_sheets} max={maxCS} color="#3b82f6" label="CS" t={t} />)}
            </div>
          </div>
        )}

        {activeTab === "squad" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input placeholder="🔍 Search..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} style={{ flex: 1, minWidth: 140, background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 10, padding: "10px 14px", color: t.text, fontSize: 13 }} />
              <select value={filterPos} onChange={(e) => setFilterPos(e.target.value)} style={{ background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 10, padding: "10px 12px", color: t.text, fontSize: 13, cursor: "pointer" }}>
                <option>All</option><option>Defender</option><option>Midfielder</option><option>Striker</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 10, padding: "10px 12px", color: t.text, fontSize: 13, cursor: "pointer" }}>
                <option value="goals">Goals</option><option value="assists">Assists</option><option value="clean_sheets">Clean Sheets</option>
              </select>
            </div>

            {isAdmin && (
              <>
                <button onClick={() => setShowAdd(!showAdd)} style={{ background: showAdd ? t.toggleBg : "linear-gradient(135deg, #1e3a8a, #3b82f6)", border: showAdd ? `1px solid ${t.toggleBorder}` : "none", borderRadius: 10, padding: "12px 20px", color: showAdd ? t.textDim : "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                  {showAdd ? "✕ Cancel" : "+ Add New Player"}
                </button>
                {showAdd && (
                  <div style={{ background: t.cardBg, border: `1px solid ${t.borderLight}`, borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 18, letterSpacing: 2, color: "#3b82f6" }}>NEW PLAYER</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {[["Name", "name", "text"], ["Goals", "goals", "number"], ["Assists", "assists", "number"], ["Clean Sheets", "clean_sheets", "number"]].map(([label, key, type]) => (
                        <div key={key}>
                          <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
                          <input type={type} value={addForm[key]} onChange={(e) => setAddForm({ ...addForm, [key]: e.target.value })} style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 8, padding: "9px 12px", color: t.text, fontSize: 13 }} />
                        </div>
                      ))}
                      <div style={{ gridColumn: "1/-1" }}>
                        <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Position</div>
                        <select value={addForm.position} onChange={(e) => setAddForm({ ...addForm, position: e.target.value })} style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 8, padding: "9px 12px", color: t.text, fontSize: 13 }}>
                          <option>Defender</option><option>Midfielder</option><option>Striker</option>
                        </select>
                      </div>
                    </div>
                    <button onClick={addPlayer} disabled={saving} style={{ background: "linear-gradient(135deg, #16a34a, #4ade80)", border: "none", borderRadius: 10, padding: 12, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14, opacity: saving ? 0.6 : 1 }}>
                      {saving ? "Adding..." : "✓ Add Player"}
                    </button>
                  </div>
                )}

                <div style={{ background: t.cardBg, border: `1px solid ${t.borderLight}`, borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 16, letterSpacing: 2, color: t.textDim }}>ADMIN TOOLS</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => setShowMotmAward(true)} style={{ background: "linear-gradient(135deg, #c2410c, #fb923c)", border: "none", borderRadius: 8, padding: "10px 14px", color: "#2a0f02", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>🏆 Award MOTM</button>
                    <button onClick={startNewWeek} disabled={saving} style={{ background: "linear-gradient(135deg, #ca8a04, #facc15)", border: "none", borderRadius: 8, padding: "10px 14px", color: "#1a1305", fontWeight: 700, cursor: "pointer", fontSize: 12, opacity: saving ? 0.6 : 1 }}>🌟 Start New Week</button>
                    <button onClick={() => setShowHistory(true)} style={{ background: t.toggleBg, border: `1px solid ${t.toggleBorder}`, borderRadius: 8, padding: "10px 14px", color: t.textDim, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>📜 Past Seasons</button>
                    <button onClick={() => setConfirmSeasonReset(true)} style={{ background: "transparent", border: "1px solid #ef4444", borderRadius: 8, padding: "10px 14px", color: "#ef4444", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>🔄 New Season</button>
                  </div>
                </div>
              </>
            )}

            <div style={{ background: t.cardBg, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "1fr 60px 44px 44px 44px 48px 48px" : "1fr 80px 44px 44px 44px", padding: "10px 14px", borderBottom: `1px solid ${t.border}`, fontSize: 10, color: t.textFaint, textTransform: "uppercase", letterSpacing: 1 }}>
                <span>Player</span><span>Pos</span><span style={{ textAlign: "center" }}>G</span><span style={{ textAlign: "center" }}>A</span><span style={{ textAlign: "center" }}>CS</span>{isAdmin && <span></span>}{isAdmin && <span></span>}
              </div>
              {filteredPlayers.map((p) => (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: isAdmin ? "1fr 60px 44px 44px 44px 48px 48px" : "1fr 80px 44px 44px 44px", padding: "11px 14px", borderBottom: `1px solid ${t.rowBorder}`, alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: t.text }}>{p.name}</span>
                  <span style={{ fontSize: 10, color: positionColors[p.position], fontWeight: 600 }}>{positionEmoji[p.position]}</span>
                  <span style={{ textAlign: "center", color: p.goals > 0 ? "#ef4444" : t.textGhost, fontWeight: 700 }}>{p.goals}</span>
                  <span style={{ textAlign: "center", color: p.assists > 0 ? "#f59e0b" : t.textGhost, fontWeight: 700 }}>{p.assists}</span>
                  <span style={{ textAlign: "center", color: p.clean_sheets > 0 ? "#3b82f6" : t.textGhost, fontWeight: 700 }}>{p.position === "Defender" ? p.clean_sheets : "—"}</span>
                  {isAdmin && (
                    <button onClick={() => { setEditPlayer(p.name); setEditForm({ ...p }); }} style={{ background: "rgba(59,130,246,0.15)", border: "none", borderRadius: 6, color: "#3b82f6", cursor: "pointer", padding: "5px 8px", fontSize: 11 }}>Edit</button>
                  )}
                  {isAdmin && (
                    <button onClick={() => setConfirmDelete(p)} style={{ background: "rgba(239,68,68,0.15)", border: "none", borderRadius: 6, color: "#ef4444", cursor: "pointer", padding: "5px 8px", fontSize: 11 }}>Del</button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 8, padding: 20, background: t.cardBg, borderRadius: 14, border: isAdmin ? "1px solid #22c55e" : `1px solid ${t.border}`, textAlign: "center" }}>
              {isAdmin ? (
                <div>
                  <div style={{ color: "#22c55e", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>🔓 Admin mode active</div>
                  <button onClick={handleLock} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>🔒 Lock</button>
                </div>
              ) : (
                <div>
                  <div style={{ color: t.textGhost, fontSize: 12, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Admin access</div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
                    <input type="password" placeholder="Enter PIN" value={pinInput} onChange={(e) => { setPinInput(e.target.value); setPinError(false); }} onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()} style={{ background: t.inputBg, border: pinError ? "1px solid #ef4444" : `1px solid ${t.borderLight}`, color: t.text, borderRadius: 8, padding: "10px 16px", fontSize: 16, width: 130, textAlign: "center" }} />
                    <button onClick={handlePinSubmit} style={{ background: "#6d28d9", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Unlock</button>
                  </div>
                  {pinError && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 10 }}>Wrong PIN. Try again.</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "fpl" && (() => {
          const leaderboard = [...fplTeams]
            .map((team) => ({ ...team, managerName: fplManagers.find((m) => m.id === team.manager_id)?.name || "Unknown" }))
            .sort((a, b) => (b.total_points || 0) - (a.total_points || 0));
          const maxPts = Math.max(...leaderboard.map((t2) => t2.total_points || 0), 1);
          const draftRemaining = fplDraftBank;
          const pickablePlayers = [...players]
            .filter((p) => p.name.toLowerCase().includes(fplSearchQ.toLowerCase()))
            .sort((a, b) => priceOf(b) - priceOf(a));
          // "Squad value" = bank + what you'd get selling everyone right now (sell-on fee applied
          // to any gains) — the same number real FPL calls Team Value.
          function teamSellValue(team) {
            const bank = getTeamBank(team);
            const purchasePrices = getTeamPurchasePrices(team);
            const held = (team.player_ids || []).reduce((sum, id) => {
              const p = players.find((pl) => pl.id === id);
              if (!p) return sum;
              const pp = purchasePrices[id];
              return sum + (pp != null ? sellValueOf(pp, priceOf(p)) : priceOf(p));
            }, 0);
            return bank + held;
          }
          const myTeamBank = fplTeam ? getTeamBank(fplTeam) : FPL_BUDGET;
          // Over budget can now only really happen if the admin lowers FPL_BUDGET below what's
          // already committed — kept players are locked in at their purchase price, not live price.
          const myTeamOverBudget = !!fplTeam && myTeamBank < 0;
          // Squads saved before substitutes existed only have the old 4 starters — nudge them to
          // add the 2 new sub slots rather than blocking them outright.
          const myTeamIncomplete = !!fplTeam && !myTeamOverBudget && (fplTeam.player_ids || []).length < FPL_TOTAL_PICKS;
          const locked = isFplLocked(now);
          // Squads saved under an older, higher budget (before a cut) that are still over the
          // current one — admin can clear these off the leaderboard instead of waiting on the manager.
          const overBudgetTeams = leaderboard
            .map((team) => ({ ...team, value: -getTeamBank(team) + FPL_BUDGET })) // = what they've actually got committed
            .filter((team) => getTeamBank(team) < 0);

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "linear-gradient(135deg, #16a34a11, #0f0f23)", border: "1px solid #16a34a33", borderRadius: 16, padding: "12px 16px", fontSize: 12, color: t.textDim, lineHeight: 1.5 }}>
                🎮 Build a squad of {FPL_SQUAD_SIZE} starters + {FPL_SUB_SIZE} subs within a ₦{FPL_BUDGET}m budget (plus a free static goalkeeper). Subs cost the same as starters but only earn ⅓ points. Prices are set by the admin and drift a little each week — up OR down — based on that week's performance. Selling a player who's risen in price only banks half the gain (real FPL-style sell-on fee); a player who's dropped just sells at the lower price. Pick a captain for 2× points. Your squad earns points automatically whenever stats are updated. Squads lock at 5pm and reopen at 8pm on gamedays (Sun, Mon, Wed, Fri, Sat).
              </div>

              {locked && (
                <div style={{ background: "linear-gradient(135deg, #ef444422, #0f0f23)", border: "1px solid #ef444466", borderRadius: 16, padding: "14px 16px", fontSize: 13, color: "#ef4444", fontWeight: 600, textAlign: "center" }}>
                  🔒 Squads are locked for gameday — no building or editing until 8:00pm.
                </div>
              )}

              {isAdmin && (
                <div style={{ background: t.cardBg, border: "1px solid #f59e0b55", borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 16, letterSpacing: 2, color: "#f59e0b" }}>⚙️ ADMIN · PLAYER VALUES</div>
                  <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.5 }}>This is each player's current price, right now — set it to whatever's fair. It stays exactly what you set until you either change it again or hit "Start New Week", which nudges every player up to ₦2m up for a strong week or ₦1m down for a totally quiet one, based on that week's performance only. Clear the field and save to go back to the default ₦4m.</div>
                  <div style={{ maxHeight: 340, overflowY: "auto", border: `1px solid ${t.border}`, borderRadius: 12 }}>
                    {[...players].sort((a, b) => priceOf(b) - priceOf(a)).map((p) => {
                      const hasCustomBase = p.base_price != null;
                      const editing = priceEditId === p.id;
                      return (
                        <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: `1px solid ${t.rowBorder}`, gap: 8 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: 13, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                            <div style={{ fontSize: 10, color: t.textFaint }}>{positionEmoji[p.position]} {p.position}{hasCustomBase ? ` · set by admin` : ""}</div>
                          </div>
                          {editing ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <input type="number" step="0.5" min="0" autoFocus value={priceEditValue} onChange={(e) => setPriceEditValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveBasePrice(p)} placeholder="4 (default)" style={{ width: 80, background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 6, padding: "6px 8px", color: t.text, fontSize: 13 }} />
                              <button onClick={() => saveBasePrice(p)} disabled={saving} style={{ background: "#16a34a22", border: "1px solid #16a34a", borderRadius: 6, color: "#22c55e", cursor: "pointer", padding: "5px 8px", fontSize: 11, fontWeight: 700 }}>✓</button>
                              <button onClick={() => setPriceEditId(null)} style={{ background: "transparent", border: `1px solid ${t.borderLight}`, borderRadius: 6, color: t.textMuted, cursor: "pointer", padding: "5px 8px", fontSize: 11 }}>✕</button>
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 15, color: "#22c55e" }}>₦{priceOf(p)}m{hasCustomBase ? " ⚙️" : ""}</div>
                              <button onClick={() => startPriceEdit(p)} style={{ background: "rgba(59,130,246,0.15)", border: "none", borderRadius: 6, color: "#3b82f6", cursor: "pointer", padding: "5px 8px", fontSize: 11 }}>Edit</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {isAdmin && overBudgetTeams.length > 0 && (
                <div style={{ background: t.cardBg, border: "1px solid #ef444466", borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 16, letterSpacing: 2, color: "#ef4444" }}>⚠️ SQUADS OVER ₦{FPL_BUDGET}M BUDGET</div>
                  <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.5 }}>Saved under an older, higher budget. Managers are blocked from doing anything else until they fix these themselves — or you can remove them from the leaderboard right now.</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {overBudgetTeams.map((team) => (
                      <div key={team.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 14px", background: "#ef444411", border: "1px solid #ef444433", borderRadius: 10 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: t.text }}>{team.managerName}</div>
                          <div style={{ fontSize: 11, color: "#ef4444" }}>₦{team.value.toFixed(1)}m — ₦{(team.value - FPL_BUDGET).toFixed(1)}m over</div>
                        </div>
                        <button onClick={() => setConfirmDeleteTeam(team)} style={{ background: "linear-gradient(135deg, #7f1d1d, #ef4444)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!fplManager ? (
                <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 20, letterSpacing: 2, color: "#22c55e" }}>SIGN IN TO PLAY</div>
                  <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.5 }}>Enter your name and a PIN — new names create a team automatically, existing names just sign back in.</div>
                  <input placeholder="Your name" value={fplSignInName} onChange={(e) => { setFplSignInName(e.target.value); setFplSignInError(""); }} style={{ background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 8, padding: "12px 14px", color: t.text, fontSize: 14 }} />
                  <input type="password" placeholder="4-digit PIN" value={fplSignInPin} onChange={(e) => { setFplSignInPin(e.target.value); setFplSignInError(""); }} onKeyDown={(e) => e.key === "Enter" && handleFplAuth()} style={{ background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 8, padding: "12px 14px", color: t.text, fontSize: 14 }} />
                  {fplSignInError && <div style={{ color: "#ef4444", fontSize: 12 }}>{fplSignInError}</div>}
                  <button onClick={handleFplAuth} disabled={fplSaving || !fplSignInName.trim() || !fplSignInPin.trim()} style={{ background: "linear-gradient(135deg, #16a34a, #4ade80)", border: "none", borderRadius: 10, padding: 13, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14, opacity: fplSaving ? 0.6 : 1 }}>
                    {fplSaving ? "Signing in..." : "Sign In / Create Team"}
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Manager</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: t.text }}>{fplManager.name}</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Points</div>
                      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, color: "#22c55e" }}>{fplTeam?.total_points || 0}</div>
                    </div>
                    <button onClick={handleFplSignOut} style={{ background: t.toggleBg, border: `1px solid ${t.toggleBorder}`, borderRadius: 8, padding: "8px 14px", color: t.textDim, cursor: "pointer", fontSize: 12 }}>Sign Out</button>
                  </div>

                  {!fplEditing ? (
                    myTeamOverBudget ? (
                      <div style={{ background: t.cardBg, border: "2px solid #ef4444", borderRadius: 16, padding: 18 }}>
                        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 16, letterSpacing: 2, color: "#ef4444", marginBottom: 10 }}>⚠️ SQUAD OVER BUDGET</div>
                        <div style={{ fontSize: 13, color: t.textDim, lineHeight: 1.6, marginBottom: 14 }}>
                          The budget is now ₦{FPL_BUDGET}m, but your squad has ₦{Math.abs(myTeamBank).toFixed(1)}m more committed than that. You won't be able to do anything else here until you edit your team and bring it back within budget.
                        </div>
                        <Pitch>
                          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                            <PitchPlayerCard player={FPL_GOALKEEPER} price={null} isCaptain={false} />
                          </div>
                          {["Defender", "Midfielder", "Striker"].map((pos) => {
                            const rowPlayers = (fplTeam.player_ids || []).filter((id) => !(fplTeam.sub_ids || []).includes(id)).map((id) => players.find((pl) => pl.id === id)).filter((p) => p && p.position === pos);
                            if (!rowPlayers.length) return null;
                            return (
                              <div key={pos} style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                                {rowPlayers.map((p) => (
                                  <PitchPlayerCard key={p.id} player={p} price={priceOf(p)} points={(fplTeam.player_points || {})[p.id] || 0} isCaptain={fplTeam.captain_id === p.id} />
                                ))}
                              </div>
                            );
                          })}
                          {(fplTeam.sub_ids || []).length > 0 && (
                            <div>
                              <div style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Substitutes</div>
                              <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                                {(fplTeam.sub_ids || []).map((id) => players.find((pl) => pl.id === id)).filter(Boolean).map((p) => (
                                  <PitchPlayerCard key={p.id} player={p} price={priceOf(p)} points={(fplTeam.player_points || {})[p.id] || 0} isCaptain={fplTeam.captain_id === p.id} isSub />
                                ))}
                              </div>
                            </div>
                          )}
                        </Pitch>
                        {locked ? (
                          <div style={{ marginTop: 14, fontSize: 12, color: "#ef4444", textAlign: "center" }}>🔒 Locked until 8:00pm — you'll be able to fix this once squads reopen.</div>
                        ) : (
                          <button onClick={startFplBuild} style={{ marginTop: 14, width: "100%", background: "linear-gradient(135deg, #ef4444, #f87171)", border: "none", borderRadius: 10, padding: 13, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>✏️ Fix My Squad</button>
                        )}
                      </div>
                    ) : fplTeam ? (
                      <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 16, letterSpacing: 2, color: t.textDim }}>MY SQUAD</div>
                          <button onClick={startFplBuild} disabled={locked} style={{ background: t.toggleBg, border: `1px solid ${t.toggleBorder}`, borderRadius: 8, padding: "7px 12px", color: t.textDim, cursor: locked ? "not-allowed" : "pointer", fontSize: 12, opacity: locked ? 0.5 : 1 }}>{locked ? "🔒 Locked" : "✏️ Edit Team"}</button>
                        </div>
                        {myTeamIncomplete && (
                          <div style={{ background: "#f59e0b18", border: "1px solid #f59e0b55", borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "#f59e0b", marginBottom: 14 }}>
                            🪑 New: every squad now gets {FPL_SUB_SIZE} substitutes (same price, ⅓ points). Edit your team to add yours.
                          </div>
                        )}
                        <Pitch>
                          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                            <PitchPlayerCard player={FPL_GOALKEEPER} price={null} isCaptain={false} />
                          </div>
                          {["Defender", "Midfielder", "Striker"].map((pos) => {
                            const rowPlayers = (fplTeam.player_ids || []).filter((id) => !(fplTeam.sub_ids || []).includes(id)).map((id) => players.find((pl) => pl.id === id)).filter((p) => p && p.position === pos);
                            if (!rowPlayers.length) return null;
                            return (
                              <div key={pos} style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                                {rowPlayers.map((p) => (
                                  <PitchPlayerCard key={p.id} player={p} price={priceOf(p)} points={(fplTeam.player_points || {})[p.id] || 0} isCaptain={fplTeam.captain_id === p.id} />
                                ))}
                              </div>
                            );
                          })}
                          {(fplTeam.sub_ids || []).length > 0 && (
                            <div>
                              <div style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Substitutes</div>
                              <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                                {(fplTeam.sub_ids || []).map((id) => players.find((pl) => pl.id === id)).filter(Boolean).map((p) => (
                                  <PitchPlayerCard key={p.id} player={p} price={priceOf(p)} points={(fplTeam.player_points || {})[p.id] || 0} isCaptain={fplTeam.captain_id === p.id} isSub />
                                ))}
                              </div>
                            </div>
                          )}
                        </Pitch>
                        {(fplTeam.player_ids || []).some((id) => !players.find((pl) => pl.id === id)) && (
                          <div style={{ fontSize: 11, color: t.textGhost, marginTop: 10 }}>Some picked players were removed from the liga.</div>
                        )}
                        <div style={{ fontSize: 11, color: t.textFaint, marginTop: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                          Squad value: ₦{teamSellValue(fplTeam).toFixed(1)}m · Bank: ₦{myTeamBank.toFixed(1)}m
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: 22, textAlign: "center" }}>
                        <div style={{ fontSize: 26, marginBottom: 8 }}>⚽</div>
                        <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 14 }}>You haven't picked a squad yet.</div>
                        <button onClick={startFplBuild} disabled={locked} style={{ background: locked ? t.toggleBg : "linear-gradient(135deg, #16a34a, #4ade80)", border: locked ? `1px solid ${t.toggleBorder}` : "none", borderRadius: 10, padding: "12px 20px", color: locked ? t.textDim : "#fff", fontWeight: 700, cursor: locked ? "not-allowed" : "pointer", fontSize: 14, opacity: locked ? 0.6 : 1 }}>{locked ? "🔒 Locked until 8pm" : "Build My Squad"}</button>
                      </div>
                    )
                  ) : (
                    <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
                      <div style={{ display: "flex", alignItems: "stretch", justifyContent: "center", gap: 16 }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ background: "#16a34a22", border: "1px solid #16a34a55", borderRadius: 10, padding: "8px 18px", fontFamily: "'Bebas Neue', cursive", fontSize: 18, color: "#22c55e" }}>{fplDraftPicks.length} / {FPL_TOTAL_PICKS}</div>
                          <div style={{ fontSize: 10, color: t.textMuted, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>Players selected</div>
                        </div>
                        <div style={{ width: 1, background: t.border }} />
                        <div style={{ textAlign: "center" }}>
                          <div style={{ background: "#94a3b822", border: "1px solid #94a3b855", borderRadius: 10, padding: "8px 18px", fontFamily: "'Bebas Neue', cursive", fontSize: 18, color: "#cbd5e1" }}>{fplDraftSubs.length} / {FPL_SUB_SIZE}</div>
                          <div style={{ fontSize: 10, color: t.textMuted, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>Benched</div>
                        </div>
                        <div style={{ width: 1, background: t.border }} />
                        <div style={{ textAlign: "center" }}>
                          <div style={{ background: draftRemaining < 0 ? "#ef444422" : "#16a34a22", border: `1px solid ${draftRemaining < 0 ? "#ef4444" : "#16a34a"}55`, borderRadius: 10, padding: "8px 18px", fontFamily: "'Bebas Neue', cursive", fontSize: 18, color: draftRemaining < 0 ? "#ef4444" : "#22c55e" }}>₦{draftRemaining.toFixed(1)}m</div>
                          <div style={{ fontSize: 10, color: t.textMuted, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>Bank</div>
                        </div>
                      </div>

                      <Pitch>
                        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                          <PitchPlayerCard player={FPL_GOALKEEPER} price={null} isCaptain={false} />
                        </div>
                        {["Defender", "Midfielder", "Striker"].map((pos) => {
                          const rowPlayers = fplDraftPicks.filter((id) => !fplDraftSubs.includes(id)).map((id) => players.find((pl) => pl.id === id)).filter((p) => p && p.position === pos);
                          if (!rowPlayers.length) return null;
                          return (
                            <div key={pos} style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                              {rowPlayers.map((p) => (
                                <PitchPlayerCard key={p.id} player={p} price={priceOf(p)} isCaptain={fplDraftCaptain === p.id} onRemove={() => toggleFplPick(p.id)} onMakeCaptain={() => setFplDraftCaptain(p.id)} onToggleSub={() => toggleSubStatus(p.id)} />
                              ))}
                            </div>
                          );
                        })}
                        {fplDraftSubs.length > 0 && (
                          <div>
                            <div style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Substitutes</div>
                            <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                              {fplDraftSubs.map((id) => players.find((pl) => pl.id === id)).filter(Boolean).map((p) => (
                                <PitchPlayerCard key={p.id} player={p} price={priceOf(p)} isCaptain={false} isSub onRemove={() => toggleFplPick(p.id)} onToggleSub={() => toggleSubStatus(p.id)} />
                              ))}
                            </div>
                          </div>
                        )}
                      </Pitch>
                      <div style={{ fontSize: 10, color: t.textFaint, textAlign: "center" }}>
                        {fplDraftPicks.length > 0 ? `Tap a shirt to make them captain (2× points) · Bench/Start to set your ${FPL_SUB_SIZE} subs · ✕ to sell` : "Tap players below to add them to your pitch."}
                      </div>

                      <input placeholder="🔍 Search players..." value={fplSearchQ} onChange={(e) => setFplSearchQ(e.target.value)} style={{ background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 10, padding: "10px 14px", color: t.text, fontSize: 13 }} />

                      <div style={{ maxHeight: 340, overflowY: "auto", border: `1px solid ${t.border}`, borderRadius: 12 }}>
                        {pickablePlayers.map((p) => {
                          const picked = fplDraftPicks.includes(p.id);
                          const price = priceOf(p);
                          const disabled = !picked && (fplDraftPicks.length >= FPL_TOTAL_PICKS || draftRemaining - price < 0);
                          return (
                            <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: `1px solid ${t.rowBorder}`, opacity: disabled ? 0.4 : 1 }}>
                              <div style={{ flex: 1 }}>
                                <span style={{ fontWeight: 600, fontSize: 13, color: t.text }}>{p.name}</span>
                                <span style={{ fontSize: 10, color: positionColors[p.position], marginLeft: 8 }}>{positionEmoji[p.position]} {p.position}</span>
                              </div>
                              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 15, color: "#22c55e", marginRight: 10 }}>₦{price}m</div>
                              <button onClick={() => toggleFplPick(p.id)} disabled={disabled} style={{ background: picked ? "#ef444422" : "#22c55e22", border: `1px solid ${picked ? "#ef4444" : "#22c55e"}`, borderRadius: 8, color: picked ? "#ef4444" : "#22c55e", cursor: disabled ? "not-allowed" : "pointer", padding: "5px 10px", fontSize: 12, fontWeight: 700 }}>
                                {picked ? "✕" : "+"}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {(() => {
                        const incomplete = fplDraftPicks.length !== FPL_TOTAL_PICKS;
                        const subsIncomplete = !incomplete && fplDraftSubs.length !== FPL_SUB_SIZE;
                        const overBudget = draftRemaining < 0;
                        const blocked = fplSaving || incomplete || subsIncomplete || overBudget || locked;
                        let label = "💾 Save Team";
                        if (fplSaving) label = "Saving...";
                        else if (locked) label = "🔒 Locked until 8pm";
                        else if (incomplete) label = `Pick ${FPL_TOTAL_PICKS - fplDraftPicks.length} more`;
                        else if (subsIncomplete) label = `Bench ${FPL_SUB_SIZE - fplDraftSubs.length} more as sub`;
                        else if (overBudget) label = `Over budget by ₦${Math.abs(draftRemaining).toFixed(1)}m`;
                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {locked && (
                              <div style={{ fontSize: 11, color: "#ef4444", textAlign: "center" }}>Squads are locked for gameday — you can't save until 8:00pm. Feel free to keep planning, just Cancel for now.</div>
                            )}
                            {subsIncomplete && !locked && (
                              <div style={{ fontSize: 11, color: "#f59e0b", textAlign: "center" }}>Tap "↓ Bench" on {FPL_SUB_SIZE - fplDraftSubs.length} more player{FPL_SUB_SIZE - fplDraftSubs.length === 1 ? "" : "s"} to set your subs.</div>
                            )}
                            {overBudget && !incomplete && !locked && (
                              <div style={{ fontSize: 11, color: "#ef4444", textAlign: "center" }}>You're over budget — sell a player to save.</div>
                            )}
                            <div style={{ display: "flex", gap: 10 }}>
                              <button onClick={() => setFplEditing(false)} style={{ flex: 1, background: t.toggleBg, border: "none", borderRadius: 10, padding: 13, color: t.textMuted, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                              <button onClick={saveFplTeam} disabled={blocked} style={{ flex: 2, background: "linear-gradient(135deg, #16a34a, #4ade80)", border: "none", borderRadius: 10, padding: 13, color: "#fff", cursor: blocked ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 15, opacity: blocked ? 0.6 : 1 }}>
                                {label}
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </>
              )}

              {(() => {
                // Most-picked player, tallied live from every saved squad right now.
                const statVisible = isMostSelectedVisible(now);
                // Use a Map (not a plain object) so player ids keep their original type —
                // object keys get stringified, which broke the players.find(...) lookup below
                // for numeric ids and made this look like "no squads saved" even with real picks.
                const tally = new Map();
                fplTeams.forEach((team) => { (team.player_ids || []).forEach((id) => { tally.set(id, (tally.get(id) || 0) + 1); }); });
                const entries = [...tally.entries()].sort((a, b) => b[1] - a[1]);
                const topCount = entries.length ? entries[0][1] : 0;
                const topPicks = entries.filter(([, c]) => c === topCount).map(([id]) => players.find((p) => p.id === id)).filter(Boolean);
                const totalManagers = fplTeams.length;
                const pct = totalManagers ? Math.round((topCount / totalManagers) * 100) : 0;
                let pickedBadge;
                if (!statVisible) {
                  pickedBadge = (
                    <div style={{ background: t.toggleBg, borderRadius: 10, padding: "6px 12px", fontSize: 11, color: t.textFaint, whiteSpace: "nowrap" }}>
                      🌙 Most Picked — back at 7am
                    </div>
                  );
                } else if (topPicks.length === 0) {
                  pickedBadge = (
                    <div style={{ background: t.toggleBg, borderRadius: 10, padding: "6px 12px", fontSize: 11, color: t.textFaint, whiteSpace: "nowrap" }}>
                      🎯 Most Picked — no squads saved yet
                    </div>
                  );
                } else {
                  pickedBadge = (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-end" }}>
                      {topPicks.map((p) => (
                        <div key={p.id} style={{ background: "#facc1522", border: "1px solid #facc1555", borderRadius: 10, padding: "6px 12px", fontSize: 11, color: t.textDim, whiteSpace: "nowrap" }}>
                          <span style={{ color: "#facc15", fontWeight: 700 }}>🎯 Most Picked:</span> {p.name} <span style={{ color: "#facc15", fontWeight: 700 }}>{pct}%</span>
                        </div>
                      ))}
                    </div>
                  );
                }

                // Most-captained player, same live tally but keyed off captain_id.
                const capTally = new Map();
                fplTeams.forEach((team) => { if (team.captain_id != null) capTally.set(team.captain_id, (capTally.get(team.captain_id) || 0) + 1); });
                const capEntries = [...capTally.entries()].sort((a, b) => b[1] - a[1]);
                const topCapCount = capEntries.length ? capEntries[0][1] : 0;
                const topCaptains = capEntries.filter(([, c]) => c === topCapCount).map(([id]) => players.find((p) => p.id === id)).filter(Boolean);
                const capPct = totalManagers ? Math.round((topCapCount / totalManagers) * 100) : 0;
                let captainBadge;
                if (!statVisible) {
                  captainBadge = (
                    <div style={{ background: t.toggleBg, borderRadius: 10, padding: "6px 12px", fontSize: 11, color: t.textFaint, whiteSpace: "nowrap" }}>
                      🌙 Most Captained — back at 7am
                    </div>
                  );
                } else if (topCaptains.length === 0) {
                  captainBadge = (
                    <div style={{ background: t.toggleBg, borderRadius: 10, padding: "6px 12px", fontSize: 11, color: t.textFaint, whiteSpace: "nowrap" }}>
                      🅲 Most Captained — no captains set yet
                    </div>
                  );
                } else {
                  captainBadge = (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "flex-end" }}>
                      {topCaptains.map((p) => (
                        <div key={p.id} style={{ background: "#3b82f622", border: "1px solid #3b82f655", borderRadius: 10, padding: "6px 12px", fontSize: 11, color: t.textDim, whiteSpace: "nowrap" }}>
                          <span style={{ color: "#3b82f6", fontWeight: 700 }}>🅲 Most Captained:</span> {p.name} <span style={{ color: "#3b82f6", fontWeight: 700 }}>{capPct}%</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return (
                  <div style={{ background: t.cardBg, borderRadius: 16, padding: 20, border: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 4 }}>
                      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 20, letterSpacing: 3, color: "#22c55e" }}>🏆 FPL LEADERBOARD</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                        {pickedBadge}
                        {captainBadge}
                      </div>
                    </div>
                    {leaderboard.length > 0 && <div style={{ fontSize: 10, color: t.textFaint, marginBottom: 12 }}>Tap a manager to see their squad</div>}
                    {leaderboard.length === 0 ? (
                      <div style={{ fontSize: 12, color: t.textMuted }}>No managers yet — be the first to build a squad.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {leaderboard.map((team, i) => (
                          <LeaderRow key={team.id} rank={i + 1} name={team.managerName} value={team.total_points || 0} max={maxPts} color="#22c55e" label="pts" t={t} onClick={() => setViewingTeam(team)} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })()}
      </div>

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: t.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: t.cardBg, border: "1px solid #ef444455", borderRadius: 20, padding: 28, width: "100%", maxWidth: 360, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 2, color: "#ef4444", marginBottom: 8 }}>DELETE PLAYER</div>
            <div style={{ color: t.textDim, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Are you sure you want to remove <span style={{ color: t.text, fontWeight: 700 }}>{confirmDelete.name}</span> from the liga?<br />
              <span style={{ color: "#ef4444", fontSize: 12 }}>This cannot be undone.</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, background: t.toggleBg, border: "none", borderRadius: 10, padding: 13, color: t.textMuted, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={() => deletePlayer(confirmDelete)} disabled={saving} style={{ flex: 1, background: "linear-gradient(135deg, #7f1d1d, #ef4444)", border: "none", borderRadius: 10, padding: 13, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14, opacity: saving ? 0.6 : 1 }}>
                {saving ? "Deleting..." : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteTeam && (
        <div style={{ position: "fixed", inset: 0, background: t.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: t.cardBg, border: "1px solid #ef444455", borderRadius: 20, padding: 28, width: "100%", maxWidth: 360, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 2, color: "#ef4444", marginBottom: 8 }}>REMOVE SQUAD</div>
            <div style={{ color: t.textDim, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Remove <span style={{ color: t.text, fontWeight: 700 }}>{confirmDeleteTeam.managerName}</span>'s squad from the leaderboard? It was saved at ₦{confirmDeleteTeam.value.toFixed(1)}m, over the current ₦{FPL_BUDGET}m budget.<br />
              <span style={{ color: "#ef4444", fontSize: 12 }}>They'll need to sign in and build a new squad. This cannot be undone.</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmDeleteTeam(null)} style={{ flex: 1, background: t.toggleBg, border: "none", borderRadius: 10, padding: 13, color: t.textMuted, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={() => deleteFplTeam(confirmDeleteTeam)} disabled={saving} style={{ flex: 1, background: "linear-gradient(135deg, #7f1d1d, #ef4444)", border: "none", borderRadius: 10, padding: 13, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14, opacity: saving ? 0.6 : 1 }}>
                {saving ? "Removing..." : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editPlayer && (
        <div style={{ position: "fixed", inset: 0, background: t.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: t.cardBg, border: `1px solid ${t.borderLight}`, borderRadius: 20, padding: 28, width: "100%", maxWidth: 400 }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 2, marginBottom: 20, color: "#3b82f6" }}>EDIT · {editPlayer}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["Goals", "goals"], ["Assists", "assists"]].map(([label, key]) => (
                <div key={key}>
                  <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
                  <input type="number" value={editForm[key]} onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })} style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 8, padding: "12px 14px", color: t.text, fontSize: 20, fontWeight: 700 }} />
                </div>
              ))}
              {editForm.position === "Defender" && (
                <div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Clean Sheets</div>
                  <input type="number" value={editForm.clean_sheets} onChange={(e) => setEditForm({ ...editForm, clean_sheets: e.target.value })} style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 8, padding: "12px 14px", color: t.text, fontSize: 20, fontWeight: 700 }} />
                </div>
              )}
              <div>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Position</div>
                <select value={editForm.position} onChange={(e) => setEditForm({ ...editForm, position: e.target.value })} style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 8, padding: "12px 14px", color: t.text, fontSize: 14 }}>
                  <option>Defender</option><option>Midfielder</option><option>Striker</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setEditPlayer(null)} style={{ flex: 1, background: t.toggleBg, border: "none", borderRadius: 10, padding: 13, color: t.textMuted, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={saveEdit} disabled={saving} style={{ flex: 2, background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", border: "none", borderRadius: 10, padding: 13, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 15, opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmSeasonReset && (
        <div style={{ position: "fixed", inset: 0, background: t.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: t.cardBg, border: "1px solid #ef444455", borderRadius: 20, padding: 28, width: "100%", maxWidth: 380, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔄</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 2, color: "#ef4444", marginBottom: 8 }}>START NEW SEASON</div>
            <div style={{ color: t.textDim, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              This archives everyone's current Goals, Assists and Clean Sheets to <span style={{ color: t.text, fontWeight: 700 }}>Past Seasons</span>, then resets every player back to zero.
              <br /><span style={{ color: "#ef4444", fontSize: 12 }}>Stats reset cannot be undone — but the archive is saved.</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmSeasonReset(false)} style={{ flex: 1, background: t.toggleBg, border: "none", borderRadius: 10, padding: 13, color: t.textMuted, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={startNewSeason} disabled={saving} style={{ flex: 1, background: "linear-gradient(135deg, #7f1d1d, #ef4444)", border: "none", borderRadius: 10, padding: 13, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14, opacity: saving ? 0.6 : 1 }}>
                {saving ? "Starting..." : "Yes, New Season"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div style={{ position: "fixed", inset: 0, background: t.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: t.cardBg, border: `1px solid ${t.borderLight}`, borderRadius: 20, padding: 24, width: "100%", maxWidth: 440, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 2, marginBottom: 16, color: t.textDim }}>📜 PAST SEASONS</div>
            {seasonArchive.length === 0 ? (
              <div style={{ color: t.textMuted, fontSize: 13, lineHeight: 1.6 }}>No past seasons archived yet. Starting a new season will save the current one here first.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {seasonArchive.map((s, i) => {
                  const seasonGoals = s.players.reduce((a, p) => a + p.goals, 0);
                  const seasonTop = [...s.players].sort((a, b) => b.goals - a.goals)[0];
                  return (
                    <div key={i} style={{ background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 12, padding: "12px 16px" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>{s.players.length} players · {seasonGoals} goals</div>
                      {seasonTop && seasonTop.goals > 0 && (
                        <div style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}>👑 Top scorer: {seasonTop.name} ({seasonTop.goals})</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <button onClick={() => setShowHistory(false)} style={{ marginTop: 18, width: "100%", background: t.toggleBg, border: `1px solid ${t.toggleBorder}`, borderRadius: 10, padding: 12, color: t.textDim, cursor: "pointer", fontWeight: 600 }}>Close</button>
          </div>
        </div>
      )}

      {showMotmAward && (
        <div style={{ position: "fixed", inset: 0, background: t.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: t.cardBg, border: `1px solid ${t.borderLight}`, borderRadius: 20, padding: 28, width: "100%", maxWidth: 400 }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 2, marginBottom: 20, color: "#fb923c" }}>🏆 AWARD MAN OF THE MATCH</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Player</div>
                <select value={motmForm.name} onChange={(e) => setMotmForm({ ...motmForm, name: e.target.value })} style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 8, padding: "12px 14px", color: t.text, fontSize: 15 }}>
                  <option value="">Select a player…</option>
                  {[...players].sort((a, b) => a.name.localeCompare(b.name)).map((p) => (
                    <option key={p.id} value={p.name}>{p.name} ({p.position})</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Note (optional)</div>
                <input type="text" placeholder="e.g. Hat-trick vs Tuesday's game" value={motmForm.note} onChange={(e) => setMotmForm({ ...motmForm, note: e.target.value })} style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 8, padding: "12px 14px", color: t.text, fontSize: 14 }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => { setShowMotmAward(false); setMotmForm({ name: "", note: "" }); }} style={{ flex: 1, background: t.toggleBg, border: "none", borderRadius: 10, padding: 13, color: t.textMuted, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={awardMotm} disabled={saving || !motmForm.name} style={{ flex: 2, background: "linear-gradient(135deg, #c2410c, #fb923c)", border: "none", borderRadius: 10, padding: 13, color: "#2a0f02", cursor: "pointer", fontWeight: 700, fontSize: 15, opacity: saving || !motmForm.name ? 0.6 : 1 }}>
                {saving ? "Awarding..." : "🏆 Award"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showMotmHistory && (() => {
        const tallyMap = {};
        motmHistory.forEach((m) => {
          if (!tallyMap[m.name]) tallyMap[m.name] = { name: m.name, position: m.position, count: 0 };
          tallyMap[m.name].count += 1;
        });
        const tally = Object.values(tallyMap).sort((a, b) => b.count - a.count);
        const maxWins = Math.max(...tally.map((x) => x.count), 1);
        return (
          <div style={{ position: "fixed", inset: 0, background: t.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
            <div style={{ background: t.cardBg, border: `1px solid ${t.borderLight}`, borderRadius: 20, padding: 24, width: "100%", maxWidth: 440, maxHeight: "80vh", overflowY: "auto" }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 2, marginBottom: 16, color: "#fb923c" }}>🏆 MOTM HISTORY</div>
              {motmHistory.length === 0 ? (
                <div style={{ color: t.textMuted, fontSize: 13, lineHeight: 1.6 }}>No Man of the Match awards yet.</div>
              ) : (
                <>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 14, letterSpacing: 2, color: t.textDim, marginBottom: 8 }}>MOST WINS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 22 }}>
                    {tally.map((p, i) => (
                      <LeaderRow key={p.name} rank={i + 1} name={p.name} value={p.count} max={maxWins} color="#fb923c" label={p.count === 1 ? "win" : "wins"} t={t} />
                    ))}
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 14, letterSpacing: 2, color: t.textDim, marginBottom: 8 }}>RECENT AWARDS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {motmHistory.map((m, i) => (
                      <div key={i} style={{ background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 12, padding: "12px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>{m.name} <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>{m.position}</span></div>
                          <div style={{ fontSize: 11, color: t.textFaint }}>{new Date(m.awarded_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                        </div>
                        {m.note && <div style={{ fontSize: 12, color: t.textMuted, fontStyle: "italic", marginTop: 4 }}>"{m.note}"</div>}
                      </div>
                    ))}
                  </div>
                </>
              )}
              <button onClick={() => setShowMotmHistory(false)} style={{ marginTop: 18, width: "100%", background: t.toggleBg, border: `1px solid ${t.toggleBorder}`, borderRadius: 10, padding: 12, color: t.textDim, cursor: "pointer", fontWeight: 600 }}>Close</button>
            </div>
          </div>
        );
      })()}

      {viewingTeam && (() => {
        const managerName = fplManagers.find((m) => m.id === viewingTeam.manager_id)?.name || "Unknown";
        const viewingPurchasePrices = getTeamPurchasePrices(viewingTeam);
        const squadValue = getTeamBank(viewingTeam) + (viewingTeam.player_ids || []).reduce((sum, id) => {
          const p = players.find((pl) => pl.id === id);
          if (!p) return sum;
          const pp = viewingPurchasePrices[id];
          return sum + (pp != null ? sellValueOf(pp, priceOf(p)) : priceOf(p));
        }, 0);
        return (
          <div style={{ position: "fixed", inset: 0, background: t.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
            <div style={{ background: t.cardBg, border: `1px solid ${t.borderLight}`, borderRadius: 20, padding: 24, width: "100%", maxWidth: 440, maxHeight: "85vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Manager</div>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 1, color: "#22c55e" }}>{managerName}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Points</div>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, color: "#22c55e" }}>{viewingTeam.total_points || 0}</div>
                </div>
              </div>
              {(viewingTeam.player_ids || []).length === 0 ? (
                <div style={{ fontSize: 12, color: t.textMuted, textAlign: "center", padding: "20px 0" }}>This manager hasn't picked a squad yet.</div>
              ) : (
                <>
                  <Pitch>
                    <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                      <PitchPlayerCard player={FPL_GOALKEEPER} price={null} isCaptain={false} />
                    </div>
                    {["Defender", "Midfielder", "Striker"].map((pos) => {
                      const rowPlayers = (viewingTeam.player_ids || []).filter((id) => !(viewingTeam.sub_ids || []).includes(id)).map((id) => players.find((pl) => pl.id === id)).filter((p) => p && p.position === pos);
                      if (!rowPlayers.length) return null;
                      return (
                        <div key={pos} style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                          {rowPlayers.map((p) => (
                            <PitchPlayerCard key={p.id} player={p} price={priceOf(p)} points={(viewingTeam.player_points || {})[p.id] || 0} isCaptain={viewingTeam.captain_id === p.id} />
                          ))}
                        </div>
                      );
                    })}
                    {(viewingTeam.sub_ids || []).length > 0 && (
                      <div>
                        <div style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Substitutes</div>
                        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                          {(viewingTeam.sub_ids || []).map((id) => players.find((pl) => pl.id === id)).filter(Boolean).map((p) => (
                            <PitchPlayerCard key={p.id} player={p} price={priceOf(p)} points={(viewingTeam.player_points || {})[p.id] || 0} isCaptain={viewingTeam.captain_id === p.id} isSub />
                          ))}
                        </div>
                      </div>
                    )}
                  </Pitch>
                  {(viewingTeam.player_ids || []).some((id) => !players.find((pl) => pl.id === id)) && (
                    <div style={{ fontSize: 11, color: t.textGhost, marginTop: 10 }}>Some picked players were removed from the liga.</div>
                  )}
                  <div style={{ fontSize: 11, color: t.textFaint, marginTop: 12, textTransform: "uppercase", letterSpacing: 1 }}>Squad value: ₦{squadValue.toFixed(1)}m</div>
                </>
              )}
              <button onClick={() => setViewingTeam(null)} style={{ marginTop: 18, width: "100%", background: t.toggleBg, border: `1px solid ${t.toggleBorder}`, borderRadius: 10, padding: 12, color: t.textDim, cursor: "pointer", fontWeight: 600 }}>Close</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}