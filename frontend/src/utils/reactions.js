export function addReaction(reactions = [], emoji, userId) {
  const currentUserId = String(userId || "");
  const current = Array.isArray(reactions) ? reactions : [];
  const alreadyReactedHere = current.some((reaction) => reaction.emoji === emoji && (reaction.usuarios || []).map(String).includes(currentUserId));
  if (alreadyReactedHere) return current;

  const withoutPreviousUserReaction = current
    .map((reaction) => {
      const usuarios = (reaction.usuarios || []).map(String);
      if (!usuarios.includes(currentUserId)) return reaction;
      return {
        ...reaction,
        usuarios: usuarios.filter((id) => id !== currentUserId),
        cantidad: Math.max(0, Number(reaction.cantidad || 0) - 1),
      };
    })
    .filter((reaction) => Number(reaction.cantidad || 0) > 0);

  const exists = withoutPreviousUserReaction.find((reaction) => reaction.emoji === emoji);
  if (exists) {
    return withoutPreviousUserReaction.map((reaction) => reaction.emoji === emoji ? { ...reaction, usuarios: [...(reaction.usuarios || []).map(String), currentUserId], cantidad: Number(reaction.cantidad || 0) + 1 } : reaction);
  }
  return [...withoutPreviousUserReaction, { emoji, cantidad: 1, usuarios: [currentUserId] }];
}

export function userReaction(reactions = [], userId) {
  const currentUserId = String(userId || "");
  return (Array.isArray(reactions) ? reactions : []).find((reaction) => (reaction.usuarios || []).map(String).includes(currentUserId))?.emoji;
}

export function renderReactionSummary(reactions = [], emptyLabel = "Sin reacciones") {
  const current = Array.isArray(reactions) ? reactions : [];
  if (!current.length) return emptyLabel;
  return current.map((reaction) => `${reaction.emoji} ${reaction.cantidad || 0}`).join("  ");
}
