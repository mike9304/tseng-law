import type { TrafficDiagram } from './traffic-diagrams';

export const TW_CHAIN_COLLISION_DIAGRAM = {
  "kind": "video",
  "playback": "manual",
  "playbackTools": true,
  "id": "chain-collision-hypothetical",
  "mp4": "/videos/traffic/tw-chain-collision.mp4",
  "webm": "/videos/traffic/tw-chain-collision.webm",
  "mobileMp4": "/videos/traffic/tw-chain-collision-mobile.mp4",
  "mobileWebm": "/videos/traffic/tw-chain-collision-mobile.webm",
  "poster": "/images/traffic/tw-chain-collision-poster.webp",
  "mobilePoster": "/images/traffic/tw-chain-collision-poster-mobile.webp",
  "width": 1600,
  "height": 1080,
  "mobileWidth": 1080,
  "mobileHeight": 1350,
  "durationSeconds": 12,
  "copy": {
    "zh-hant": {
      "alt": "假設示意：左右兩條時間軸各有由上而下排列的A前車、B中間車與C後車；左側B先碰A，右側C先碰B，兩側最後三車位置相同。非事故重建。",
      "caption": "假設示意，非事故重建。左右兩側是兩條假設時間軸，不是兩條相鄰的真實車道；數字只代表本假設中的接觸順序，最終位置不能證明先後。車距、停格時間與播放節奏均為說明安排，並非實測數值或法定標準。",
      "legend": "每側由上而下是橙色A前車、藍綠色B中間車、紫色C後車。",
      "assumption": "動畫左右兩側是兩條假設時間軸，不是兩條相鄰的真實車道，也不是六車事故。 A、B、C只是示意標記，不代表任何判決的當事人或車輛。 接觸點旁的數字只代表本假設中的接觸順序。 兩側最終位置是刻意畫成相同，用以說明終點不能單獨證明先後。 動畫不模擬真實速度、距離、煞車、車損或碰撞物理。 停格不表示有效煞停；淡出後重設回起點不是車輛倒退。 兩條時間軸的差別不是只改變一個變數，也不是任何判決的證據重建。 車距、停格時間與播放節奏不是實測公尺、事故秒數或法定標準，也不能據此計算責任比例或損害。",
      "videoDescription": "12秒無聲圖解動畫，分橫版與直版。畫面左右各有一條標為「時間軸①B先接觸A」與「時間軸②C先接觸B」的直向示意道路，兩側都是假設，不是兩條相鄰的真實車道，也不是六輛車的事故。每側由上而下是橙色A前車、藍綠色B中間車、紫色C後車。動畫依「01三車初始位置、02第一處接觸、03第二處接觸、04最終位置相同」推進。時間軸①：B先與A接觸，接觸點標示黃色圓圈與數字1；之後C與B接觸，標示2。時間軸②：C先與B接觸，標示1；B與C一起前移，再由B與A接觸，標示2。最後兩側三車位置刻意相同。畫面標示「數字：本假設中的接觸順序」與「假設示意，非事故重建」；橫版另註明「兩條時間軸皆為假設」、「最終位置不能證明先後」，直版標題為「相同終點，不同接觸順序」，並註明「兩種假設，不能據此認定案情」。之後車輛淡出，畫面重設回初始位置。動畫不模擬真實速度、煞車、車損或碰撞物理；停格不代表有效煞停，淡出重設也不是車輛倒退；它不是任何判決的事故重建。",
      "stages": {
        "label": "01三車初始位置、02第一處接觸、03第二處接觸、04最終位置相同",
        "alts": [
          "兩條時間軸均顯示 A 前車、B 中間車與 C 後車，三車之間有間隔。這是兩個說明假設的共同起始圖。假設示意，非事故重建。",
          "時間軸①的 B 已接觸 A，C 尚在後方；時間軸②的 C 已接觸 B，B 與 A 仍有間隔。數字一表示第一處接觸。假設示意，非事故重建。",
          "時間軸①的 C 隨後接觸 B；時間軸②的 B 在 C 接觸後隨 C 一起前移，再接觸 A。數字二表示第二處接觸。假設示意，非事故重建。",
          "兩條時間軸的最終三車位置相同，接觸順序卻不同。此共同終點是刻意安排的說明，不是證據，也不作過失比例或損害金額判定。假設示意，非事故重建。"
        ]
      }
    }
  },
  "stills": [
    {
      "poster": "/images/traffic/tw-chain-collision-step-01.png",
      "mobilePoster": "/images/traffic/tw-chain-collision-step-01-mobile.png"
    },
    {
      "poster": "/images/traffic/tw-chain-collision-step-02.png",
      "mobilePoster": "/images/traffic/tw-chain-collision-step-02-mobile.png"
    },
    {
      "poster": "/images/traffic/tw-chain-collision-step-03.png",
      "mobilePoster": "/images/traffic/tw-chain-collision-step-03-mobile.png"
    },
    {
      "poster": "/images/traffic/tw-chain-collision-step-04.png",
      "mobilePoster": "/images/traffic/tw-chain-collision-step-04-mobile.png"
    }
  ]
} as const satisfies TrafficDiagram;
