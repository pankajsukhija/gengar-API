const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['getUsers', 'manageShows', 'canComment']);
roleRights.set(roles[1], ['getUsers', 'manageUsers', 'manageShows', 'canComment']);

module.exports = {
  roles,
  roleRights,
};
