const Item = require("../models/sellerModel");

exports.getItemsByCategory = async (req, res) => {
    try {

        const { category } = req.body;

        const items = await Item.find({categories: category});

        return res.status(200).json(items);

    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}