function daysSince(dateValue) {
  if (!dateValue) return 999;

  const current = new Date();
  const input = new Date(dateValue);

  const diff =
    current.getTime() -
    input.getTime();

  return Math.max(
    0,
    Math.floor(
      diff /
      (1000 * 60 * 60 * 24)
    )
  );
}

export const calculateChurn =
  (customer) => {

    const spent =
      Number(
        customer.totalSpent || 0
      );

    const orders =
      Number(
        customer.totalOrders || 0
      );

    const inactiveDays =
      daysSince(
        customer.lastPurchaseDate
      );

    let score = 0;

    if (inactiveDays >= 90)
      score += 45;
    else if (
      inactiveDays >= 45
    )
      score += 30;
    else if (
      inactiveDays >= 20
    )
      score += 15;

    if (orders <= 1)
      score += 25;
    else if (orders <= 3)
      score += 15;

    if (spent < 1000)
      score += 20;
    else if (spent < 5000)
      score += 10;

    if (
      (
        customer.segment || ""
      )
        .toLowerCase()
        .includes("inactive")
    ) {
      score += 15;
    }

    score = Math.min(
      100,
      score
    );

    let churnRisk = "LOW";

    if (score >= 75)
      churnRisk = "HIGH";
    else if (
      score >= 45
    )
      churnRisk = "MEDIUM";

    return {
      score,
      churnRisk,
      inactiveDays,
    };
  };