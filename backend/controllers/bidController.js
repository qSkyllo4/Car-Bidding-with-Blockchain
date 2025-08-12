const Bid = require('../models/Bid');
const Car = require('../models/Car');
const User = require('../models/User');

exports.placeBid = async (req, res) => {
  const { amount, car_id } = req.body;

  try {
    const car = await Car.findByPk(car_id);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    const highestBid = await Bid.findOne({
      where: { car_id },
      order: [['amount', 'DESC']],
    });

    const minimumAllowed = highestBid
      ? parseFloat(highestBid.amount)
      : parseFloat(car.starting_price);

    if (parseFloat(amount) <= minimumAllowed) {
      return res.status(400).json({
        error: `Bid must be higher than $${minimumAllowed}`,
      });
    }

    const bid = await Bid.create({
      amount,
      car_id,
      user_id: req.user.id,
    });

    res.status(201).json(bid);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBidsForCar = async (req, res) => {
  const { carId } = req.params;

  try {
    const bids = await Bid.findAll({
      where: { car_id: req.params.carId },
      order: [['amount', 'DESC']],
      include: [{ model: User, attributes: ['name'] }],
    });
    

    res.json(bids);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
