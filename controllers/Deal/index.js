import Deal from '../../models/Deal.js';
// Create a new deal
async function createDeal(req, res, next) {
  try {
    const { dealName, dealPrice, dealItems, user } = req.body;
    if (user && dealPrice && dealItems && dealName) {
      const deal = new Deal(req.body);
      const savedDeal = await deal.save();
      res.status(200).send(savedDeal);
    } else {
      throw new Error('Please provide all fields');
    }
  } catch (error) {
    next(error);
  }
}

// Read a single deal by dealId
async function getDealById(req, res, next) {
  try {
    const { id } = req.params;
    if (id) {
      const deal = await Deal.findById(id)
        .populate('user', '-password')
        .populate('dealItems');
      res.status(200).send(deal);
    } else {
      throw new Error('Please provide a deal Id');
    }
  } catch (error) {
    next(error);
  }
}

// Read all deals
async function getAllDeals(req, res, next) {
  try {
    const deals = await Deal.find({})
      .populate('user', '-password')
      .populate('dealItems');
    res.status(200).send(deals);
  } catch (error) {
    next(error);
  }
}

// Update a deal by dealId
async function updateDealById(req, res, next) {
  try {
    const { id } = req.params;
    if (id) {
      const deal = await Deal.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });
      res.status(200).send(deal);
    } else {
      throw new Error('Please provide a deal Id');
    }
  } catch (error) {
    next(error);
  }
}

// Delete a deal by dealId
async function deleteDealById(req, res, next) {
  try {
    const { id } = req.params;
    if (id) {
      const deal = await Deal.findOneAndDelete({ _id: id });
      res.status(200).send(deal);
    } else {
      throw new Error('Please provide a deal Id');
    }
  } catch (error) {
    next(error);
  }
}

export { createDeal, getDealById, getAllDeals, updateDealById, deleteDealById };
