const Car    = require('../models/Car');
const Bid    = require('../models/Bid');
const { registry, wallet, ethers } = require('../blockchain/registry');

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.findAll({
      where: { status: 'approved' }
    });
    res.json(cars);
  } catch (err) {
    console.error('Error fetching cars:', err);
    res.status(500).json({ error: 'Server error fetching cars.' });
  }
};


exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car || car.status !== 'approved') {
      return res.status(404).json({ error: 'Car not found.' });
    }

    const now   = new Date();
    const ended = new Date(car.end_time) < now;

    if (ended && !car.txHash) {
      console.log(`Auction ${car.id} ended; recording on-chain…`);

      const highest = await Bid.findOne({
        where: { car_id: car.id },
        order: [['amount', 'DESC']]
      });

      if (highest) {
        const winnerAddress = wallet.address;
        console.log('Winner:', winnerAddress, 'Bid:', highest.amount);

        const amountWei = ethers.parseUnits(
          highest.amount.toString(),
          'wei'
        );

        const txResponse = await registry.recordSale(
          car.id,
          winnerAddress,
          amountWei
        );
        console.log('On-chain tx sent, hash:', txResponse.hash);

        await txResponse.wait();
        console.log('On-chain tx mined');

        car.txHash = txResponse.hash;
        await car.save();
        console.log('txHash saved to DB:', car.txHash);
      } else {
        console.log(`No bids for car ${car.id}; skipping on-chain record.`);
      }
    }

    res.json(car);
  } catch (err) {
    console.error('Error fetching car or recording sale:', err);
    res.status(500).json({ error: 'Server error fetching the car.' });
  }
};

exports.createCar = async (req, res) => {
  const files = req.files || [];
  let images  = [];

  if (files.length) {
    images = files.map(f => `/uploads/${f.filename}`);
  } else if (req.body.image_url) {
    images = [req.body.image_url];
  } else {
    return res
      .status(400)
      .json({ error: 'Provide at least one image (upload or URL).' });
  }

  const {
    make,
    model,
    registration,
    kilometers,
    features,
    starting_price,
    end_time
  } = req.body;

  if (
    !make ||
    !model ||
    !registration ||
    !kilometers ||
    !features ||
    !starting_price ||
    !end_time
  ) {
    return res.status(400).json({
      error:
        'All fields (make, model, registration, kilometers, features, starting_price, end_time) are required.'
    });
  }

  const title       = `${make} ${model}`;
  const description = `Registered: ${registration}, Kilometers: ${kilometers}, Features: ${features}`;

  try {
    const car = await Car.create({
      title,
      description,
      image_url: files.length ? null : req.body.image_url,
      images,
      make,
      model,
      registration,
      kilometers,
      features,
      starting_price,
      end_time,
      status: 'pending',    
      user_id: req.user.id
    });

    res.status(201).json(car);
  } catch (err) {
    console.error('Error creating car:', err);
    res.status(500).json({ error: 'Server error creating car.' });
  }
};


exports.getPendingCars = async (req, res) => {
  try {
    const cars = await Car.findAll({ where: { status: 'pending' } });
    res.json(cars);
  } catch (err) {
    console.error('Error fetching pending cars:', err);
    res.status(500).json({ error: 'Server error fetching pending cars.' });
  }
};

exports.approveCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found.' });

    car.status = 'approved';
    await car.save();
    res.json({ message: 'Car approved.', car });
  } catch (err) {
    console.error('Error approving car:', err);
    res.status(500).json({ error: 'Server error approving car.' });
  }
};


exports.declineCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found.' });

    car.status = 'declined';
    await car.save();
    res.json({ message: 'Car declined.' });
  } catch (err) {
    console.error('Error declining car:', err);
    res.status(500).json({ error: 'Server error declining car.' });
  }
};
