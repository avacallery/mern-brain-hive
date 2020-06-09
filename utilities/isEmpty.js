const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && value.trim().length === 0) ||
  (typeof value === 'object' && Object.keys(value).length === 0);

//one big condition and if any of those are true, it is empty

module.exports = isEmpty;
