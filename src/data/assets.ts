import type { Asset } from "@/types";

const createSvgDataUrl = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const stickerHeart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FF6B9D"/><stop offset="100%" style="stop-color:#FF8E53"/></linearGradient></defs><path d="M50 85.7 L15.8 54.2 C5.4 44.8 5.4 29.6 15.8 20.2 C21.7 14.7 29.6 12 37.1 13.2 C42.2 14 47 16.7 50 20.7 C53 16.7 57.8 14 62.9 13.2 C70.4 12 78.3 14.7 84.2 20.2 C94.6 29.6 94.6 44.8 84.2 54.2 L50 85.7Z" fill="url(#hg)"/></svg>`;
const stickerStar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FFD93D"/><stop offset="100%" style="stop-color:#FF9A3C"/></linearGradient></defs><path d="M50 5 L61.8 35.4 L95 39.5 L69.7 61.2 L77.6 93.3 L50 75.8 L22.4 93.3 L30.3 61.2 L5 39.5 L38.2 35.4 Z" fill="url(#sg)"/></svg>`;
const stickerFlower = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#F093FB"/><stop offset="100%" style="stop-color:#F5576C"/></linearGradient></defs><circle cx="50" cy="25" r="18" fill="url(#fg)" opacity="0.9"/><circle cx="75" cy="50" r="18" fill="url(#fg)" opacity="0.9"/><circle cx="50" cy="75" r="18" fill="url(#fg)" opacity="0.9"/><circle cx="25" cy="50" r="18" fill="url(#fg)" opacity="0.9"/><circle cx="50" cy="50" r="14" fill="#FFE66D"/></svg>`;
const stickerCloud = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><defs><linearGradient id="cg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#A8EDEA"/><stop offset="100%" style="stop-color:#FED6E3"/></linearGradient></defs><path d="M35 65 Q15 65 15 50 Q15 38 28 35 Q28 20 45 20 Q58 12 70 22 Q85 18 92 32 Q108 34 106 50 Q106 65 88 65 Z" fill="url(#cg)"/></svg>`;
const stickerRainbow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><path d="M10 75 Q10 20 60 20 Q110 20 110 75" stroke="#FF6B6B" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M20 75 Q20 30 60 30 Q100 30 100 75" stroke="#FFD93D" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M30 75 Q30 40 60 40 Q90 40 90 75" stroke="#6BCB77" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M40 75 Q40 50 60 50 Q80 50 80 75" stroke="#4D96FF" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M50 75 Q50 60 60 60 Q70 60 70 75" stroke="#9B59B6" stroke-width="8" fill="none" stroke-linecap="round"/></svg>`;
const stickerMoon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="mg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#667eea"/><stop offset="100%" style="stop-color:#764ba2"/></linearGradient></defs><path d="M75 50 Q75 25 55 15 Q70 20 80 40 Q82 50 75 50Z M55 15 Q30 15 20 40 Q10 65 30 82 Q55 90 72 72 Q50 75 40 58 Q32 40 45 25 Q50 20 55 15Z" fill="url(#mg)"/><circle cx="55" cy="42" r="3" fill="#FFE66D" opacity="0.8"/><circle cx="42" cy="58" r="2" fill="#FFE66D" opacity="0.6"/><circle cx="60" cy="68" r="2" fill="#FFE66D" opacity="0.7"/></svg>`;
const stickerSmile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="smg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FCE38A"/><stop offset="100%" style="stop-color:#F38181"/></linearGradient></defs><circle cx="50" cy="50" r="45" fill="url(#smg)"/><ellipse cx="35" cy="40" rx="6" ry="8" fill="#333"/><ellipse cx="65" cy="40" rx="6" ry="8" fill="#333"/><path d="M32 60 Q50 80 68 60" stroke="#333" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
const stickerCherry = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><path d="M50 10 Q60 30 55 50" stroke="#5D8A3C" stroke-width="3" fill="none"/><path d="M50 10 Q40 30 45 50" stroke="#5D8A3C" stroke-width="3" fill="none"/><ellipse cx="50" cy="12" rx="18" ry="10" fill="#7CB342" transform="rotate(-20 50 12)"/><defs><radialGradient id="chg1" cx="35%" cy="35%"><stop offset="0%" style="stop-color:#FF8A8A"/><stop offset="100%" style="stop-color:#E53935"/></radialGradient><radialGradient id="chg2" cx="35%" cy="35%"><stop offset="0%" style="stop-color:#FF8A8A"/><stop offset="100%" style="stop-color:#E53935"/></radialGradient></defs><circle cx="35" cy="75" r="22" fill="url(#chg1)"/><circle cx="65" cy="70" r="20" fill="url(#chg2)"/></svg>`;
const stickerCat = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="catg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FFB74D"/><stop offset="100%" style="stop-color:#FF8A65"/></linearGradient></defs><path d="M25 35 L35 15 L45 30 Z" fill="url(#catg)"/><path d="M75 35 L65 15 L55 30 Z" fill="url(#catg)"/><circle cx="50" cy="55" r="35" fill="url(#catg)"/><ellipse cx="38" cy="50" rx="5" ry="7" fill="#333"/><ellipse cx="62" cy="50" rx="5" ry="7" fill="#333"/><circle cx="36" cy="48" r="2" fill="#fff"/><circle cx="60" cy="48" r="2" fill="#fff"/><ellipse cx="50" cy="60" rx="4" ry="3" fill="#FF8A80"/><path d="M46 65 Q50 72 54 65" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M30 58 L18 55" stroke="#333" stroke-width="1.5" stroke-linecap="round"/><path d="M30 62 L18 62" stroke="#333" stroke-width="1.5" stroke-linecap="round"/><path d="M70 58 L82 55" stroke="#333" stroke-width="1.5" stroke-linecap="round"/><path d="M70 62 L82 62" stroke="#333" stroke-width="1.5" stroke-linecap="round"/></svg>`;
const stickerLightning = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100"><defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FFEB3B"/><stop offset="100%" style="stop-color:#FF9800"/></linearGradient></defs><path d="M50 5 L25 45 L40 45 L30 95 L55 50 L40 50 Z" fill="url(#lg)"/></svg>`;
const stickerDiamond = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90"><defs><linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#81D4FA"/><stop offset="50%" style="stop-color:#29B6F6"/><stop offset="100%" style="stop-color:#0288D1"/></linearGradient></defs><polygon points="50,5 90,30 70,85 30,85 10,30" fill="url(#dg)"/><polygon points="50,5 30,30 50,55 70,30" fill="#fff" opacity="0.3"/><line x1="50" y1="5" x2="50" y2="85" stroke="#fff" stroke-width="1" opacity="0.5"/></svg>`;
const stickerMusic = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="musg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#A78BFA"/><stop offset="100%" style="stop-color:#7C3AED"/></linearGradient></defs><ellipse cx="35" cy="70" rx="20" ry="15" fill="url(#musg)"/><rect x="50" y="25" width="8" height="50" rx="2" fill="url(#musg)"/><ellipse cx="58" cy="70" rx="15" ry="12" fill="url(#musg)"/><rect x="35" y="15" width="8" height="60" rx="2" fill="url(#musg)"/></svg>`;
const stickerPizza = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="pzg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#FFCC80"/><stop offset="100%" style="stop-color:#FF9800"/></linearGradient></defs><path d="M50 15 L85 85 L15 85 Z" fill="url(#pzg)"/><path d="M50 25 L78 80 L22 80 Z" fill="#FF5722"/><circle cx="40" cy="55" r="8" fill="#F44336"/><circle cx="60" cy="60" r="7" fill="#F44336"/><circle cx="50" cy="45" r="6" fill="#F44336"/><circle cx="35" cy="70" r="5" fill="#795548"/><circle cx="65" cy="72" r="5" fill="#795548"/><circle cx="50" cy="68" r="4" fill="#8D6E63"/></svg>`;
const stickerCoffee = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="cofg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8D6E63"/><stop offset="100%" style="stop-color:#5D4037"/></linearGradient></defs><path d="M25 35 L25 80 Q25 90 35 90 L65 90 Q75 90 75 80 L75 35 Z" fill="url(#cofg)"/><path d="M25 35 L75 35 L75 40 L25 40 Z" fill="#D7CCC8"/><path d="M75 45 Q90 45 90 60 Q90 75 75 75" stroke="url(#cofg)" stroke-width="6" fill="none"/><ellipse cx="45" cy="50" rx="4" ry="2" fill="#fff" opacity="0.6"/><ellipse cx="55" cy="48" rx="3" ry="1.5" fill="#fff" opacity="0.5"/><path d="M40 25 Q42 20 40 15" stroke="#8D6E63" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M50 22 Q52 17 50 12" stroke="#8D6E63" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M60 25 Q62 20 60 15" stroke="#8D6E63" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
const stickerSun = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="sung" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:#FFEB3B"/><stop offset="100%" style="stop-color:#FF9800"/></radialGradient></defs><circle cx="50" cy="50" r="25" fill="url(#sung)"/><g stroke="#FF9800" stroke-width="4" stroke-linecap="round"><line x1="50" y1="10" x2="50" y2="22"/><line x1="50" y1="78" x2="50" y2="90"/><line x1="10" y1="50" x2="22" y2="50"/><line x1="78" y1="50" x2="90" y2="50"/><line x1="22" y1="22" x2="30" y2="30"/><line x1="70" y1="70" x2="78" y2="78"/><line x1="78" y1="22" x2="70" y2="30"/><line x1="30" y1="70" x2="22" y2="78"/></g></svg>`;

