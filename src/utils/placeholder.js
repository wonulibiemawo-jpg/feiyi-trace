/**
 * 非遗项目占位图生成工具
 *
 * 当外部图片加载失败时，生成中国风 SVG 占位图作为兜底方案。
 * 每个分类有独特的配色，确保即使所有外链图片都挂了，页面依然美观。
 */

// 各分类对应的主题色
const categoryColors = {
  '传统戏剧': { bg: '#8B2252', fg: '#FFD700', icon: '🎭' },
  '传统技艺': { bg: '#2E5077', fg: '#F5F0E8', icon: '🏺' },
  '传统美术': { bg: '#8B4513', fg: '#FFE4C4', icon: '✂️' },
  '传统体育': { bg: '#2D4A3E', fg: '#E8E0D0', icon: '☯️' },
}

// 默认配色（未匹配分类时使用）
const defaultColor = { bg: '#6B3410', fg: '#F8F5F0', icon: '🏮' }

/**
 * 生成 SVG 占位图的 data URI
 * @param {string} name - 非遗项目名称
 * @param {string} category - 所属分类
 * @returns {string} SVG data URI，可直接用作 img src
 */
export function getPlaceholderUrl(name, category) {
  const colors = categoryColors[category] || defaultColor

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${adjustColor(colors.bg, -30)};stop-opacity:1" />
    </linearGradient>
    <pattern id="wave" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
      <path d="M0 100 Q50 50 100 100 T200 100" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
      <path d="M0 150 Q50 100 100 150 T200 150" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1.5"/>
    </pattern>
  </defs>
  <rect width="800" height="500" fill="url(#bg)"/>
  <rect width="800" height="500" fill="url(#wave)"/>
  <text x="400" y="160" text-anchor="middle" font-size="80" fill="rgba(255,255,255,0.15)" font-family="serif">${colors.icon}</text>
  <text x="400" y="280" text-anchor="middle" font-size="52" fill="${colors.fg}" font-family="serif" font-weight="bold" opacity="0.9">${name}</text>
  <text x="400" y="340" text-anchor="middle" font-size="22" fill="${colors.fg}" opacity="0.6" font-family="sans-serif">${category} · 非物质文化遗产</text>
  <rect x="320" y="370" width="160" height="1" rx="0.5" fill="${colors.fg}" opacity="0.3"/>
  <text x="400" y="410" text-anchor="middle" font-size="16" fill="${colors.fg}" opacity="0.4" font-family="sans-serif">图片加载中，请稍候…</text>
</svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * 调整颜色亮度
 * @param {string} hex - 十六进制颜色值
 * @param {number} amount - 调整量（正数变亮，负数变暗）
 * @returns {string} 调整后的颜色值
 */
function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
