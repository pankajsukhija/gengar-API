const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['manageShows']);
roleRights.set(roles[1], ['getUsers', 'manageUsers', 'manageShows']);

module.exports = {
  roles,
  roleRights,
};
