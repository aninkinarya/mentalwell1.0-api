const { supabase } = require('../../config/database');

const allPsychologists = async () => {
  const { data, error } = await supabase
    .from('psychologists')
    .select(`
      id,
      bio,
      experience,
      price,
      availability,
      users (
        id,
        name,
        nickname,
        email,
        phone_number,
        gender,
        birthdate,
        profile_image
      )
    `)
    .order('name', { referencedTable: 'users', ascending: true });

  if (error) {
    throw new Error('Gagal mengambil data psikolog: ' + error.message);
  }

  return data.map(ps => ({
    id: ps.id,
    name: ps.users?.name || '-',
    nickname: ps.users?.nickname || '-',
    email: ps.users?.email || '-',
    phone_number: ps.users?.phone_number || '-',
    gender: ps.users?.gender || '-',
    birthdate: ps.users?.birthdate || '-',
    profile_image: ps.users?.profile_image || null,
    bio: ps.bio,
    experience: ps.experience,
    price: ps.price,
    availability: ps.availability
  }));
};

 

module.exports = { allPsychologists };
