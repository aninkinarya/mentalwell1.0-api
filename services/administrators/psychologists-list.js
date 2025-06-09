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

const deleteAPsychologist = async (psychologistId) => {

  const { data: userId, error: userError } = await supabase
    .from('psychologists')
    .select('user_id')
    .eq('id', psychologistId)
    .single();

  if (userError) {
    throw new Error('Gagal mendapatkan ID pengguna psikolog: ' + userError.message);
  }

  const { error } = await supabase
    .from('psychologists')
    .delete()
    .eq('id', psychologistId);

  if (error) {
    throw new Error('Gagal menghapus psikolog: ' + error.message);
  }

  const { error: deleteUserError } = await supabase
    .from('users')
    .delete()
    .eq('id', userId.user_id);

  if (deleteUserError) {
    throw new Error('Gagal menghapus pengguna psikolog: ' + deleteUserError.message);
  }

  return { message: 'Psikolog berhasil dihapus' };
};

const deleteMultiplePsychologists = async (psychologistIds) => {
  if (!Array.isArray(psychologistIds) || psychologistIds.length === 0) {
    throw new Error('ID psikolog tidak valid');
  }

  const { data: userIds, error: userError } = await supabase
    .from('psychologists')
    .select('user_id')
    .in('id', psychologistIds);

  if (userError) {
    throw new Error('Gagal mendapatkan ID pengguna psikolog: ' + userError.message);
  }

  cons



}



 

module.exports = { allPsychologists, deleteAPsychologist };
