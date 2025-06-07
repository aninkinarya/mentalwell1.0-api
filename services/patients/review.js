const {supabase} = require('../../config/database');

const addReview = async ( counselingId, review) => {
    const { data, error } = await supabase
        .from('counselings')
        .update({
            review: review
        })
        .eq('id', counselingId)
        .select('id, review')
        .single();

    if (error) {
        throw new Error('Gagal menambahkan ulasan: ' + error.message);
    }

    return {
        id: data.id,
        review: data.review
    };
}

module.exports = {
    addReview
}