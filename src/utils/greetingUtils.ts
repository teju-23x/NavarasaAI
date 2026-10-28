export const HEADER_GREETING_POOL = [
  "Lights down, {name}. Let's find your feeling. 🎬",
  "Hey {name}, what's your mood tonight?",
  "Roll the reels, {name} 🍿",
  "Welcome back, {name} 👋"
];

export const MOBILE_GREETING = "Hi, {name} 👋";

export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getTimeOfDayVariant(): string {
  const hour = new Date().getHours();
  // Morning: 5am - 11:59am
  if (hour >= 5 && hour < 12) {
    return "Good morning, {name} ☀️";
  }
  // Afternoon: 12pm - 4:59pm
  if (hour >= 12 && hour < 17) {
    return "Good afternoon, {name}";
  }
  // Evening: 5pm - 8:59pm
  if (hour >= 17 && hour < 21) {
    return "Good evening, {name} 🌆";
  }
  // Night: 9pm - 4:59am
  return "Late night, {name}? 🌙";
}

/**
 * Returns the sequence of header greetings for the multi-second rotation:
 * Starts with current time-of-day variant, followed by the pool lines.
 */
export function getHeaderGreetingSequence(): string[] {
  const timeVariant = getTimeOfDayVariant();
  return [
    timeVariant,
    ...HEADER_GREETING_POOL
  ];
}
