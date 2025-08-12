const Message = require('../models/Message');

exports.createMessage = async (req, res) => {
  const { name, email, body } = req.body;
  try {
    const msg = await Message.create({
      name, email, body,
      user_id: req.user?.id
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt','DESC']],
      include: [{
        model: require('../models/User'),
        attributes: ['name','email','role']
      }]
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  console.log('DELETE /api/messages/:id', req.user, req.params);
  try {
    const msg = await Message.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    await msg.destroy();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
