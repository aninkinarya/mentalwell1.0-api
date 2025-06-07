const { supabase } = require('./database');
const { nanoid } = require('nanoid');
const path = require('path');

const uploadPhotoToSupabase = async ({ file, folder = 'profile_images', prefix = '' }) => {
    if (!file?.hapi?.filename || !file?._data) {
      throw new Error('File tidak valid. Pastikan Anda mengunggah file yang benar.');
    }
  
    const fileExt = path.extname(file.hapi.filename);
    const randomString = nanoid(4);
    const fileName = `${prefix}${prefix ? '-' : ''}${randomString}${fileExt}`;
    const filePath = `${folder}/${fileName}`;
  
    const { error: uploadError } = await supabase.storage
      .from('mentalwell-bucket')
      .upload(filePath, file._data, {
        contentType: file.hapi.headers['content-type'],
        upsert: true,
      });
  
    if (uploadError) throw new Error(`Gagal upload foto: ${uploadError.message}`);
  
    const { data } = supabase.storage
      .from('mentalwell-bucket')
      .getPublicUrl(filePath);
  
    return {
      success: true,
      url: data.publicUrl,
    };
  };
  

module.exports = { uploadPhotoToSupabase };
