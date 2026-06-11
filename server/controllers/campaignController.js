import Campaign from "../models/Campaign.js";

export const createCampaign =
  async (req, res) => {
    try {
      const campaign =
        await Campaign.create(req.body);

      res.status(201).json(
        campaign
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const getCampaigns =
  async (req, res) => {
    try {
      const campaigns =
        await Campaign.find().sort({
          createdAt: -1,
        });

      res.json(campaigns);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  export const getCampaignById =
 async (req,res)=>{

  try{

   const campaign =
    await Campaign.findById(
      req.params.id
    );

   if(!campaign){

    return res.status(404)
    .json({
      message:
      "Campaign not found"
    });

   }

   res.json(campaign);

  }catch(error){

   res.status(500).json({
    message:error.message
   });

  }

 };

export const updateCampaignStatus =
  async (req, res) => {
    try {
      const campaign =
        await Campaign.findByIdAndUpdate(
          req.params.id,
          {
            status:
              req.body.status,
          },
          {
            new: true,
          }
        );

      if (!campaign) {
        return res.status(404).json({
          message:
            "Campaign not found",
        });
      }

      res.json(campaign);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };