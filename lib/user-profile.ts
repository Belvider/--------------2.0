type UserNameSource = {
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
};

export function normalizeProfileText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export function splitDisplayName(name: string | null | undefined) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (parts.length === 0) {
    return {
      firstName: "",
      lastName: "",
      middleName: ""
    };
  }

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: "",
      middleName: ""
    };
  }

  return {
    firstName: parts[0] ?? "",
    lastName: parts[1] ?? "",
    middleName: parts.slice(2).join(" ")
  };
}

export function getEditableNameParts(user: UserNameSource) {
  const parsed = splitDisplayName(user.name);

  return {
    firstName: normalizeProfileText(user.firstName) ?? parsed.firstName,
    lastName: normalizeProfileText(user.lastName) ?? parsed.lastName,
    middleName: normalizeProfileText(user.middleName) ?? parsed.middleName
  };
}

export function buildDisplayName(user: UserNameSource) {
  const parts = [normalizeProfileText(user.firstName), normalizeProfileText(user.lastName), normalizeProfileText(user.middleName)].filter(
    Boolean
  ) as string[];

  if (parts.length > 0) {
    return parts.join(" ");
  }

  return normalizeProfileText(user.name) ?? "Користувач";
}

export function formatDateForInput(value: string | Date | null | undefined) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function parseDateInput(value: string | null | undefined) {
  const normalized = normalizeProfileText(value);

  if (!normalized) {
    return null;
  }

  return new Date(`${normalized}T12:00:00.000Z`);
}
