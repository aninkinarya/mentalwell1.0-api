const { supabase } = require('../../config/database')
const { uploadPhotoToSupabase } = require('../../config/uploadFile')

const createArticle = async (data, file) => {
    payload = {...data}

    if(file){
        const uploadResult = await uploadPhotoToSupabase({file: file, folder: 'articles'});
        if(!uploadResult.success){
            throw Error('Gagal mengunggah gambar')
        }
        payload.image = uploadResult.url;
    }

    const { data: inserted, error } = await supabase
     .from('articles') 
     .insert([payload])
     .select()
     .single();

    if (error) {
        throw new Error('Gagal membuat artikel: ') + error.message;
    }

    return inserted;
}

const editArticle = async (id, data, file) => {
    const payload = { ...data };
  
    if (file) {
      const uploadResult = await uploadPhotoToSupabase({ file, folder: 'articles' });
      if (!uploadResult.success) {
        throw new Error('Gagal upload gambar');
      }
      payload.image = uploadResult.url;
    }
  
    const { data: updated, error } = await supabase
      .from('articles')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
  
    if (error) 
        throw new Error('Gagal memperbarui artikel: ' + error.message);
  
    return updated;
  };

module.exports = { createArticle, editArticle }