const charmBear = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120"><defs><linearGradient id="brg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#A1887F"/><stop offset="100%" style="stop-color:#6D4C41"/></linearGradient></defs><circle cx="25" cy="25" r="12" fill="url(#brg)"/><circle cx="55" cy="25" r="12" fill="url(#brg)"/><circle cx="40" cy="50" r="30" fill="url(#brg)"/><ellipse cx="40" cy="58" rx="18" ry="15" fill="#D7CCC8"/><circle cx="30" cy="45" r="4" fill="#333"/><circle cx="50" cy="45" r="4" fill="#333"/><ellipse cx="40" cy="55" rx="5" ry="4" fill="#333"/><path d="M35 62 Q40 67 45 62" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="38" y="80" width="4" height="25" fill="#9E9E9E"/><circle cx="40" cy="108" r="5" fill="#757575"/></svg>`;
const charmKey = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 120"><defs><linearGradient id="kyg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#FFD54F"/><stop offset="100%" style="stop-color:#FFA000"/></linearGradient></defs><circle cx="30" cy="25" r="20" fill="none" stroke="url(#kyg)" stroke-width="6"/><circle cx="30" cy="25" r="8" fill="#FFF8E1"/><rect x="26" y="43" width="8" height="60" rx="2" fill="url(#kyg)"/><rect x="34" y="80" width="12" height="6" rx="1" fill="url(#kyg)"/><rect x="34" y="92" width="10" height="6" rx="1" fill="url(#kyg)"/></svg>`;
const charmBell = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120"><defs><linearGradient id="blg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FFD54F"/><stop offset="100%" style="stop-color:#FF8F00"/></linearGradient></defs><path d="M25 40 Q25 80 40 90 Q55 80 55 40 Q55 20 40 20 Q25 20 25 40 Z" fill="url(#blg)"/><ellipse cx="40" cy="95" rx="12" ry="8" fill="url(#blg)"/><circle cx="40" cy="95" r="5" fill="#BF360C"/><rect x="37" y="5" width="6" height="18" rx="2" fill="#FFB300"/><circle cx="40" cy="8" r="4" fill="url(#blg)"/><path d="M28 45 Q40 55 52 45" stroke="#fff" stroke-width="2" fill="none" opacity="0.5"/></svg>`;
const charmStar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120"><defs><linearGradient id="cstg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#E0E0E0"/><stop offset="50%" style="stop-color:#9E9E9E"/><stop offset="100%" style="stop-color:#616161"/></linearGradient></defs><circle cx="40" cy="12" r="8" fill="none" stroke="url(#cstg)" stroke-width="3"/><rect x="38" y="18" width="4" height="15" fill="url(#cstg)"/><path d="M40 40 L47 58 L66 60 L52 72 L56 92 L40 82 L24 92 L28 72 L14 60 L33 58 Z" fill="url(#cstg)"/><path d="M40 48 L44 58 L55 59 L47 66 L50 77 L40 72 L30 77 L33 66 L25 59 L36 58 Z" fill="#fff" opacity="0.3"/></svg>`;
const charmHeart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120"><defs><linearGradient id="chg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#EC407A"/><stop offset="100%" style="stop-color:#AD1457"/></linearGradient></defs><circle cx="40" cy="12" r="8" fill="none" stroke="url(#chg)" stroke-width="3"/><rect x="38" y="18" width="4" height="15" fill="url(#chg)"/><path d="M40 100 L15 70 C5 55 10 35 25 32 C32 30 38 35 40 42 C42 35 48 30 55 32 C70 35 75 55 65 70 Z" fill="url(#chg)"/><ellipse cx="30" cy="45" rx="6" ry="4" fill="#fff" opacity="0.3" transform="rotate(-30 30 45)"/></svg>`;
const charmMoon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120"><defs><linearGradient id="cmg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#90CAF9"/><stop offset="100%" style="stop-color:#1976D2"/></linearGradient></defs><circle cx="40" cy="12" r="8" fill="none" stroke="url(#cmg)" stroke-width="3"/><rect x="38" y="18" width="4" height="12" fill="url(#cmg)"/><path d="M55 60 Q55 35 35 30 Q48 38 52 52 Q54 58 55 60Z M35 30 Q15 35 12 60 Q8 85 30 100 Q50 105 62 88 Q40 92 32 75 Q26 58 38 42 Q42 35 35 30Z" fill="url(#cmg)"/><circle cx="42" cy="55" r="3" fill="#FFE082" opacity="0.8"/><circle cx="32" cy="70" r="2" fill="#FFE082" opacity="0.6"/><circle cx="48" cy="80" r="2" fill="#FFE082" opacity="0.7"/></svg>`;

