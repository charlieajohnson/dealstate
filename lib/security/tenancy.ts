export function canAccessFirm(input: {
  firmId: string;
  membershipFirmIds: string[];
  isSyntheticDemo: boolean;
}): boolean {
  if (input.isSyntheticDemo) return true;
  return input.membershipFirmIds.includes(input.firmId);
}
