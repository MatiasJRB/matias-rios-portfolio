type FollowUpTopic = "leadership" | "projects" | "fit" | "contact" | "general";

type FollowUps = Record<FollowUpTopic, readonly string[]>;

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const getTopic = (question: string): FollowUpTopic => {
  const text = normalize(question);

  if (/contact|correo|email|linkedin|escrib|reach|hire/.test(text)) {
    return "contact";
  }
  if (/vacante|rol|puesto|fit|job|role|equipo busc|team need/.test(text)) {
    return "fit";
  }
  if (/proyect|producto|produccion|project|product|shipp|deploy/.test(text)) {
    return "projects";
  }
  if (/lider|equipo|arquitect|lead|team|architect/.test(text)) {
    return "leadership";
  }
  return "general";
};

export const getChatFollowUps = (
  questions: string[],
  followUps: FollowUps,
) => {
  const asked = new Set(questions.map(normalize));
  const topic = questions
    .map(getTopic)
    .reverse()
    .find((candidate) => candidate !== "general") ?? "general";

  return [...followUps[topic], ...followUps.general]
    .filter((suggestion, index, all) =>
      !asked.has(normalize(suggestion)) && all.indexOf(suggestion) === index,
    )
    .slice(0, 2);
};
