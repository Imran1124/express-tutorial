const Model = require('../model/modelMaster.model');

// ════════════════════════════║  API TO Create Model ║═════════════════════════════════//
const CreateModel = async (req, res) => {
  const { modelName, categoryId } = req.body;

  try {
    const newModel = new Model({
      categoryId,
      modelName
    });

    await newModel.save();

    return res.status(201).json({
      success: true,
      message: 'Created successfully.',
      newModel
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// ════════════════════════════║  API TO Get All Model data ║═════════════════════════════════//

const GetAllModel = async (req, res) => {
  const { page = 1, limit = 10, q } = req.query;
  const options = { page, limit };
  try {
    let query = [
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $project: {
          __v: 0
        }
      }
    ];

    if (q) {
      query.push({
        $match: {
          $or: [
            { modelName: { $regex: new RegExp(q, 'i') } },
            { categoryId: { $regex: new RegExp(q, 'i') } }
          ]
        }
      });
    }

    const aggregate = Model.aggregate([
      ...query,
      {
        $lookup: {
          from: 'tbl_category_mstrs',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $lookup: {
          from: 'tbl_brand_mstrs',
          localField: 'brandId',
          foreignField: '_id',
          as: 'brand'
        }
      }
      // {
      //   $unwind: {
      //     path: '$category',
      //     preserveNullAndEmptyArrays: true
      //   }
      // }
    ]);
    const models = await Model.aggregatePaginate(aggregate, options);

    if (!models) {
      return res.status(400).json({
        success: true,
        message: 'No record found!'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Fetched successfully.',
      data: models
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ════════════════════════════║  API TO Get Model By Id ║═════════════════════════════════//

const GetModelById = async (req, res) => {
  const { id } = req.params;

  try {
    const model = await Model.findById(id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Model not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Get Model by id successfully.',
      data: model
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ════════════════════════════║  API TO Update Model By Id ║═════════════════════════════════//

const UpdateModel = async (req, res) => {
  const { modelName, categoryId } = req.body;
  const { id } = req.params;

  try {
    const models = await Model.findById(id);

    if (!models) {
      return res.status(404).json({
        success: false,
        message: 'Model not found.'
      });
    }

    await Model.findByIdAndUpdate(id, {
      modelName,
      categoryId
    });

    return res.status(200).json({
      success: true,
      message: 'Updated successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ════════════════════════════║  API TO Delete Model By Id ║═════════════════════════════════//

const DeleteModel = async (req, res) => {
  const { id } = req.params;

  try {
    const model = await Model.findById(id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: 'Model not found.'
      });
    }

    await Model.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Deleted successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ════════════════════════════║  API TO Update Model Status By Id ║═════════════════════════════════//

const UpdateModelStatus = async (req, res) => {
  const { id } = req.params;
  const status = await Model.findOne({ _id: id });
  try {
    const modelDetails = await Model.findOneAndUpdate(
      { _id: id },
      {
        // if status is 1, then change to 0, and vice
        status: status?.status == 1 ? 0 : 1
      },
      { new: true }
    );

    if (!modelDetails) {
      return res.status(200).json({
        success: false,
        message: 'Model not found'
      });
    }
    return res.status(200).json({
      success: true,
      message:
        modelDetails?.status == 1
          ? 'Model is Activated'
          : 'Model is Deactivated',
      data: modelDetails
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error
    });
  }
};

module.exports = {
  CreateModel,
  GetAllModel,
  GetModelById,
  UpdateModel,
  DeleteModel,
  UpdateModelStatus
};