const lensRingGold = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><radialGradient id="lrg" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:#FFD700"/><stop offset="50%" style="stop-color:#FFA500"/><stop offset="100%" style="stop-color:#B8860B"/></radialGradient></defs><circle cx="60" cy="60" r="55" fill="url(#lrg)"/><circle cx="60" cy="60" r="40" fill="#1a1a2e"/><circle cx="60" cy="60" r="50" fill="none" stroke="#FFE55C" stroke-width="2" opacity="0.6"/><circle cx="60" cy="60" r="45" fill="none" stroke="#8B6914" stroke-width="1" opacity="0.5"/></svg>`;
const lensRingSilver = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><radialGradient id="lrs" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:#E8E8E8"/><stop offset="50%" style="stop-color:#A0A0A0"/><stop offset="100%" style="stop-color:#696969"/></radialGradient></defs><circle cx="60" cy="60" r="55" fill="url(#lrs)"/><circle cx="60" cy="60" r="40" fill="#1a1a2e"/><circle cx="60" cy="60" r="50" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.6"/><circle cx="60" cy="60" r="45" fill="none" stroke="#505050" stroke-width="1" opacity="0.5"/></svg>`;
const lensRingRoseGold = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><radialGradient id="lrrg" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:#FFB6C1"/><stop offset="50%" style="stop-color:#E8B4B8"/><stop offset="100%" style="stop-color:#B76E79"/></radialGradient></defs><circle cx="60" cy="60" r="55" fill="url(#lrrg)"/><circle cx="60" cy="60" r="40" fill="#1a1a2e"/><circle cx="60" cy="60" r="50" fill="none" stroke="#FFD1DC" stroke-width="2" opacity="0.6"/><circle cx="60" cy="60" r="45" fill="none" stroke="#9F5C68" stroke-width="1" opacity="0.5"/></svg>`;
const lensRingBlue = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><radialGradient id="lrb" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:#87CEEB"/><stop offset="50%" style="stop-color:#4169E1"/><stop offset="100%" style="stop-color:#191970"/></radialGradient></defs><circle cx="60" cy="60" r="55" fill="url(#lrb)"/><circle cx="60" cy="60" r="40" fill="#0a0a1a"/><circle cx="60" cy="60" r="50" fill="none" stroke="#ADD8E6" stroke-width="2" opacity="0.6"/><circle cx="60" cy="60" r="45" fill="none" stroke="#000080" stroke-width="1" opacity="0.5"/></svg>`;
const lensRingPink = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><radialGradient id="lrp" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:#FFB6C1"/><stop offset="50%" style="stop-color:#FF69B4"/><stop offset="100%" style="stop-color:#C71585"/></radialGradient></defs><circle cx="60" cy="60" r="55" fill="url(#lrp)"/><circle cx="60" cy="60" r="40" fill="#2d1b2e"/><circle cx="60" cy="60" r="50" fill="none" stroke="#FFC0CB" stroke-width="2" opacity="0.6"/><circle cx="60" cy="60" r="45" fill="none" stroke="#8B008B" stroke-width="1" opacity="0.5"/></svg>`;

