# Context Snapshot - 2026-05-27 22:56 +08:00

椤圭洰锛欱ANK 1 AICC Demo V2
璺緞锛歚D:\03projects\bca-aicc-demo-v2`
褰撳墠鍒嗘敮锛歚codex/modal-review-fixes`

## 褰撳墠鐘舵€?

- 褰撳墠鍒嗘敮鏄脊妗嗚瘎瀹″彂甯冪嚎锛屼粠 `codex/fix-toolbar-chat-modals` 鍒涘缓銆?
- 鏈垎鏀寘鍚槰澶╁脊妗嗘牱寮忎紭鍖栵紝涓嶅寘鍚?`codex/livechat2-popup` 鐨?livechat2 commits銆?
- 鏈疆鍙皟鏁?Transfer / Outbound 寮规銆乼ransfer mock/type 鍜岄€氱敤寮规鏍峰紡銆?
- 鏈疆鏈?push 鍒?GitHub銆?

## 鏈疆鍏抽敭淇敼

- `Transfer Agent` 涓?`Outbound Call > Call Agent` 鏌ヨ鏍忔柊澧?`Skill Queue`銆乣Status` 绛涢€夈€?
- `TransferAgent` 绫诲瀷鏂板 `skillName`銆乣status`锛沵ock 鍧愬腑鏁版嵁琛ラ綈鎶€鑳藉悕绉颁笌鐘舵€併€?
- Agent 鍒楄〃鏂板 `Skill Name`銆乣Status` 鍒楋紝骞剁敤绱у噾鐘舵€?tag 灞曠ず `Ready`銆乣Talking`銆乣Not Ready`銆?
- `Transfer Number` 椤垫敼涓轰竴琛岋細鍙风爜杈撳叆妗?+ `Transfer` + `Conference`銆?
- 寮规杈撳叆妗嗐€丼earchInput銆丼elect銆丼earch / Call 鎸夐挳鍜岃鍐呭姩浣滄寜閽敹绱э紝淇杈撳叆鏂囧瓧涓?placeholder 鍋忎笅銆?
- `PROJECT_CONTEXT.md` 涓?`DEV_LOG.md` 宸插悓姝ユ洿鏂般€?

## 楠岃瘉鐘舵€?

- `npm run lint`锛氶€氳繃銆?
- `npm run build`锛氶€氳繃锛屼粛鏈夋棦鏈?Vite/Rolldown chunk size warning銆?
- `git diff --check`锛氶€氳繃锛屼粎鎻愮ず LF/CRLF 杞崲銆?
- Browser `http://127.0.0.1:5174/`锛氫富椤甸潰鍙姞杞斤紝Internal Chat 寮规鍙€氳繃鍙 DOM 鎵撳紑銆?
- Browser `http://127.0.0.1:5174/design-system`锛氭甯稿姞杞姐€?
- diff 鏂囦欢鍚嶆鏌ユ棤 `livechat2` / `LiveChat2` 鍖归厤銆?

## 椋庨櫓

- Codex in-app browser 瀵归殣钘忎晶鏍?璇濆姟宸ュ叿鏉＄偣鍑讳笉绋冲畾锛孴ransfer / Outbound 娣卞眰寮规浠嶉渶鐢ㄦ埛鍦ㄦ湰鍦版祻瑙堝櫒涓渶缁堜汉宸ュ鏌ャ€?
- 鍙戝竷鍓嶅繀椤荤‘璁ゅ彧鍙戝竷 `codex/modal-review-fixes`锛屼笉瑕?push `codex/livechat2-popup`銆?
