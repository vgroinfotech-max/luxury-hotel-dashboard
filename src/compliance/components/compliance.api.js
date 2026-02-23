export async function fetchComplianceRegister(entityId) {
  const res = await fetch(`/api/entities/${entityId}/compliance`);
  return res.json();
}
