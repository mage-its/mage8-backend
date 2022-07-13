const allRoles = {
  user: [],
  admin: [
    'getUsers',
    'manageUsers',
    'getKodeBayar',
    'manageKodeBayar',
    'getKodePromo',
    'manageKodePromo',
    'manageLinkShortener',
    'getLinkShortener',
  ],
  staff: ['getUsers', 'getKodeBayar', 'getKodePromo', 'getLinkShortener'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
