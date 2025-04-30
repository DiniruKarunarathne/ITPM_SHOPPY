const model = require("../models/contactus.model");

//add contact details

async function create_Contactus(req,res){
  if (!req.body) return res.status(400).json("Post HTTP Data not Provided");
  let { name, email, message,date } = req.body;

  try {
    const create = await new model.Contactus({
      name,
      email,
      message,
      date,
    }).save();

    return res.json(create);
  } catch (err) {
    return res
      .status(400)
      .json({ message: `Error while creating product ${err} `});
  }

}

async function get_Contactus(req, res) {
  let data = await model.Contactus.find({});
  return res.json(data);
}



  async function delete_Contactus(req, res) {
    try {
      let { id } = req.body
      const contact = await model.Contactus.findByIdAndDelete(id);
           if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      return res.json({ message: "Contact deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  }
  

  module.exports = {
    create_Contactus,
    get_Contactus,
    delete_Contactus
  }
