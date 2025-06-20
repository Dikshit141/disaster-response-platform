// backend/routes/disasters.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

module.exports = (io, supabase) => {
  // POST /disasters
  router.post('/', async (req, res) => {
    const { title, location_name, description, tags, owner_id } = req.body;
    const id = uuidv4();
    const created_at = new Date().toISOString();
    const audit_trail = [{ action: 'create', user_id: owner_id, timestamp: created_at }];

    const { error } = await supabase.from('disasters').insert({
      id,
      title,
      location_name,
      description,
      tags,
      owner_id,
      created_at,
      audit_trail
    });

    if (error) return res.status(500).json({ error: error.message });
    io.emit('disaster_updated', { type: 'created', id });
    res.status(201).json({ message: 'Disaster created', id });
  });

  // GET /disasters
  router.get('/', async (req, res) => {
    const { tag } = req.query;
    const query = supabase.from('disasters').select('*').order('created_at', { ascending: false });
    const { data, error } = tag ? await query.contains('tags', [tag]) : await query;

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // PUT /disasters/:id
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, location_name, description, tags, owner_id } = req.body;
    const timestamp = new Date().toISOString();

    const { data: existing, error: getError } = await supabase
      .from('disasters')
      .select('audit_trail')
      .eq('id', id)
      .single();

    if (getError) return res.status(404).json({ error: 'Disaster not found' });

    const updatedTrail = [...existing.audit_trail, { action: 'update', user_id: owner_id, timestamp }];
    const { error } = await supabase.from('disasters').update({
      title,
      location_name,
      description,
      tags,
      audit_trail: updatedTrail
    }).eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    io.emit('disaster_updated', { type: 'updated', id });
    res.json({ message: 'Disaster updated' });
  });

  // DELETE /disasters/:id
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase.from('disasters').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });

    io.emit('disaster_updated', { type: 'deleted', id });
    res.json({ message: 'Disaster deleted' });
  });

  return router;
};
