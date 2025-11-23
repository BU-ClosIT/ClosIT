export const sizes = [
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
] as const;

type Size = (typeof sizes)[number];

export default Size;
