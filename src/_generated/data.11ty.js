// Builds assets/data.js for the browser scripts from src/_data/events.json and videos.json.
// Edit the JSON files, not this output.
export const data = {permalink: "assets/data.js", eleventyExcludeFromCollections: true};

export function render({events, videos}) {
  const list = events.map(({cover, ...e}) => e);
  const covers = Object.fromEntries(events.filter(e => e.cover).map(e => [e.id, e.cover]));
  return [
    "// Generated from src/_data at build time. Edit events.json / videos.json instead.",
    `window.PAME_EVENTS = ${JSON.stringify(list, null, 2)};`,
    `window.PAME_COVER = ${JSON.stringify(covers)};`,
    `window.PAME_VIDEOS = ${JSON.stringify(videos, null, 2)};`,
    ""
  ].join("\n");
}