export const assets: Asset[] = [
  {
    id: "sticker-heart",
    type: "sticker",
    name: "爱心",
    thumbnail: createSvgDataUrl(stickerHeart),
    svg: stickerHeart,
    defaultWidth: 60,
    defaultHeight: 60,
    category: "可爱",
  },
  {
    id: "sticker-star",
    type: "sticker",
    name: "星星",
    thumbnail: createSvgDataUrl(stickerStar),
    svg: stickerStar,
    defaultWidth: 60,
    defaultHeight: 60,
    category: "可爱",
  },
  {
    id: "sticker-flower",
    type: "sticker",
    name: "樱花",
    thumbnail: createSvgDataUrl(stickerFlower),
    svg: stickerFlower,
    defaultWidth: 65,
    defaultHeight: 65,
    category: "可爱",
  },
  {
    id: "sticker-cloud",
    type: "sticker",
    name: "云朵",
    thumbnail: createSvgDataUrl(stickerCloud),
    svg: stickerCloud,
    defaultWidth: 80,
    defaultHeight: 55,
    category: "可爱",
  },
  {
    id: "sticker-rainbow",
    type: "sticker",
    name: "彩虹",
    thumbnail: createSvgDataUrl(stickerRainbow),
    svg: stickerRainbow,
    defaultWidth: 80,
    defaultHeight: 55,
    category: "可爱",
  },
  {
    id: "sticker-moon",
    type: "sticker",
    name: "月亮",
    thumbnail: createSvgDataUrl(stickerMoon),
    svg: stickerMoon,
    defaultWidth: 60,
    defaultHeight: 60,
    category: "极简",
  },
  {
    id: "sticker-smile",
    type: "sticker",
    name: "笑脸",
    thumbnail: createSvgDataUrl(stickerSmile),
    svg: stickerSmile,
    defaultWidth: 60,
    defaultHeight: 60,
    category: "可爱",
  },
  {
    id: "sticker-cherry",
    type: "sticker",
    name: "樱桃",
    thumbnail: createSvgDataUrl(stickerCherry),
    svg: stickerCherry,
    defaultWidth: 55,
    defaultHeight: 65,
    category: "可爱",
  },
  {
    id: "sticker-cat",
    type: "sticker",
    name: "猫咪",
    thumbnail: createSvgDataUrl(stickerCat),
    svg: stickerCat,
    defaultWidth: 65,
    defaultHeight: 65,
    category: "可爱",
  },
  {
    id: "sticker-lightning",
    type: "sticker",
    name: "闪电",
    thumbnail: createSvgDataUrl(stickerLightning),
    svg: stickerLightning,
    defaultWidth: 45,
    defaultHeight: 60,
    category: "炫酷",
  },
  {
    id: "sticker-diamond",
    type: "sticker",
    name: "钻石",
    thumbnail: createSvgDataUrl(stickerDiamond),
    svg: stickerDiamond,
    defaultWidth: 60,
    defaultHeight: 55,
    category: "炫酷",
  },
  {
    id: "sticker-music",
    type: "sticker",
    name: "音符",
    thumbnail: createSvgDataUrl(stickerMusic),
    svg: stickerMusic,
    defaultWidth: 60,
    defaultHeight: 60,
    category: "文艺",
  },
  {
    id: "sticker-pizza",
    type: "sticker",
    name: "披萨",
    thumbnail: createSvgDataUrl(stickerPizza),
    svg: stickerPizza,
    defaultWidth: 60,
    defaultHeight: 60,
    category: "可爱",
  },
  {
    id: "sticker-coffee",
    type: "sticker",
    name: "咖啡",
    thumbnail: createSvgDataUrl(stickerCoffee),
    svg: stickerCoffee,
    defaultWidth: 55,
    defaultHeight: 60,
    category: "通勤",
  },
  {
    id: "sticker-sun",
    type: "sticker",
    name: "太阳",
    thumbnail: createSvgDataUrl(stickerSun),
    svg: stickerSun,
    defaultWidth: 65,
    defaultHeight: 65,
    category: "节日",
  },
  {
    id: "charm-bear",
    type: "charm",
    name: "小熊挂件",
    thumbnail: createSvgDataUrl(charmBear),
    svg: charmBear,
    defaultWidth: 50,
    defaultHeight: 75,
    category: "可爱",
  },
  {
    id: "charm-key",
    type: "charm",
    name: "钥匙挂件",
    thumbnail: createSvgDataUrl(charmKey),
    svg: charmKey,
    defaultWidth: 40,
    defaultHeight: 80,
    category: "极简",
  },
  {
    id: "charm-bell",
    type: "charm",
    name: "铃铛挂件",
    thumbnail: createSvgDataUrl(charmBell),
    svg: charmBell,
    defaultWidth: 50,
    defaultHeight: 75,
    category: "可爱",
  },
  {
    id: "charm-star",
    type: "charm",
    name: "星星挂件",
    thumbnail: createSvgDataUrl(charmStar),
    svg: charmStar,
    defaultWidth: 50,
    defaultHeight: 75,
    category: "炫酷",
  },
  {
    id: "charm-heart",
    type: "charm",
    name: "爱心挂件",
    thumbnail: createSvgDataUrl(charmHeart),
    svg: charmHeart,
    defaultWidth: 50,
    defaultHeight: 75,
    category: "可爱",
  },
  {
    id: "charm-moon",
    type: "charm",
    name: "月亮挂件",
    thumbnail: createSvgDataUrl(charmMoon),
    svg: charmMoon,
    defaultWidth: 50,
    defaultHeight: 75,
    category: "文艺",
  },
  {
    id: "lens-ring-gold",
    type: "lens-ring",
    name: "金色镜头圈",
    thumbnail: createSvgDataUrl(lensRingGold),
    svg: lensRingGold,
    defaultWidth: 70,
    defaultHeight: 70,
    category: "炫酷",
  },
  {
    id: "lens-ring-silver",
    type: "lens-ring",
    name: "银色镜头圈",
    thumbnail: createSvgDataUrl(lensRingSilver),
    svg: lensRingSilver,
    defaultWidth: 70,
    defaultHeight: 70,
    category: "极简",
  },
  {
    id: "lens-ring-rosegold",
    type: "lens-ring",
    name: "玫瑰金镜头圈",
    thumbnail: createSvgDataUrl(lensRingRoseGold),
    svg: lensRingRoseGold,
    defaultWidth: 70,
    defaultHeight: 70,
    category: "可爱",
  },
  {
    id: "lens-ring-blue",
    type: "lens-ring",
    name: "蓝色镜头圈",
    thumbnail: createSvgDataUrl(lensRingBlue),
    svg: lensRingBlue,
    defaultWidth: 70,
    defaultHeight: 70,
    category: "通勤",
  },
  {
    id: "lens-ring-pink",
    type: "lens-ring",
    name: "粉色镜头圈",
    thumbnail: createSvgDataUrl(lensRingPink),
    svg: lensRingPink,
    defaultWidth: 70,
    defaultHeight: 70,
    category: "可爱",
  },
];

export const getAssetsByType = (type: string) =>
  assets.filter((a) => a.type === type);

export const getAssetById = (id: string) =>
  assets.find((a) => a.id === id);
