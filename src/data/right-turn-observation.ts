/** Separately reviewed illustration; never a replacement for the A/B diagram. */
export const RIGHT_TURN_OBSERVATION = {
  slug: 'taiwan-right-turn-car-straight-motorcycle-evidence',
  id: 'right-turn-observation',
  title: 'AI 假想影像：右轉汽車與右側機車的位置變化',
  disclosure: 'AI 假想情境，非真實行車紀錄器影像；非事故重建。',
  caption: [
    '畫面中，銀色小客車逐漸向右轉，右側黑色機車略向畫面左方移動後回移，騎士一度放下左腳再抬起；兩車未呈現接觸，片尾定格是編輯安排，不代表煞停或避險成功。',
    '核對真實事件時，仍須查看轉彎前的相對位置、現場標誌標線及連續原始影像，不能用本片判定機車全程直行、是否來得及避讓或責任比例。',
  ],
  alt: 'AI 假想情境，固定車內前向視角：銀色小客車在左前方逐漸右轉，右側黑色機車略向畫面左方移動後回移，戴白色安全帽的騎士一度放下左腳再抬起；未呈現接觸，片尾以編輯定格停留。',
  posterAlt: 'AI 假想影片的末幀：銀色小客車已朝右側轉向，黑色機車與戴白色安全帽的騎士位於其右側，畫面仍可見間隔；此定格不代表實際煞停。',
  description: [
    '這段約8秒的無聲影片，前約4秒呈現 AI 生成的動作，後約4秒維持最後畫面供觀察。開始時，銀色小客車位於黑色機車的左前方，汽車右後方燈具有明暗變化，車身接著逐漸朝右側路口轉向。機車在中段略向畫面左方移動，再向右回移；騎士約在第1秒至第3秒之間放下左腳，之後抬回。畫面未呈現兩車接觸、騎士倒地或受傷，末幀仍可見間隔。',
    '開始與結束構圖來自兩張假想參照圖，中間動作由模型生成。腳部姿勢與位置變化可供描述，但不足以認定騎士已經停車、正在避險或維持同一車道直行；燈具亮起也不能用來推算是否已在法定距離前示意。畫面中的道路配置、車道性質、號誌適用方向、速度與實際距離均未經測量確認，本片不提供通行權、可避免性或責任比例的結論，也不重建文中引用的大貨車事故。',
    '這個例子可用來提醒讀者分清楚「畫面看得到的變化」與「仍須資料才能判斷的問題」。整理真實事件時，要把右轉前雙方的相對位置、車輪與道路標線的關係，以及路口標誌、標線與號誌，接回連續原始影像核對；最後一張截圖不能代替前段經過。',
  ],
  webm: '/videos/traffic/observations/right-turn-observation.webm',
  mobileWebm: '/videos/traffic/observations/right-turn-observation-mobile.webm',
  mp4: '/videos/traffic/observations/right-turn-observation.mp4',
  mobileMp4: '/videos/traffic/observations/right-turn-observation-mobile.mp4',
  poster: '/videos/traffic/observations/right-turn-observation-poster.png',
  mobilePoster: '/videos/traffic/observations/right-turn-observation-poster-mobile.png',
} as const;

export function hasRightTurnObservation(locale: string, slug: string) {
  return locale === 'zh-hant' && slug === RIGHT_TURN_OBSERVATION.slug;
}
