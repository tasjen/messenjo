export function newDeadline(durationInSec: number): number {
  const deadline = new Date();
  return deadline.setSeconds(deadline.getSeconds() + durationInSec);
}
