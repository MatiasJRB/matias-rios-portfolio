const REPLY_TOP_GAP = 12;

export const getReplyScrollTop = (
  replyTop: number,
  scrollHeight: number,
  clientHeight: number,
) => {
  const bottom = Math.max(0, scrollHeight - clientHeight);
  const replyStart = Math.max(0, Math.min(replyTop - REPLY_TOP_GAP, bottom));

  // Keep short replies at the bottom only when that still shows their start.
  return bottom - replyStart <= REPLY_TOP_GAP ? bottom : replyStart;
};
