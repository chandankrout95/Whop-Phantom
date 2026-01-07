export const SERVICE_ALIASES = [
    {
      key: "REELS_VIEWS_REACH",
      uiName: "Instagram Reels Views + Reach",
      include: ["3143"], // we can use service id directly
    },
    {
      key: "REELS_AD_VIEWS_GLOBAL",
      uiName: "Instagram Reels Ad Views (Global)",
      include: ["5116"],
    },
    {
      key: "REELS_VIEWS_INDIA_GLOBAL",
      uiName: "Instagram Reels Views (India + Global)",
      include: ["5232"],
    },
    {
      key: "LIKES_USA_MIX_REFILL",
      uiName: "Instagram Likes (USA Mix - Refill)",
      include: ["3601"],
    },
    {
      key: "LIKES_USA_HQ",
      uiName: "Instagram Likes (USA - High Quality)",
      include: ["3602"],
    },
    {
      key: "LIKES_USA_MIX",
      uiName: "Instagram Likes (USA Mix)",
      include: ["3603"],
    },
  ] as const;
  