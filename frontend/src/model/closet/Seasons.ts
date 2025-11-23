export const seasons = ["Spring", "Summer", "Fall", "Winter", "All"] as const;

type Season = (typeof seasons)[number];

export default Season;
