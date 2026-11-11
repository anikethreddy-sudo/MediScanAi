
export function normalizePrediction(value) {
  const prediction = String(value || "").trim().toLowerCase();

  if (
    prediction === "normal" ||
    prediction.includes("no strong pneumonia") ||
    prediction.includes("no pneumonia") ||
    prediction === "no finding"
  ) {
    return "Normal";
  }

  if (
    prediction === "pneumonia" ||
    prediction.includes("pneumonia suspected") ||
    prediction.includes("pneumonia detected")
  ) {
    return "Pneumonia";
  }

  if (prediction.includes("inconclusive")) {
    return "Inconclusive";
  }

  return "Other";
}

export function getPrediction(item) {
  return normalizePrediction(
    item?.prediction || item?.disease || item?.result
  );
}

export function getConfidence(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return null;
  }

  return number <= 1 ? number * 100 : number;
}
