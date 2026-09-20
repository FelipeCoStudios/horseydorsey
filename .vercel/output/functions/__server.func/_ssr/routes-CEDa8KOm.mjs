import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as require_jsx_runtime, a as BoxGeometry, c as ConeGeometry, d as MeshStandardMaterial, f as Object3D, h as Vector3, l as CylinderGeometry, m as SphereGeometry, n as useFrame, o as BufferAttribute, p as PlaneGeometry, r as useThree, s as Color, t as Canvas, u as DodecahedronGeometry } from "../_libs/@react-three/fiber+[...].mjs";
import { a as Heart, c as Apple, i as House, n as Play, o as Brush, r as Pause, s as BookOpen } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CEDa8KOm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HORSES = [
	{
		id: "luna",
		name: "Luna",
		type: "Andaluz",
		colorLabel: "tordo",
		coat: "#9aa3aa",
		mane: "#ece8e2",
		speed: 4,
		strength: 3,
		calm: 5,
		spawn: {
			x: -18,
			z: -14
		},
		scale: 1.02,
		spots: false,
		blaze: true,
		socks: true,
		patches: false,
		flavor: "Elegante y serena. Observa el valle desde las lomas."
	},
	{
		id: "trueno",
		name: "Trueno",
		type: "Frisón",
		colorLabel: "negro",
		coat: "#1a191c",
		mane: "#0d0c0e",
		speed: 3,
		strength: 5,
		calm: 2,
		spawn: {
			x: 24,
			z: 18
		},
		scale: 1.16,
		spots: false,
		blaze: false,
		socks: false,
		patches: false,
		flavor: "Imponente y nervioso. Se gana con paciencia."
	},
	{
		id: "canela",
		name: "Canela",
		type: "Criollo",
		colorLabel: "alazán",
		coat: "#8a4024",
		mane: "#3a2014",
		speed: 3,
		strength: 4,
		calm: 4,
		spawn: {
			x: -30,
			z: 16
		},
		scale: .98,
		spots: false,
		blaze: true,
		socks: false,
		patches: false,
		flavor: "Fuerte y leal, nacido para el campo abierto."
	},
	{
		id: "sol",
		name: "Sol",
		type: "Cuarto de Milla",
		colorLabel: "palomino",
		coat: "#d7b36a",
		mane: "#f2ead8",
		speed: 5,
		strength: 3,
		calm: 3,
		spawn: {
			x: 28,
			z: -20
		},
		scale: 1,
		spots: false,
		blaze: false,
		socks: true,
		patches: false,
		flavor: "El más veloz del valle. Ama las rectas largas."
	},
	{
		id: "nube",
		name: "Nube",
		type: "Árabe",
		colorLabel: "blanco",
		coat: "#efe6d6",
		mane: "#f7f1e6",
		speed: 5,
		strength: 2,
		calm: 4,
		spawn: {
			x: -8,
			z: 32
		},
		scale: .94,
		spots: false,
		blaze: false,
		socks: false,
		patches: false,
		flavor: "Ligera como el viento de la tarde."
	},
	{
		id: "manchas",
		name: "Manchas",
		type: "Appaloosa",
		colorLabel: "pinto",
		coat: "#e7dcc8",
		mane: "#2b2218",
		speed: 3,
		strength: 3,
		calm: 3,
		spawn: {
			x: 16,
			z: -32
		},
		scale: 1,
		spots: true,
		blaze: true,
		socks: true,
		patches: false,
		flavor: "Curiosa y juguetona. Siempre aparece de reojo."
	},
	{
		id: "moka",
		name: "Moka",
		type: "Mustang",
		colorLabel: "bayo",
		coat: "#6e4a28",
		mane: "#1f1610",
		speed: 4,
		strength: 4,
		calm: 2,
		spawn: {
			x: 36,
			z: 6
		},
		scale: 1.04,
		spots: false,
		blaze: false,
		socks: false,
		patches: false,
		flavor: "Libre y desconfiada. El valle es suyo."
	},
	{
		id: "copo",
		name: "Copo",
		type: "Poni",
		colorLabel: "crema",
		coat: "#e6d4ae",
		mane: "#c4a070",
		speed: 2,
		strength: 2,
		calm: 5,
		spawn: {
			x: -34,
			z: -8
		},
		scale: .72,
		spots: false,
		blaze: true,
		socks: true,
		patches: false,
		flavor: "Pequeña, dulce y muy tranquila."
	}
];
var TOTAL_HORSES = HORSES.length;
var HORSE_BY_ID = Object.fromEntries(HORSES.map((h) => [h.id, h]));
var HORSE_INTERACT = 3.6;
function heightAt(x, z) {
	const flatten = Math.min(1, Math.max(0, (Math.hypot(x, z) - 9) / 10));
	const h = Math.sin(x * .075) * Math.cos(z * .055) * 1.55 + Math.sin(x * .032 + 1.4) * Math.cos(z * .038) * 2.05 + Math.sin((x + z) * .09) * .45;
	const pond = Math.hypot(x + 22, z - 10);
	const basin = pond < 6 ? -.55 * (1 - pond / 6) : 0;
	return h * flatten + basin;
}
function mulberry32(seed) {
	return function rand() {
		let t = seed += 1831565813;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
var TREES = [];
var ROCKS = [];
var BUSHES = [];
var FENCE_POSTS = [];
(function scatter() {
	const rand = mulberry32(42);
	for (let i = 0; i < 48 && TREES.length < 36; i++) {
		const x = (rand() * 2 - 1) * 40;
		const z = (rand() * 2 - 1) * 40;
		if (Math.hypot(x, z) < 14) continue;
		if (Math.hypot(x + 22, z - 10) < 8) continue;
		TREES.push({
			x,
			z,
			r: 1.1,
			s: .85 + rand() * .55,
			rot: rand() * Math.PI * 2
		});
	}
	for (let i = 0; i < 28; i++) {
		const x = (rand() * 2 - 1) * 41;
		const z = (rand() * 2 - 1) * 41;
		if (Math.hypot(x, z) < 10) continue;
		ROCKS.push({
			x,
			z,
			r: .7,
			s: .5 + rand() * .7,
			rot: rand() * Math.PI
		});
	}
	for (let i = 0; i < 22; i++) {
		const x = (rand() * 2 - 1) * 39;
		const z = (rand() * 2 - 1) * 39;
		if (Math.hypot(x, z) < 12) continue;
		BUSHES.push({
			x,
			z,
			r: .6,
			s: .7 + rand() * .5,
			rot: rand() * Math.PI * 2
		});
	}
	const pad = 11;
	for (let i = -11; i <= pad; i += 2.2) {
		FENCE_POSTS.push({
			x: i,
			z: -11
		});
		FENCE_POSTS.push({
			x: i,
			z: pad
		});
		FENCE_POSTS.push({
			x: -11,
			z: i
		});
		FENCE_POSTS.push({
			x: pad,
			z: i
		});
	}
})();
var BARN_MIN_X = -4.6;
var BARN_MAX_X = 4.6;
var BARN_MIN_Z = -5.2;
var BARN_MAX_Z = 3.2;
function collideMove(x, z, nx, nz, radius) {
	const limit = 42.6;
	nx = Math.max(-42.6, Math.min(limit, nx));
	nz = Math.max(-42.6, Math.min(limit, nz));
	const hitsBarn = (px, pz) => px > BARN_MIN_X - radius && px < BARN_MAX_X + radius && pz > BARN_MIN_Z - radius && pz < BARN_MAX_Z + radius;
	let xOut = nx;
	let zOut = nz;
	if (hitsBarn(nx, nz)) {
		if (!hitsBarn(x, nz)) xOut = x;
		else if (!hitsBarn(nx, z)) zOut = z;
		else {
			xOut = x;
			zOut = z;
		}
	}
	for (const t of TREES) {
		const dx = xOut - t.x;
		const dz = zOut - t.z;
		const min = radius + t.r * t.s;
		const d2 = dx * dx + dz * dz;
		if (d2 < min * min && d2 > 1e-4) {
			const d = Math.sqrt(d2);
			const push = (min - d) / d;
			xOut += dx * push;
			zOut += dz * push;
		}
	}
	xOut = Math.max(-42.6, Math.min(limit, xOut));
	zOut = Math.max(-42.6, Math.min(limit, zOut));
	return {
		x: xOut,
		z: zOut
	};
}
var STALLS = [
	{
		x: -7.4,
		z: -3.2,
		yaw: Math.PI * .5
	},
	{
		x: -7.4,
		z: .2,
		yaw: Math.PI * .5
	},
	{
		x: -7.4,
		z: 3.4,
		yaw: Math.PI * .5
	},
	{
		x: 7.4,
		z: -3.2,
		yaw: -Math.PI * .5
	},
	{
		x: 7.4,
		z: .2,
		yaw: -Math.PI * .5
	},
	{
		x: 7.4,
		z: 3.4,
		yaw: -Math.PI * .5
	},
	{
		x: -3.2,
		z: -7.6,
		yaw: 0
	},
	{
		x: 3.2,
		z: -7.6,
		yaw: 0
	}
];
var keys = /* @__PURE__ */ new Set();
var injected = null;
var touchSteer = 0;
var touchThrottle = 0;
var padSteer = 0;
var padThrottle = 0;
var interactQueued = false;
var journalQueued = false;
var prevInteract = false;
var prevEsc = false;
var prevJ = false;
var prevPadA = false;
var prevPadY = false;
var GAME_KEYS = /* @__PURE__ */ new Set([
	"KeyW",
	"KeyA",
	"KeyS",
	"KeyD",
	"ArrowUp",
	"ArrowLeft",
	"ArrowDown",
	"ArrowRight",
	"KeyE",
	"KeyJ",
	"Space",
	"Escape"
]);
var attached = false;
function onKeyDown(e) {
	if (GAME_KEYS.has(e.code)) e.preventDefault();
	if (e.repeat) return;
	keys.add(e.code);
}
function onKeyUp(e) {
	keys.delete(e.code);
}
function onBlur() {
	keys.clear();
}
function attachInput() {
	if (attached || typeof window === "undefined") return;
	attached = true;
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	window.addEventListener("blur", onBlur);
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) keys.clear();
	});
}
function detachInput() {
	if (!attached) return;
	attached = false;
	window.removeEventListener("keydown", onKeyDown);
	window.removeEventListener("keyup", onKeyUp);
	window.removeEventListener("blur", onBlur);
}
function down(code) {
	if (injected) return injected.includes(code);
	return keys.has(code);
}
function getSteer() {
	let s = 0;
	if (down("KeyA") || down("ArrowLeft")) s += 1;
	if (down("KeyD") || down("ArrowRight")) s -= 1;
	s += touchSteer + padSteer;
	return Math.max(-1, Math.min(1, s));
}
function getThrottle() {
	let t = 0;
	if (down("KeyW") || down("ArrowUp")) t += 1;
	if (down("KeyS") || down("ArrowDown")) t -= 1;
	t += touchThrottle + padThrottle;
	return Math.max(-1, Math.min(1, t));
}
function setTouchAxes(steer, throttle) {
	touchSteer = Math.max(-1, Math.min(1, steer));
	touchThrottle = Math.max(-1, Math.min(1, throttle));
}
function queueInteract() {
	interactQueued = true;
}
function queueJournal() {
	journalQueued = true;
}
function consumeInteract() {
	const key = down("KeyE") || down("Space");
	const edge = key && !prevInteract;
	prevInteract = key;
	if (edge) return true;
	if (interactQueued) {
		interactQueued = false;
		return true;
	}
	return false;
}
function consumeJournal() {
	const key = down("KeyJ");
	const edge = key && !prevJ;
	prevJ = key;
	if (edge) return true;
	if (journalQueued) {
		journalQueued = false;
		return true;
	}
	return false;
}
function consumeEscape() {
	const key = down("Escape");
	const edge = key && !prevEsc;
	prevEsc = key;
	return edge;
}
function setInjectedKeys(codes) {
	injected = codes;
}
function radialDeadzone(x, y, dz = .18) {
	const m = Math.hypot(x, y);
	if (m < dz) return {
		x: 0,
		y: 0
	};
	const scale = (m - dz) / (1 - dz) / m;
	return {
		x: x * scale,
		y: y * scale
	};
}
function pollGamepad() {
	padSteer = 0;
	padThrottle = 0;
	if (injected) return;
	if (typeof navigator === "undefined" || !navigator.getGamepads) return;
	const pads = navigator.getGamepads();
	for (const pad of pads) {
		if (!pad || pad.mapping !== "standard") continue;
		const stick = radialDeadzone(pad.axes[0] ?? 0, pad.axes[1] ?? 0);
		padSteer = -stick.x;
		padThrottle = -stick.y;
		const a = !!pad.buttons[0]?.pressed;
		const y = !!pad.buttons[3]?.pressed;
		if (a && !prevPadA) interactQueued = true;
		if (y && !prevPadY) journalQueued = true;
		prevPadA = a;
		prevPadY = y;
		break;
	}
}
var KEY = "pepola-establo-v1";
var BACKUP = "pepola-establo-v1.bak";
function defaults() {
	return {
		version: 1,
		player: {
			x: 0,
			z: 16,
			yaw: 0
		},
		horses: HORSES.map((h) => ({
			id: h.id,
			x: h.spawn.x,
			z: h.spawn.z,
			yaw: Math.random() * Math.PI * 2,
			happiness: 0,
			discovered: false,
			registered: false,
			following: false
		}))
	};
}
function migrate(raw) {
	const base = defaults();
	const horses = base.horses.map((d) => {
		const found = raw.horses?.find((h) => h.id === d.id);
		return found ? {
			...d,
			...found,
			id: d.id
		} : d;
	});
	return {
		version: 1,
		player: {
			...base.player,
			...raw.player
		},
		horses
	};
}
function loadSave() {
	const fallback = defaults();
	if (typeof localStorage === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return fallback;
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return fallback;
		return migrate(parsed);
	} catch {
		try {
			const bak = localStorage.getItem(BACKUP);
			if (bak) return migrate(JSON.parse(bak));
		} catch {}
		return fallback;
	}
}
function writeSave(data) {
	if (typeof localStorage === "undefined") return;
	try {
		const prev = localStorage.getItem(KEY);
		if (prev) localStorage.setItem(BACKUP, prev);
		localStorage.setItem(KEY, JSON.stringify({
			...data,
			version: 1
		}));
	} catch {}
}
function clearSave() {
	if (typeof localStorage === "undefined") return;
	try {
		localStorage.removeItem(KEY);
		localStorage.removeItem(BACKUP);
	} catch {}
}
var ctx = null;
function unlockAudio() {
	if (typeof window === "undefined") return;
	if (!ctx) {
		const Ctor = window.AudioContext || window.webkitAudioContext;
		if (!Ctor) return;
		ctx = new Ctor();
	}
	if (ctx.state === "suspended") ctx.resume();
}
function tone(freq, dur, type, gain = .05, slide) {
	if (!ctx) return;
	const t = ctx.currentTime;
	const osc = ctx.createOscillator();
	const g = ctx.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, t);
	if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t + dur);
	g.gain.setValueAtTime(gain, t);
	g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	osc.connect(g);
	g.connect(ctx.destination);
	osc.start(t);
	osc.stop(t + dur + .02);
}
function playCare(kind) {
	unlockAudio();
	if (kind === "brush") tone(520, .12, "triangle", .04, 340);
	else if (kind === "pet") {
		tone(660, .16, "sine", .045);
		tone(880, .2, "sine", .03);
	} else {
		tone(240, .14, "square", .03, 180);
		tone(360, .18, "sine", .035);
	}
}
function playDiscover() {
	unlockAudio();
	tone(392, .18, "sine", .05);
	setTimeout(() => tone(523, .22, "sine", .05), 90);
	setTimeout(() => tone(659, .28, "sine", .045), 180);
}
function playRegister() {
	unlockAudio();
	tone(330, .16, "triangle", .05);
	setTimeout(() => tone(494, .2, "triangle", .045), 110);
	setTimeout(() => tone(660, .32, "sine", .04), 220);
}
var emptyCards = () => HORSES.map((def) => ({
	def,
	happiness: 0,
	discovered: false,
	registered: false,
	following: false
}));
var useGame = create(() => ({
	phase: "title",
	nearbyId: null,
	careId: null,
	pepolaNear: false,
	inRegisterZone: false,
	followingCount: 0,
	discovered: 0,
	registered: 0,
	total: TOTAL_HORSES,
	toast: null,
	prompt: null,
	horses: emptyCards(),
	careCooldown: 0
}));
function setPhase(phase) {
	useGame.setState({ phase });
}
var toastTimer = null;
function showToast(message) {
	useGame.setState({ toast: message });
	if (toastTimer) clearTimeout(toastTimer);
	toastTimer = setTimeout(() => {
		useGame.setState({ toast: null });
	}, 2600);
}
var sim = {
	player: {
		x: 0,
		z: 16,
		yaw: 0,
		speed: 0,
		walkPhase: 0
	},
	horses: [],
	particles: [],
	time: 0,
	careCooldown: 0,
	saveAcc: 0,
	uiAcc: 0,
	ready: false
};
var WALK = 7.4;
var TURN = 2.45;
var FIXED = 1 / 60;
var accumulator = 0;
function makeHorse(id, partial) {
	const def = HORSE_BY_ID[id];
	return {
		id,
		x: def.spawn.x,
		z: def.spawn.z,
		yaw: Math.PI * .25,
		speed: 0,
		walkPhase: 0,
		happiness: 0,
		discovered: false,
		registered: false,
		following: false,
		wanderX: def.spawn.x,
		wanderZ: def.spawn.z,
		wanderT: 1 + Math.random() * 3,
		stall: -1,
		...partial
	};
}
sim.horses = HORSES.map((h) => makeHorse(h.id));
function resetSim(fromSave = true) {
	const data = fromSave ? loadSave() : null;
	sim.player = data ? {
		x: data.player.x,
		z: data.player.z,
		yaw: data.player.yaw,
		speed: 0,
		walkPhase: 0
	} : {
		x: 0,
		z: 16,
		yaw: 0,
		speed: 0,
		walkPhase: 0
	};
	sim.horses = HORSES.map((h, i) => {
		const s = data?.horses.find((x) => x.id === h.id);
		return makeHorse(h.id, s ? {
			...s,
			stall: s.registered ? i : -1,
			speed: 0,
			walkPhase: 0,
			wanderT: 2
		} : void 0);
	});
	sim.particles = [];
	sim.time = 0;
	sim.careCooldown = 0;
	sim.ready = true;
	pushUI();
}
function snapshot() {
	return {
		version: 1,
		player: {
			x: sim.player.x,
			z: sim.player.z,
			yaw: sim.player.yaw
		},
		horses: sim.horses.map((h) => ({
			id: h.id,
			x: h.x,
			z: h.z,
			yaw: h.yaw,
			happiness: h.happiness,
			discovered: h.discovered,
			registered: h.registered,
			following: h.following
		}))
	};
}
function persist() {
	writeSave(snapshot());
}
function spawnBurst(x, y, z, color, n = 8) {
	for (let i = 0; i < n; i++) {
		if (sim.particles.length > 36) sim.particles.shift();
		const a = Math.random() * Math.PI * 2;
		sim.particles.push({
			x,
			y,
			z,
			vx: Math.cos(a) * (.6 + Math.random()),
			vy: 1.4 + Math.random() * 1.4,
			vz: Math.sin(a) * (.6 + Math.random()),
			life: .7 + Math.random() * .4,
			max: 1,
			size: .08 + Math.random() * .08,
			color
		});
	}
}
function nearbyHorse() {
	const p = sim.player;
	let best = null;
	let bestD = HORSE_INTERACT;
	for (const h of sim.horses) {
		if (h.registered) continue;
		const d = Math.hypot(h.x - p.x, h.z - p.z);
		if (d < bestD) {
			bestD = d;
			best = h;
		}
	}
	return best;
}
function pepolaNear() {
	return Math.hypot(sim.player.x - 2.4, sim.player.z - 5.2) < 4.2;
}
function inRegisterZone() {
	return Math.hypot(sim.player.x, sim.player.z) < 9;
}
function currentPhase() {
	return useGame.getState().phase;
}
function promptFor(near, careId) {
	if (currentPhase() !== "playing") return null;
	if (careId) {
		const h = sim.horses.find((x) => x.id === careId);
		if (!h) return null;
		const def = HORSE_BY_ID[h.id];
		if (h.happiness >= 100 && inRegisterZone()) return `E · Registrar a ${def.name} en el establo`;
		if (h.happiness >= 100) return `Lleva a ${def.name} con Pepola`;
		return `Cuida a ${def.name}`;
	}
	if (near) {
		const def = HORSE_BY_ID[near.id];
		if (near.happiness >= 100) return `E · ${def.name} te sigue`;
		return `E · Cuidar a ${def.name}`;
	}
	if (inRegisterZone() && sim.horses.some((h) => h.following && !h.registered)) return "E · Registrar caballos con Pepola";
	if (pepolaNear()) return "E · Hablar con Pepola";
	return "Busca caballos en el valle";
}
function pushUI() {
	const near = nearbyHorse();
	const ui = useGame.getState();
	let careId = ui.careId && sim.horses.some((h) => h.id === ui.careId && !h.registered) ? ui.careId : null;
	if (careId) {
		const h = sim.horses.find((x) => x.id === careId);
		if (h && Math.hypot(h.x - sim.player.x, h.z - sim.player.z) > 5.8) careId = null;
	}
	const discovered = sim.horses.filter((h) => h.discovered).length;
	const registered = sim.horses.filter((h) => h.registered).length;
	useGame.setState({
		nearbyId: near?.id ?? null,
		careId,
		pepolaNear: pepolaNear(),
		inRegisterZone: inRegisterZone(),
		followingCount: sim.horses.filter((h) => h.following && !h.registered).length,
		discovered,
		registered,
		total: TOTAL_HORSES,
		prompt: promptFor(near, careId),
		careCooldown: sim.careCooldown,
		horses: sim.horses.map((h) => ({
			def: HORSE_BY_ID[h.id],
			happiness: h.happiness,
			discovered: h.discovered,
			registered: h.registered,
			following: h.following
		}))
	});
}
function faceToward(fromX, fromZ, toX, toZ, yaw, rate, dt) {
	let d = Math.atan2(-(toX - fromX), -(toZ - fromZ)) - yaw;
	while (d > Math.PI) d -= Math.PI * 2;
	while (d < -Math.PI) d += Math.PI * 2;
	const max = rate * dt;
	if (d > max) d = max;
	if (d < -max) d = -max;
	return yaw + d;
}
function stepPlayer(dt) {
	const p = sim.player;
	const steer = getSteer();
	const throttle = getThrottle();
	p.yaw += steer * TURN * dt;
	const target = throttle * (throttle >= 0 ? WALK : WALK * .55);
	const k = throttle !== 0 ? 14 : 20;
	p.speed += (target - p.speed) * Math.min(1, k * dt);
	if (Math.abs(p.speed) < .04 && throttle === 0) p.speed = 0;
	const fx = -Math.sin(p.yaw);
	const fz = -Math.cos(p.yaw);
	const moved = collideMove(p.x, p.z, p.x + fx * p.speed * dt, p.z + fz * p.speed * dt, .45);
	p.x = moved.x;
	p.z = moved.z;
	p.walkPhase += Math.abs(p.speed) * dt * 2.4;
}
function stepHorses(dt) {
	const p = sim.player;
	const followers = sim.horses.filter((h) => h.following && !h.registered);
	const careId = useGame.getState().careId;
	const playing = currentPhase() === "playing";
	for (const h of sim.horses) {
		const def = HORSE_BY_ID[h.id];
		if (h.registered) {
			const stall = STALLS[h.stall] ?? STALLS[0];
			h.x += (stall.x - h.x) * Math.min(1, 3 * dt);
			h.z += (stall.z - h.z) * Math.min(1, 3 * dt);
			h.yaw = faceToward(h.x, h.z, stall.x + Math.sin(stall.yaw), stall.z + Math.cos(stall.yaw), h.yaw, 2, dt);
			h.speed = 0;
			h.walkPhase += dt * .8;
			continue;
		}
		if (h.following) {
			const idx = followers.indexOf(h);
			const side = idx % 2 === 0 ? -1 : 1;
			const row = Math.floor(idx / 2) + 1;
			const fx = -Math.sin(p.yaw);
			const fz = -Math.cos(p.yaw);
			const rx = Math.cos(p.yaw);
			const rz = -Math.sin(p.yaw);
			const tx = p.x - fx * (2.6 + row * 2.1) + rx * side * 1.5;
			const tz = p.z - fz * (2.6 + row * 2.1) + rz * side * 1.5;
			const dx = tx - h.x;
			const dz = tz - h.z;
			const dist = Math.hypot(dx, dz);
			const followSpeed = Math.min(WALK * 1.05, dist * 2.2);
			if (dist > .35) {
				h.x += dx / dist * followSpeed * dt;
				h.z += dz / dist * followSpeed * dt;
				h.yaw = faceToward(h.x, h.z, p.x, p.z, h.yaw, 4, dt);
				h.speed = followSpeed;
			} else h.speed = 0;
			h.walkPhase += h.speed * dt * 2.2;
			continue;
		}
		if (careId === h.id) {
			h.speed = 0;
			h.yaw = faceToward(h.x, h.z, p.x, p.z, h.yaw, 3, dt);
			h.walkPhase += dt * .7;
			continue;
		}
		const distP = Math.hypot(h.x - p.x, h.z - p.z);
		const shy = def.calm <= 2 && h.happiness < 40 && playing && distP < 7;
		h.wanderT -= dt;
		if (h.wanderT <= 0 || shy) {
			if (shy) {
				const ang = Math.atan2(h.x - p.x, h.z - p.z);
				h.wanderX = h.x + Math.sin(ang) * 8;
				h.wanderZ = h.z + Math.cos(ang) * 8;
				h.wanderT = 1.2;
			} else {
				const a = Math.random() * Math.PI * 2;
				const r = 4 + Math.random() * 7;
				h.wanderX = def.spawn.x + Math.cos(a) * r;
				h.wanderZ = def.spawn.z + Math.sin(a) * r;
				h.wanderT = 3 + Math.random() * 5;
			}
		}
		const dx = h.wanderX - h.x;
		const dz = h.wanderZ - h.z;
		const dist = Math.hypot(dx, dz);
		const walk = (1.6 + (5 - def.calm) * .25) * (shy ? 1.6 : 1);
		if (dist > .5) {
			h.x += dx / dist * walk * dt;
			h.z += dz / dist * walk * dt;
			h.yaw = faceToward(h.x, h.z, h.wanderX, h.wanderZ, h.yaw, 2.4, dt);
			h.speed = walk;
		} else h.speed = 0;
		h.walkPhase += h.speed * dt * 2.1;
	}
}
function stepParticles(dt) {
	for (const q of sim.particles) {
		q.life -= dt;
		q.x += q.vx * dt;
		q.y += q.vy * dt;
		q.z += q.vz * dt;
		q.vy -= 1.8 * dt;
	}
	sim.particles = sim.particles.filter((q) => q.life > 0);
}
function registerFollowers() {
	let n = 0;
	for (const h of sim.horses) {
		if (!h.following || h.registered) continue;
		if (!h.discovered) continue;
		h.registered = true;
		h.following = false;
		h.stall = sim.horses.findIndex((x) => x.id === h.id);
		n += 1;
		const def = HORSE_BY_ID[h.id];
		spawnBurst(h.x, heightAt(h.x, h.z) + 1.4, h.z, "#8fa084", 10);
		showToast(`${def.name} entra al establo de Pepola`);
	}
	if (n > 0) {
		playRegister();
		persist();
		if (sim.horses.every((h) => h.registered)) setTimeout(() => setPhase("win"), 700);
	}
}
function interact() {
	if (currentPhase() !== "playing") return;
	const ui = useGame.getState();
	const near = nearbyHorse();
	if (ui.careId) {
		const h = sim.horses.find((x) => x.id === ui.careId);
		if (h && h.happiness >= 100 && inRegisterZone()) {
			h.following = true;
			registerFollowers();
			useGame.setState({ careId: null });
			return;
		}
		useGame.setState({ careId: null });
		return;
	}
	if (near) {
		useGame.setState({ careId: near.id });
		return;
	}
	if (inRegisterZone() && sim.horses.some((h) => h.following && !h.registered)) {
		registerFollowers();
		return;
	}
	if (pepolaNear()) {
		const left = TOTAL_HORSES - sim.horses.filter((h) => h.registered).length;
		if (left === 0) showToast("Pepola: el establo está completo.");
		else showToast(`Pepola: faltan ${left} caballo${left === 1 ? "" : "s"}. Traémelos.`);
		setPhase("journal");
	}
}
function care(kind) {
	if (currentPhase() !== "playing") return;
	if (sim.careCooldown > 0) return;
	const id = useGame.getState().careId;
	if (!id) return;
	const h = sim.horses.find((x) => x.id === id);
	if (!h || h.registered) return;
	const def = HORSE_BY_ID[h.id];
	const amt = kind === "feed" ? 28 : kind === "brush" ? 22 : 18;
	const before = h.happiness;
	h.happiness = Math.min(100, h.happiness + amt);
	sim.careCooldown = .38;
	const y = heightAt(h.x, h.z) + 1.5;
	spawnBurst(h.x, y, h.z, kind === "pet" ? "#e8b4b4" : kind === "feed" ? "#c4a574" : "#d7c4a8", 7);
	playCare(kind);
	if (before < 100 && h.happiness >= 100 && !h.discovered) {
		h.discovered = true;
		h.following = true;
		playDiscover();
		showToast(`Valentina descubre a ${def.name}`);
		persist();
	} else if (h.happiness >= 100 && !h.following) h.following = true;
	pushUI();
}
function startGame() {
	attachInput();
	if (!sim.ready) resetSim(true);
	setPhase("playing");
}
function newGame() {
	clearSave();
	resetSim(false);
	sim.player = {
		x: 0,
		z: 16,
		yaw: 0,
		speed: 0,
		walkPhase: 0
	};
	setPhase("playing");
	persist();
}
function tick(delta) {
	const dtFrame = Math.min(delta, .1);
	sim.time += dtFrame;
	pollGamepad();
	const phase = currentPhase();
	if (consumeEscape()) {
		if (phase === "playing") setPhase("paused");
		else if (phase === "paused" || phase === "journal") setPhase("playing");
	}
	if (consumeJournal()) {
		if (phase === "playing") setPhase("journal");
		else if (phase === "journal") setPhase("playing");
	}
	accumulator += dtFrame;
	if (accumulator > .25) accumulator = .25;
	while (accumulator >= FIXED) {
		const dt = FIXED;
		if (phase === "playing") {
			stepPlayer(dt);
			if (consumeInteract()) interact();
		} else consumeInteract();
		stepHorses(dt);
		stepParticles(dt);
		if (sim.careCooldown > 0) sim.careCooldown = Math.max(0, sim.careCooldown - dt);
		accumulator -= FIXED;
	}
	sim.saveAcc += dtFrame;
	if (sim.saveAcc > 8) {
		sim.saveAcc = 0;
		if (phase === "playing") persist();
	}
	sim.uiAcc += dtFrame;
	if (sim.uiAcc > .12) {
		sim.uiAcc = 0;
		pushUI();
	}
}
function installControlsProbe() {
	if (typeof window === "undefined") return;
	window.__controlsTest = {
		getYaw: () => sim.player.yaw,
		getSpeed: () => sim.player.speed,
		setKeys: (codes) => setInjectedKeys(codes),
		setSteer: (v) => {
			if (v > .2) setInjectedKeys(["KeyA"]);
			else if (v < -.2) setInjectedKeys(["KeyD"]);
			else setInjectedKeys([]);
		}
	};
}
if (typeof window !== "undefined") {
	window.addEventListener("visibilitychange", () => {
		if (document.hidden) persist();
	});
	window.addEventListener("pagehide", () => persist());
}
var std = (color, opts) => new MeshStandardMaterial({
	color,
	roughness: opts?.roughness ?? .72,
	metalness: .02,
	flatShading: true
});
var geo = {
	sphere: new SphereGeometry(1, 8, 6),
	sphereHi: new SphereGeometry(1, 10, 8),
	cyl: new CylinderGeometry(1, 1, 1, 8),
	cone: new ConeGeometry(1, 1, 8),
	box: new BoxGeometry(1, 1, 1)
};
function MeshStd({ geometry, color, position, rotation, scale, cast = true, receive = true, roughness }) {
	const material = (0, import_react.useMemo)(() => std(color, { roughness }), [color, roughness]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		geometry,
		material,
		position,
		rotation,
		scale,
		castShadow: cast,
		receiveShadow: receive
	});
}
function HorseMesh({ def }) {
	const root = (0, import_react.useRef)(null);
	const lf = (0, import_react.useRef)(null);
	const rf = (0, import_react.useRef)(null);
	const lb = (0, import_react.useRef)(null);
	const rb = (0, import_react.useRef)(null);
	const neck = (0, import_react.useRef)(null);
	const look = (0, import_react.useMemo)(() => new Vector3(), []);
	useFrame(() => {
		const horse = sim.horses.find((h) => h.id === def.id);
		const g = root.current;
		if (!g || !horse) return;
		const y = heightAt(horse.x, horse.z);
		g.position.set(horse.x, y, horse.z);
		look.set(horse.x - Math.sin(horse.yaw), y + 1, horse.z - Math.cos(horse.yaw));
		g.lookAt(look);
		const swing = Math.sin(horse.walkPhase) * .42 * Math.min(1, horse.speed / 2);
		if (lf.current) lf.current.rotation.x = swing;
		if (rb.current) rb.current.rotation.x = swing;
		if (rf.current) rf.current.rotation.x = -swing;
		if (lb.current) lb.current.rotation.x = -swing;
		if (neck.current) neck.current.rotation.x = -.55 + Math.sin(sim.time * 1.4 + horse.walkPhase) * .04;
	});
	const s = def.scale;
	const coat = def.coat;
	const mane = def.mane;
	const hoof = "#2a221c";
	const sock = def.socks ? "#f0e6d4" : coat;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: root,
		scale: s,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.sphereHi,
				color: coat,
				position: [
					0,
					1.08,
					0
				],
				scale: [
					.42,
					.5,
					.78
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.sphere,
				color: coat,
				position: [
					0,
					1.02,
					.52
				],
				scale: [
					.4,
					.46,
					.38
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.sphere,
				color: coat,
				position: [
					0,
					1.1,
					-.52
				],
				scale: [
					.44,
					.5,
					.42
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: neck,
				position: [
					0,
					1.28,
					.5
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
					geometry: geo.cyl,
					color: coat,
					position: [
						0,
						.28,
						.18
					],
					rotation: [
						.9,
						0,
						0
					],
					scale: [
						.16,
						.62,
						.16
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
					geometry: geo.sphere,
					color: mane,
					position: [
						0,
						.34,
						.02
					],
					scale: [
						.1,
						.28,
						.22
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				position: [
					0,
					1.72,
					1.02
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.sphere,
						color: coat,
						scale: [
							.22,
							.2,
							.28
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.sphere,
						color: coat,
						position: [
							0,
							-.04,
							.22
						],
						scale: [
							.16,
							.13,
							.22
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.sphere,
						color: "#1a1410",
						position: [
							0,
							-.02,
							.4
						],
						scale: [
							.09,
							.07,
							.08
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.cone,
						color: coat,
						position: [
							.1,
							.2,
							.02
						],
						rotation: [
							.15,
							0,
							.4
						],
						scale: [
							.06,
							.16,
							.05
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.cone,
						color: coat,
						position: [
							-.1,
							.2,
							.02
						],
						rotation: [
							.15,
							0,
							-.4
						],
						scale: [
							.06,
							.16,
							.05
						]
					}),
					def.blaze ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.box,
						color: "#f4eee4",
						position: [
							0,
							.02,
							.18
						],
						scale: [
							.05,
							.14,
							.28
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.sphere,
						color: "#16120f",
						position: [
							.12,
							.06,
							.16
						],
						scale: [
							.04,
							.045,
							.03
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.sphere,
						color: "#16120f",
						position: [
							-.12,
							.06,
							.16
						],
						scale: [
							.04,
							.045,
							.03
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.sphere,
						color: mane,
						position: [
							0,
							.16,
							-.08
						],
						scale: [
							.14,
							.12,
							.16
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.cone,
				color: mane,
				position: [
					0,
					1.05,
					-.92
				],
				rotation: [
					-1.15,
					0,
					0
				],
				scale: [
					.08,
					.55,
					.08
				]
			}),
			def.spots ? [
				0,
				1,
				2,
				3,
				4,
				5
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.sphere,
				color: "#2c241c",
				position: [
					i % 2 === 0 ? .28 : -.28,
					1.15 + i % 3 * .08,
					-.35 + i * .14
				],
				scale: [
					.07,
					.05,
					.09
				],
				cast: false
			}, i)) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: lf,
				position: [
					.2,
					.7,
					.38
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.cyl,
						color: coat,
						position: [
							0,
							-.18,
							0
						],
						scale: [
							.07,
							.42,
							.07
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.cyl,
						color: sock,
						position: [
							0,
							-.52,
							0
						],
						scale: [
							.065,
							.28,
							.065
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.sphere,
						color: hoof,
						position: [
							0,
							-.68,
							.02
						],
						scale: [
							.08,
							.05,
							.1
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: rf,
				position: [
					-.2,
					.7,
					.38
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.cyl,
						color: coat,
						position: [
							0,
							-.18,
							0
						],
						scale: [
							.07,
							.42,
							.07
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.cyl,
						color: sock,
						position: [
							0,
							-.52,
							0
						],
						scale: [
							.065,
							.28,
							.065
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.sphere,
						color: hoof,
						position: [
							0,
							-.68,
							.02
						],
						scale: [
							.08,
							.05,
							.1
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: lb,
				position: [
					.22,
					.74,
					-.42
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.cyl,
						color: coat,
						position: [
							0,
							-.2,
							0
						],
						scale: [
							.08,
							.46,
							.08
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.cyl,
						color: sock,
						position: [
							0,
							-.56,
							0
						],
						scale: [
							.07,
							.28,
							.07
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.sphere,
						color: hoof,
						position: [
							0,
							-.72,
							.02
						],
						scale: [
							.085,
							.05,
							.1
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: rb,
				position: [
					-.22,
					.74,
					-.42
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.cyl,
						color: coat,
						position: [
							0,
							-.2,
							0
						],
						scale: [
							.08,
							.46,
							.08
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.cyl,
						color: sock,
						position: [
							0,
							-.56,
							0
						],
						scale: [
							.07,
							.28,
							.07
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
						geometry: geo.sphere,
						color: hoof,
						position: [
							0,
							-.72,
							.02
						],
						scale: [
							.085,
							.05,
							.1
						]
					})
				]
			})
		]
	});
}
function ValentinaMesh() {
	const root = (0, import_react.useRef)(null);
	const ll = (0, import_react.useRef)(null);
	const rl = (0, import_react.useRef)(null);
	const la = (0, import_react.useRef)(null);
	const ra = (0, import_react.useRef)(null);
	const look = (0, import_react.useMemo)(() => new Vector3(), []);
	useFrame(() => {
		const p = sim.player;
		const g = root.current;
		if (!g) return;
		const y = heightAt(p.x, p.z);
		g.position.set(p.x, y, p.z);
		look.set(p.x - Math.sin(p.yaw), y + 1.1, p.z - Math.cos(p.yaw));
		g.lookAt(look);
		const swing = Math.sin(p.walkPhase) * .55 * Math.min(1, Math.abs(p.speed) / 3);
		if (ll.current) ll.current.rotation.x = swing;
		if (rl.current) rl.current.rotation.x = -swing;
		if (la.current) la.current.rotation.x = -swing * .8;
		if (ra.current) ra.current.rotation.x = swing * .8;
	});
	const skin = "#d4a07a";
	const hair = "#3a2418";
	const shirt = "#ead9c4";
	const vest = "#a45a40";
	const pants = "#5c4638";
	const boot = "#2a1f18";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: root,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.cyl,
				color: shirt,
				position: [
					0,
					1.12,
					0
				],
				scale: [
					.2,
					.42,
					.16
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.box,
				color: vest,
				position: [
					0,
					1.14,
					.04
				],
				scale: [
					.38,
					.38,
					.18
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.sphereHi,
				color: skin,
				position: [
					0,
					1.52,
					0
				],
				scale: [
					.16,
					.18,
					.16
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.sphere,
				color: hair,
				position: [
					0,
					1.62,
					-.02
				],
				scale: [
					.18,
					.14,
					.18
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.sphere,
				color: hair,
				position: [
					.02,
					1.42,
					-.12
				],
				scale: [
					.07,
					.12,
					.07
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.sphere,
				color: hair,
				position: [
					.02,
					1.28,
					-.14
				],
				scale: [
					.06,
					.08,
					.06
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.sphere,
				color: "#2a1810",
				position: [
					.06,
					1.54,
					.12
				],
				scale: [
					.025,
					.025,
					.02
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.sphere,
				color: "#2a1810",
				position: [
					-.06,
					1.54,
					.12
				],
				scale: [
					.025,
					.025,
					.02
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: la,
				position: [
					.24,
					1.22,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
					geometry: geo.cyl,
					color: shirt,
					position: [
						0,
						-.16,
						0
					],
					scale: [
						.055,
						.34,
						.055
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
					geometry: geo.sphere,
					color: skin,
					position: [
						0,
						-.34,
						0
					],
					scale: [
						.055,
						.055,
						.055
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: ra,
				position: [
					-.24,
					1.22,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
					geometry: geo.cyl,
					color: shirt,
					position: [
						0,
						-.16,
						0
					],
					scale: [
						.055,
						.34,
						.055
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
					geometry: geo.sphere,
					color: skin,
					position: [
						0,
						-.34,
						0
					],
					scale: [
						.055,
						.055,
						.055
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: ll,
				position: [
					.1,
					.88,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
					geometry: geo.cyl,
					color: pants,
					position: [
						0,
						-.2,
						0
					],
					scale: [
						.07,
						.42,
						.07
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
					geometry: geo.cyl,
					color: boot,
					position: [
						0,
						-.46,
						.02
					],
					scale: [
						.075,
						.16,
						.09
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: rl,
				position: [
					-.1,
					.88,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
					geometry: geo.cyl,
					color: pants,
					position: [
						0,
						-.2,
						0
					],
					scale: [
						.07,
						.42,
						.07
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
					geometry: geo.cyl,
					color: boot,
					position: [
						0,
						-.46,
						.02
					],
					scale: [
						.075,
						.16,
						.09
					]
				})]
			})
		]
	});
}
function PepolaMesh() {
	const root = (0, import_react.useRef)(null);
	const look = (0, import_react.useMemo)(() => new Vector3(), []);
	const pos = {
		x: 2.6,
		z: 5.4
	};
	useFrame(() => {
		const g = root.current;
		if (!g) return;
		const y = heightAt(pos.x, pos.z);
		g.position.set(pos.x, y, pos.z);
		const t = sim.player;
		look.set(t.x, y + 1.2, t.z);
		g.lookAt(look);
		g.position.y = y + Math.sin(sim.time * 1.5) * .02;
	});
	const skin = "#c9926a";
	const hair = "#2b2118";
	const shirt = "#4d5c58";
	const pants = "#3c3228";
	const hat = "#c4a36a";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: root,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.cyl,
				color: shirt,
				position: [
					0,
					1.18,
					0
				],
				scale: [
					.22,
					.48,
					.18
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.sphereHi,
				color: skin,
				position: [
					0,
					1.62,
					0
				],
				scale: [
					.17,
					.19,
					.17
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.sphere,
				color: hair,
				position: [
					0,
					1.72,
					-.02
				],
				scale: [
					.18,
					.1,
					.17
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.cyl,
				color: hat,
				position: [
					0,
					1.82,
					0
				],
				scale: [
					.2,
					.12,
					.2
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.cyl,
				color: hat,
				position: [
					0,
					1.76,
					0
				],
				scale: [
					.32,
					.035,
					.32
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.sphere,
				color: "#2a1810",
				position: [
					.06,
					1.64,
					.13
				],
				scale: [
					.025,
					.025,
					.02
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.sphere,
				color: "#2a1810",
				position: [
					-.06,
					1.64,
					.13
				],
				scale: [
					.025,
					.025,
					.02
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.cyl,
				color: shirt,
				position: [
					.26,
					1.05,
					0
				],
				scale: [
					.055,
					.4,
					.055
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.cyl,
				color: shirt,
				position: [
					-.26,
					1.05,
					0
				],
				scale: [
					.055,
					.4,
					.055
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.cyl,
				color: pants,
				position: [
					.1,
					.55,
					0
				],
				scale: [
					.075,
					.5,
					.075
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.cyl,
				color: pants,
				position: [
					-.1,
					.55,
					0
				],
				scale: [
					.075,
					.5,
					.075
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.box,
				color: "#2a1f18",
				position: [
					.1,
					.26,
					.04
				],
				scale: [
					.12,
					.1,
					.2
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshStd, {
				geometry: geo.box,
				color: "#2a1f18",
				position: [
					-.1,
					.26,
					.04
				],
				scale: [
					.12,
					.1,
					.2
				]
			})
		]
	});
}
var trunkMat = new MeshStandardMaterial({
	color: "#4a3728",
	roughness: .9,
	flatShading: true
});
var leafMat = new MeshStandardMaterial({
	color: "#4f7344",
	roughness: .85,
	flatShading: true
});
var leafMat2 = new MeshStandardMaterial({
	color: "#6a8a4e",
	roughness: .85,
	flatShading: true
});
var rockMat = new MeshStandardMaterial({
	color: "#7a7368",
	roughness: .95,
	flatShading: true
});
var bushMat = new MeshStandardMaterial({
	color: "#3f5c34",
	roughness: .88,
	flatShading: true
});
var woodMat = new MeshStandardMaterial({
	color: "#6b4a32",
	roughness: .86,
	flatShading: true
});
var woodDark = new MeshStandardMaterial({
	color: "#4a3122",
	roughness: .88,
	flatShading: true
});
var roofMat = new MeshStandardMaterial({
	color: "#6e3d32",
	roughness: .8,
	flatShading: true
});
var hayMat = new MeshStandardMaterial({
	color: "#c6b06a",
	roughness: .9,
	flatShading: true
});
var waterMat = new MeshStandardMaterial({
	color: "#6a8f8a",
	roughness: .18,
	metalness: .12,
	transparent: true,
	opacity: .72
});
function Terrain() {
	const geometry = (0, import_react.useMemo)(() => {
		const g = new PlaneGeometry(88, 88, 72, 72);
		g.rotateX(-Math.PI / 2);
		const pos = g.attributes.position;
		const colors = new Float32Array(pos.count * 3);
		const grass = new Color("#6d8c4f");
		const grass2 = new Color("#557844");
		const dry = new Color("#a39462");
		const dirt = new Color("#7a6246");
		const pad = new Color("#8b7354");
		const tmp = new Color();
		for (let i = 0; i < pos.count; i++) {
			const x = pos.getX(i);
			const z = pos.getZ(i);
			const y = heightAt(x, z);
			pos.setY(i, y);
			const d = Math.hypot(x, z);
			const n = Math.sin(x * .4) * Math.cos(z * .35);
			if (d < 12) tmp.copy(pad).lerp(dirt, Math.min(1, d / 12));
			else if (y < -.2) tmp.copy(dirt);
			else tmp.copy(grass).lerp(n > .15 ? grass2 : dry, .28);
			colors[i * 3] = tmp.r;
			colors[i * 3 + 1] = tmp.g;
			colors[i * 3 + 2] = tmp.b;
		}
		g.setAttribute("color", new BufferAttribute(colors, 3));
		g.computeVertexNormals();
		return g;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		geometry,
		receiveShadow: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshLambertMaterial", { vertexColors: true })
	});
}
function Trees() {
	const dummy = (0, import_react.useMemo)(() => new Object3D(), []);
	const trunkGeo = (0, import_react.useMemo)(() => new CylinderGeometry(.18, .26, 1.6, 6), []);
	const leafGeo = (0, import_react.useMemo)(() => new ConeGeometry(1.1, 2.2, 7), []);
	const trunkRef = (mesh) => {
		if (!mesh) return;
		TREES.forEach((t, i) => {
			const y = heightAt(t.x, t.z);
			dummy.position.set(t.x, y + .8 * t.s, t.z);
			dummy.rotation.set(0, t.rot, 0);
			dummy.scale.set(t.s, t.s, t.s);
			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);
		});
		mesh.instanceMatrix.needsUpdate = true;
	};
	const leafRef = (mesh) => {
		if (!mesh) return;
		TREES.forEach((t, i) => {
			const y = heightAt(t.x, t.z);
			dummy.position.set(t.x, y + 2.15 * t.s, t.z);
			dummy.rotation.set(0, t.rot, 0);
			dummy.scale.set(t.s, t.s, t.s);
			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);
		});
		mesh.instanceMatrix.needsUpdate = true;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("instancedMesh", {
		ref: trunkRef,
		args: [
			trunkGeo,
			trunkMat,
			TREES.length
		],
		castShadow: true,
		receiveShadow: true
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("instancedMesh", {
		ref: leafRef,
		args: [
			leafGeo,
			leafMat,
			TREES.length
		],
		castShadow: true
	})] });
}
function RocksAndBushes() {
	const dummy = (0, import_react.useMemo)(() => new Object3D(), []);
	const rockGeo = (0, import_react.useMemo)(() => new DodecahedronGeometry(.55, 0), []);
	const bushGeo = (0, import_react.useMemo)(() => new SphereGeometry(.55, 6, 5), []);
	const extraLeaf = (0, import_react.useMemo)(() => new SphereGeometry(.7, 6, 5), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("instancedMesh", {
			args: [
				rockGeo,
				rockMat,
				ROCKS.length
			],
			castShadow: true,
			receiveShadow: true,
			ref: (mesh) => {
				if (!mesh) return;
				ROCKS.forEach((t, i) => {
					dummy.position.set(t.x, heightAt(t.x, t.z) + .15 * t.s, t.z);
					dummy.rotation.set(.2, t.rot, .1);
					dummy.scale.set(t.s * 1.2, t.s * .7, t.s);
					dummy.updateMatrix();
					mesh.setMatrixAt(i, dummy.matrix);
				});
				mesh.instanceMatrix.needsUpdate = true;
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("instancedMesh", {
			args: [
				bushGeo,
				bushMat,
				BUSHES.length
			],
			castShadow: true,
			ref: (mesh) => {
				if (!mesh) return;
				BUSHES.forEach((t, i) => {
					dummy.position.set(t.x, heightAt(t.x, t.z) + .35 * t.s, t.z);
					dummy.rotation.set(0, t.rot, 0);
					dummy.scale.set(t.s, t.s * .8, t.s);
					dummy.updateMatrix();
					mesh.setMatrixAt(i, dummy.matrix);
				});
				mesh.instanceMatrix.needsUpdate = true;
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("instancedMesh", {
			args: [
				extraLeaf,
				leafMat2,
				12
			],
			ref: (mesh) => {
				if (!mesh) return;
				TREES.slice(0, 12).forEach((t, i) => {
					dummy.position.set(t.x + .4, heightAt(t.x, t.z) + 2.4 * t.s, t.z - .2);
					dummy.scale.setScalar(.55 * t.s);
					dummy.updateMatrix();
					mesh.setMatrixAt(i, dummy.matrix);
				});
				mesh.instanceMatrix.needsUpdate = true;
			}
		})
	] });
}
function Pond() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		rotation: [
			-Math.PI / 2,
			0,
			0
		],
		position: [
			-22,
			.02,
			10
		],
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [5.2, 24] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
			object: waterMat,
			attach: "material"
		})]
	});
}
function Barn() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				2.2,
				-1
			],
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				8.4,
				4.4,
				7.2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: woodMat,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				5.1,
				-1
			],
			rotation: [
				0,
				0,
				Math.PI / 4.6
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				6.4,
				.28,
				7.6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: roofMat,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				5.1,
				-1
			],
			rotation: [
				0,
				0,
				-Math.PI / 4.6
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				6.4,
				.28,
				7.6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: roofMat,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.5,
				2.55
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2.6,
				3.1,
				.2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: woodDark,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-1.5,
				1.5,
				2.62
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.28,
				3.1,
				.18
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: woodDark,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				1.5,
				1.5,
				2.62
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.28,
				3.1,
				.18
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: woodDark,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-3.2,
				.45,
				3.4
			],
			rotation: [
				0,
				.4,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.2,
				.8,
				.8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: hayMat,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				3.4,
				.4,
				3.1
			],
			rotation: [
				0,
				-.3,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.1,
				.7,
				.75
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: hayMat,
				attach: "material"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				3.7,
				2.7
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.6,
				.35,
				.12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: woodDark,
				attach: "material"
			})]
		})
	] });
}
function PaddockFence() {
	const dummy = (0, import_react.useMemo)(() => new Object3D(), []);
	const postGeo = (0, import_react.useMemo)(() => new CylinderGeometry(.08, .1, 1.15, 6), []);
	const railGeo = (0, import_react.useMemo)(() => new BoxGeometry(2.2, .08, .06), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("instancedMesh", {
		args: [
			postGeo,
			woodDark,
			FENCE_POSTS.length
		],
		castShadow: true,
		ref: (mesh) => {
			if (!mesh) return;
			FENCE_POSTS.forEach((p, i) => {
				dummy.position.set(p.x, heightAt(p.x, p.z) + .55, p.z);
				dummy.rotation.set(0, 0, 0);
				dummy.scale.set(1, 1, 1);
				dummy.updateMatrix();
				mesh.setMatrixAt(i, dummy.matrix);
			});
			mesh.instanceMatrix.needsUpdate = true;
		}
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("instancedMesh", {
		args: [
			railGeo,
			woodMat,
			FENCE_POSTS.length
		],
		ref: (mesh) => {
			if (!mesh) return;
			FENCE_POSTS.forEach((p, i) => {
				const next = FENCE_POSTS[(i + 1) % FENCE_POSTS.length];
				dummy.position.set(p.x, heightAt(p.x, p.z) + .7, p.z);
				dummy.lookAt(next.x, heightAt(p.x, p.z) + .7, next.z);
				dummy.scale.set(1, 1, 1);
				dummy.updateMatrix();
				mesh.setMatrixAt(i, dummy.matrix);
			});
			mesh.instanceMatrix.needsUpdate = true;
		}
	})] });
}
var _desired = new Vector3();
var _look = new Vector3();
var _cam = new Vector3(0, 9, 22);
function CameraRig() {
	const { camera } = useThree();
	const phase = useGame((s) => s.phase);
	useFrame((_, delta) => {
		const dt = Math.min(delta, .1);
		if (phase === "title") {
			const t = sim.time * .12;
			camera.position.set(Math.sin(t) * 20, 8.4, Math.cos(t) * 20);
			camera.lookAt(0, 1.4, 0);
			return;
		}
		const p = sim.player;
		const fx = -Math.sin(p.yaw);
		const fz = -Math.cos(p.yaw);
		const py = heightAt(p.x, p.z);
		_desired.set(p.x + fx * -8.4, py + 4.15, p.z + fz * -8.4);
		const k = 1 - Math.exp(-4.6 * dt);
		_cam.x += (_desired.x - _cam.x) * k;
		_cam.y += (_desired.y - _cam.y) * k;
		_cam.z += (_desired.z - _cam.z) * k;
		camera.position.copy(_cam);
		_look.set(p.x + fx * 1.6, py + 1.45, p.z + fz * 1.6);
		camera.lookAt(_look);
	});
	return null;
}
function Loop() {
	const started = (0, import_react.useRef)(false);
	useFrame((_, delta) => {
		if (!started.current) {
			started.current = true;
			installControlsProbe();
		}
		tick(delta);
	});
	return null;
}
function Horses() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: HORSES.map((def) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HorseMesh, { def }, def.id)) });
}
function Particles() {
	const meshes = (0, import_react.useRef)([]);
	const dummy = (0, import_react.useMemo)(() => new Object3D(), []);
	useFrame(() => {
		sim.particles.forEach((p, i) => {
			const m = meshes.current[i];
			if (!m) return;
			dummy.position.set(p.x, p.y, p.z);
			const s = p.size * Math.max(.1, p.life / .8);
			dummy.scale.setScalar(s);
			dummy.updateMatrix();
			m.visible = true;
			m.position.copy(dummy.position);
			m.scale.copy(dummy.scale);
			const mat = m.material;
			mat.color.set(p.color);
			mat.opacity = Math.max(0, p.life);
		});
		for (let i = sim.particles.length; i < meshes.current.length; i++) if (meshes.current[i]) meshes.current[i].visible = false;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: Array.from({ length: 36 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref: (el) => {
			if (el) meshes.current[i] = el;
		},
		visible: false,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			1,
			6,
			6
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			transparent: true,
			opacity: 1
		})]
	}, i)) });
}
function Lights() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
			"#d7e2ee",
			"#6d5a44",
			.72
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			castShadow: true,
			position: [
				26,
				34,
				16
			],
			intensity: 1.45,
			color: "#fff3dc",
			"shadow-mapSize": [1024, 1024],
			"shadow-camera-near": 2,
			"shadow-camera-far": 90,
			"shadow-camera-left": -38,
			"shadow-camera-right": 38,
			"shadow-camera-top": 38,
			"shadow-camera-bottom": -38,
			"shadow-bias": -4e-4
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", {
			intensity: .18,
			color: "#c9c0b0"
		})
	] });
}
function GameCanvas() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
		className: "h-full w-full touch-none",
		shadows: true,
		dpr: [1, 1.75],
		camera: {
			fov: 48,
			near: .12,
			far: 140,
			position: [
				0,
				9,
				22
			]
		},
		gl: {
			antialias: true,
			alpha: false,
			powerPreference: "high-performance"
		},
		onCreated: ({ gl }) => {
			gl.toneMapping = 4;
			gl.toneMappingExposure = 1.08;
			gl.shadowMap.enabled = true;
			gl.shadowMap.type = 2;
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
				attach: "background",
				args: ["#c5d0c4"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
				attach: "fog",
				args: [
					"#c5d0c4",
					32,
					78
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lights, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loop, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraRig, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terrain, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pond, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trees, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RocksAndBushes, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barn, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaddockFence, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValentinaMesh, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PepolaMesh, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Horses, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Particles, {})
		]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-fg hover:opacity-90 active:scale-[0.98]",
			secondary: "bg-raised text-fg border border-line hover:bg-surface active:scale-[0.98]",
			ghost: "bg-transparent text-fg hover:bg-raised/80",
			care: "bg-surface text-fg border border-line hover:border-primary/50 hover:bg-raised"
		},
		size: {
			sm: "h-10 rounded-[var(--radius-sm)] px-3 text-sm",
			md: "h-11 rounded-[var(--radius-md)] px-4 text-sm",
			lg: "h-12 rounded-[var(--radius-md)] px-5 text-base",
			xl: "h-14 rounded-[var(--radius-lg)] px-8 text-base",
			icon: "size-12 rounded-full"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		ref,
		...props
	});
});
Button.displayName = "Button";
function StatRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-medium uppercase tracking-wide text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-1",
			"aria-label": `${label} ${value} de 5`,
			children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 w-4 rounded-full", i < value ? "bg-primary" : "bg-line") }, i))
		})]
	});
}
function StartScreen() {
	if (useGame((s) => s.phase) !== "title") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-auto absolute inset-0 flex flex-col justify-end bg-bg/55 px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] sm:justify-center sm:px-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-lg animate-[rise_var(--motion-slow)_var(--ease-smooth-out)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.28em] text-primary",
					children: "Valle del establo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl leading-[1.05] text-fg text-balance sm:text-5xl",
					children: "Valentina y el establo de Pepola"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted sm:text-base",
					children: "Recorre el valle, descubre cada caballo y cuídalo. Cuando esté feliz, regístralo en el establo de tu hermano Pepola."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "xl",
						className: "w-full sm:w-auto",
						onClick: () => {
							unlockAudio();
							startGame();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Jugar"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle sm:ml-2",
						children: "WASD para caminar · E para cuidar · J diario"
					})]
				})
			]
		})
	});
}
function Hud() {
	const phase = useGame((s) => s.phase);
	const discovered = useGame((s) => s.discovered);
	const registered = useGame((s) => s.registered);
	const total = useGame((s) => s.total);
	const prompt = useGame((s) => s.prompt);
	const toast = useGame((s) => s.toast);
	if (phase === "title") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute left-4 top-[max(1rem,env(safe-area-inset-top))] right-4 flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto rounded-[20px] border border-line bg-bg/80 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.2em] text-subtle",
						children: "Establo de Pepola"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-display text-xl tabular-nums text-fg",
						children: [registered, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" / ", total]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [discovered, " descubiertos"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "icon",
					className: "pointer-events-auto size-12 bg-bg/80",
					"aria-label": "Diario del establo",
					onClick: () => setPhase(phase === "journal" ? "playing" : "journal"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "icon",
					className: "pointer-events-auto size-12 bg-bg/80",
					"aria-label": phase === "paused" ? "Reanudar" : "Pausa",
					onClick: () => setPhase(phase === "paused" ? "playing" : "paused"),
					children: phase === "paused" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5" })
				})]
			})]
		}),
		prompt && phase === "playing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute bottom-[7.5rem] left-1/2 z-10 w-[min(92vw,28rem)] -translate-x-1/2 sm:bottom-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-[18px] border border-line bg-bg/82 px-4 py-2.5 text-center text-sm text-fg",
				children: prompt
			})
		}) : null,
		toast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute left-1/2 top-28 z-20 w-[min(92vw,26rem)] -translate-x-1/2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-[16px] border border-line bg-raised px-4 py-3 text-center text-sm text-fg",
				children: toast
			})
		}) : null
	] });
}
function CareActions() {
	const careId = useGame((s) => s.careId);
	const cooldown = useGame((s) => s.careCooldown);
	const card = useGame((s) => s.horses.find((h) => h.def.id === careId) ?? null);
	if (!careId || !card) return null;
	const busy = cooldown > 0;
	const full = card.happiness >= 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-auto absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-20 w-[min(96vw,28rem)] -translate-x-1/2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-[28px] border border-line bg-bg/92 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl text-fg",
						children: card.def.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							card.def.type,
							" · ",
							card.def.colorLabel
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => useGame.setState({ careId: null }),
						children: "Cerrar"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-subtle",
					children: card.def.flavor
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
							label: "Velocidad",
							value: card.def.speed
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
							label: "Fuerza",
							value: card.def.strength
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
							label: "Calma",
							value: card.def.calm
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex justify-between text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Felicidad" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [Math.round(card.happiness), "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 overflow-hidden rounded-full bg-line",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-primary transition-[width] duration-[var(--motion-fast)]",
							style: { width: `${card.happiness}%` }
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "care",
							disabled: busy || full,
							onClick: () => care("brush"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brush, { className: "size-4" }), "Cepillar"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "care",
							disabled: busy || full,
							onClick: () => care("pet"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-4" }), "Cariño"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "care",
							disabled: busy || full,
							onClick: () => care("feed"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Apple, { className: "size-4" }), "Alimentar"]
						})
					]
				}),
				full ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-center text-sm text-primary",
					children: card.following ? "Te sigue al establo de Pepola." : "Lista para el establo."
				}) : null
			]
		})
	});
}
function HorseJournalCard({ card }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("rounded-[20px] border border-line bg-raised p-4", !card.discovered && "opacity-70"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-lg text-fg",
				children: card.discovered ? card.def.name : "Sin descubrir"
			}), card.registered ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full bg-primary/20 px-2 py-0.5 text-[11px] font-medium text-primary",
				children: "En el establo"
			}) : card.discovered ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] text-muted",
				children: "En el valle"
			}) : null]
		}), card.discovered ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-xs uppercase tracking-wide text-subtle",
				children: [
					card.def.type,
					" · ",
					card.def.colorLabel
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: card.def.flavor
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
						label: "Velocidad",
						value: card.def.speed
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
						label: "Fuerza",
						value: card.def.strength
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
						label: "Calma",
						value: card.def.calm
					})
				]
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-subtle",
			children: "Explora el valle para encontrarlo."
		})]
	});
}
function Journal() {
	const phase = useGame((s) => s.phase);
	const horses = useGame((s) => s.horses);
	if (phase !== "journal") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-auto absolute inset-0 z-30 overflow-y-auto bg-bg/88 px-4 py-[max(1.5rem,env(safe-area-inset-top))]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.22em] text-subtle",
					children: "Diario"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl text-fg",
					children: "Caballos del valle"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => setPhase("playing"),
					children: "Cerrar"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-2",
				children: horses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HorseJournalCard, { card: c }, c.def.id))
			})]
		})
	});
}
function PauseMenu() {
	if (useGame((s) => s.phase) !== "paused") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-bg/70 px-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-[28px] border border-line bg-surface p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl text-fg",
					children: "Pausa"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "El valle te espera cuando vuelvas."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							onClick: () => setPhase("playing"),
							children: "Reanudar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "lg",
							onClick: () => setPhase("journal"),
							children: "Diario"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "lg",
							onClick: () => newGame(),
							children: "Nueva partida"
						})
					]
				})
			]
		})
	});
}
function WinScreen() {
	if (useGame((s) => s.phase) !== "win") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-bg/75 px-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-[28px] border border-line bg-surface p-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "mx-auto size-8 text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-3xl text-fg text-balance",
					children: "El establo está completo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-pretty text-sm leading-relaxed text-muted",
					children: "Pepola mira los corrales y sonríe. Valentina reunió a los ocho caballos del valle."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6",
					size: "lg",
					onClick: () => newGame(),
					children: "Jugar de nuevo"
				})
			]
		})
	});
}
function TouchControls() {
	const phase = useGame((s) => s.phase);
	const origin = (0, import_react.useRef)(null);
	const stick = (0, import_react.useRef)(null);
	const knob = (0, import_react.useRef)(null);
	const end = (0, import_react.useCallback)(() => {
		origin.current = null;
		setTouchAxes(0, 0);
		if (knob.current) knob.current.style.transform = "translate(0px, 0px)";
	}, []);
	const move = (0, import_react.useCallback)((x, y) => {
		const o = origin.current;
		if (!o) return;
		const dx = x - o.x;
		const dy = y - o.y;
		const max = 42;
		const m = Math.hypot(dx, dy);
		const s = m > max ? max / m : 1;
		const kx = dx * s;
		const ky = dy * s;
		if (knob.current) knob.current.style.transform = `translate(${kx}px, ${ky}px)`;
		setTouchAxes(-(kx / max), -(ky / max));
	}, []);
	if (phase !== "playing") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: stick,
			className: "pointer-events-auto relative size-32 rounded-full border border-line bg-bg/55",
			onPointerDown: (e) => {
				e.target.setPointerCapture(e.pointerId);
				origin.current = {
					x: e.clientX,
					y: e.clientY,
					id: e.pointerId
				};
			},
			onPointerMove: (e) => {
				if (!origin.current || origin.current.id !== e.pointerId) return;
				move(e.clientX, e.clientY);
			},
			onPointerUp: end,
			onPointerCancel: end,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: knob,
				className: "absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/30"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto mb-2 flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				className: "h-14 min-w-28 bg-bg/75",
				onPointerDown: (e) => {
					e.preventDefault();
					queueInteract();
				},
				children: "Cuidar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "h-12 min-w-28 bg-bg/55",
				onPointerDown: (e) => {
					e.preventDefault();
					queueJournal();
				},
				children: "Diario"
			})]
		})]
	});
}
function CarePanel() {
	if (useGame((s) => s.phase) !== "playing") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CareActions, {});
}
function GameApp() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
		attachInput();
		resetSim(true);
		installControlsProbe();
		return () => detachInput();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: [mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameCanvas, {})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-bg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartScreen, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarePanel, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TouchControls, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Journal, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PauseMenu, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WinScreen, {})
			]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameApp, {});
}
//#endregion
export { Home as component };
