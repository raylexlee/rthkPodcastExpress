function scrapeEpisodes(filter) {
  const archGrid = document.getElementById('archGrid');
  const anchors = archGrid.querySelectorAll('a')
  const episodes = [];
  anchors.forEach(a => {
    const h = a.getAttribute("href");
    const fullUrl = h.startsWith("http") ? h : "https://www.rthk.hk" + h;
    const x = a.getElementsByClassName("dateBlock picVer")[0].innerText;
    if (!x) return;
    const d = x.split('/'); // dd/mm/yyyy
    if (d.length !== 3) return;
    const yyyymmdd = d[2] + d[1] + d[0];
    if (!filter) {
      episodes.push({date: yyyymmdd, url: fullUrl});
      return
    }
    if (fullUrl.split('/').includes(filter)) 
      episodes.push({date: yyyymmdd, url: fullUrl});
  });
  episodes.sort((a, b) => a.date.localeCompare(b.date));
  return episodes;
}

async function getEpisodeMeta(ep) {
  const res = await fetch(ep.url);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");

  // Episode title from <title>
  const parts = doc.title.split("|");
  const episodeTitle = parts[parts.length - 1].trim();

  // Collect all master.m3u8 links
  const fileMatches = [...html.matchAll(/https:\/\/[^"]+master\.m3u8/g)];
  let m3u8Link = null;

  if (fileMatches.length > 0) {
    // Pick the one with the shortest identifier (episode-specific)
    m3u8Link = fileMatches
      .map(m => m[0])
      .sort()[0];
  }
  if (ep.url.split('/').includes('radio') && ep.date < '20250401') {
      const fileMatchesp = [...html.matchAll(/https:\/\/[^"]+playlist\.m3u8/g)];

      if (fileMatchesp.length > 0) {
        // Pick the one with the shortest identifier (episode-specific)
        m3u8Link = fileMatchesp
          .map(m => m[0])
          .sort()[0];
      }
  }
  return {
    date: ep.date,
    episodeTitle,
    m3u8Link
  };
}

async function generatePlaylist() {
  const s1 = document.getElementById('s1');
  const progName = s1.value.replace(/[^\w\u4e00-\u9fff-]/g,'');
  const filter = ["周末午夜場","香港故事"].includes(progName) ? 'radio1' : '';
  const episodes = scrapeEpisodes(filter);
const metas = [];
const seen = new Set();
for (const ep of episodes) {
  const meta = await getEpisodeMeta(ep);
  if (meta.m3u8Link && !seen.has(meta.m3u8Link)) {
    seen.add(meta.m3u8Link);
    metas.push(meta)
  }
}
if (metas[0].m3u8Link.split('/').includes('tv')) {
metas.sort((a, b) => a.m3u8Link.localeCompare(b.m3u8Link));
} else {
metas.sort((a, b) => a.date.localeCompare(b.date));
}
let m3u = "#EXTM3U\n";
for (const meta of metas) {
  m3u += `#EXTINF:0, ${progName} — ${meta.episodeTitle} [${meta.date}]\n${meta.m3u8Link}\n`;
}

  // Save as UTF-8 .m3u8
  const blob = new Blob([new TextEncoder().encode(m3u)], {type: "audio/x-mpegurl;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${progName}.m3u8`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log(`${progName}.m3u8 generated and download triggered!`);
}

// Run it
generatePlaylist();

