const dayjs = require('dayjs')

const calculateAge = (birthdate) => {
  const birth = dayjs(birthdate);
  const today = dayjs();

  let age = today.year() - birth.year();

  if (today.month() < birth.month() || (today.month() === birth.month() && today.date() < birth.date())) {
    age--;
  }

  return age;
};

module.exports = { calculateAge }