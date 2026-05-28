const TEAM_LABELS = {
  java: 'Java Development Team',
  python: 'Python Development Team',
  devops: 'DevOps Engineering Team',
  hr: 'Human Resources Team',
  tester: 'QA Testing Team',
  frontend: 'Frontend Development Team',
  designer: 'UI/UX Design Team',
  manager: 'Project Management Team',
  general: 'General Team',
};

const TEAM_MATCHERS = [
  { key: 'java', patterns: [/java/] },
  { key: 'python', patterns: [/python/] },
  { key: 'devops', patterns: [/devops/, /dev ops/, /sre/] },
  { key: 'hr', patterns: [/human resources/, /\bhr\b/] },
  { key: 'tester', patterns: [/qa/, /test(ing)?/, /tester/] },
  { key: 'frontend', patterns: [/frontend/, /ui[\s/-]?ux/] },
  { key: 'designer', patterns: [/design/, /ui[\s/-]?ux/] },
  { key: 'manager', patterns: [/manager/, /project management/] },
];

export const normalizeTeamKey = (value) => {
  if (!value) return null;

  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/[_\s/-]+/g, '_');

  if (TEAM_LABELS[normalized]) {
    return normalized;
  }

  for (const matcher of TEAM_MATCHERS) {
    if (matcher.patterns.some((pattern) => pattern.test(normalized))) {
      return matcher.key;
    }
  }

  if (normalized.includes('java')) return 'java';
  if (normalized.includes('python')) return 'python';
  if (normalized.includes('devops')) return 'devops';
  if (normalized.includes('human') || normalized === 'hr') return 'hr';
  if (normalized.includes('test')) return 'tester';
  if (normalized.includes('front')) return 'frontend';
  if (normalized.includes('design')) return 'designer';
  if (normalized.includes('manager')) return 'manager';

  return normalized;
};

export const formatTeamLabel = (teamKey) => {
  const normalized = normalizeTeamKey(teamKey) || 'general';

  if (TEAM_LABELS[normalized]) {
    return TEAM_LABELS[normalized];
  }

  return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)} Team`;
};

export const getEmployeeTeamKey = (employee) => {
  if (!employee) return null;

  return (
    normalizeTeamKey(employee.team) ||
    normalizeTeamKey(employee.teamId) ||
    normalizeTeamKey(employee.teamName) ||
    normalizeTeamKey(employee.department) ||
    normalizeTeamKey(employee.designation) ||
    normalizeTeamKey(employee.role)
  );
};

export const getEmployeeDisplayDesignation = (employee) => {
  if (!employee) return 'Team Member';

  if (employee.designation) {
    return String(employee.designation)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }

  const teamKey = getEmployeeTeamKey(employee);
  return teamKey ? formatTeamLabel(teamKey).replace(' Team', '') : 'Team Member';
};

export const extractEmployeesFromResponse = (responseData) => {
  const payload = responseData && responseData.data ? responseData.data : responseData;

  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.content)) return payload.content;
  if (payload && Array.isArray(payload.items)) return payload.items;

  return payload || [];
};

const getEmployeeIdentifier = (employee) => {
  if (!employee) return null;

  return (
    employee.employeeId ||
    employee.id ||
    employee.email ||
    employee.name ||
    null
  );
};

const isTeamLead = (employee) => {
  const role = String(employee?.role || '').toLowerCase();
  const designation = String(employee?.designation || '').toLowerCase();

  return (
    role === 'team_lead' ||
    role === 'team-lead' ||
    (role.includes('team') && role.includes('lead')) ||
    designation.includes('lead')
  );
};

export const buildTeamsFromEmployees = (employees = []) => {
  const groupedTeams = new Map();

  employees.forEach((employee) => {
    const teamKey = getEmployeeTeamKey(employee) || 'general';
    const identifier = getEmployeeIdentifier(employee);

    if (!groupedTeams.has(teamKey)) {
      groupedTeams.set(teamKey, {
        id: teamKey,
        name: formatTeamLabel(teamKey),
        description: `All members of the ${formatTeamLabel(teamKey).replace(' Team', '')} group.`,
        members: [],
        memberDetails: [],
        teamLeadId: null,
        status: 'active',
      });
    }

    const team = groupedTeams.get(teamKey);
    if (identifier) {
      team.members.push(identifier);
    }

    team.memberDetails.push({
      ...employee,
      id: employee.id || identifier,
      designation: getEmployeeDisplayDesignation(employee),
      team: teamKey,
    });

    if (isTeamLead(employee) && identifier) {
      team.teamLeadId = identifier;
    }
  });

  return Array.from(groupedTeams.values());
};

export const findTeamForUser = (teams = [], user = null) => {
  if (!teams.length || !user) return null;

  const userIdentifiers = [user.employeeId, user.id, user.email, user.name]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  const explicitTeamKey = normalizeTeamKey(user.team || user.teamId || user.teamName);
  if (explicitTeamKey) {
    const explicitMatch = teams.find((team) => team.id === explicitTeamKey);
    if (explicitMatch) return explicitMatch;
  }

  const identifierMatch = teams.find((team) =>
    userIdentifiers.some((identifier) =>
      team.teamLeadId?.toLowerCase?.() === identifier ||
      team.members?.some((member) => String(member).toLowerCase() === identifier) ||
      team.memberDetails?.some((member) => {
        const memberIdentifiers = [member.employeeId, member.id, member.email, member.name]
          .filter(Boolean)
          .map((value) => String(value).toLowerCase());

        return memberIdentifiers.includes(identifier);
      })
    )
  );

  return identifierMatch || teams[0] || null;
};
