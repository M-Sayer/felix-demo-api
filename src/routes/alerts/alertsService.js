export const getUserAlerts = async (db, user_id) => {
  return await db('alerts')
    .select(
      'id', 'title', 'message', 'read', 'date_created'
    )
    .where({ user_id }).orderBy('date_created');
};

export const updateAlert = async (db, id, read) => {
  return await db('alerts')
    .where({ id }).update({ read })
    .returning('read');
};