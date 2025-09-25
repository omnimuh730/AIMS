import { accountInfoCollection } from "../db/mongo.js";

export const getAccountInfo = async (req, res) => {
    try {
        console.log('GET /api/account_info - Fetching all account info');
        const accountInfo = await accountInfoCollection.find({}).toArray();
        res.status(200).json(accountInfo);
    } catch (error) {
        console.error('Error in getAccountInfo:', error);
        res.status(500).json({ message: error.message });
    }
};

export const addAccountInfo = async (req, res) => {
    try {
        const { name } = req.body;
        console.log('POST /api/account_info - Attempting to add name:', name);
        if (!name) {
            console.log('POST /api/account_info - Name is required (400)');
            return res.status(400).json({ message: "Name is required" });
        }
        // Check if the name already exists to prevent duplicates
        const existingName = await accountInfoCollection.findOne({ name });
        if (existingName) {
            console.log('POST /api/account_info - Name already exists (409):', name);
            return res.status(409).json({ message: "Name already exists" });
        }

        const result = await accountInfoCollection.insertOne({ name });
        console.log('POST /api/account_info - Name added successfully:', name, 'Result:', result);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error in addAccountInfo:', error);
        res.status(500).json({ message: error.message });
    }
};

export const removeAccountInfo = async (req, res) => {
    try {
        const { name } = req.params;
        console.log('DELETE /api/account_info/:name - Attempting to remove name:', name);
        if (!name) {
            console.log('DELETE /api/account_info/:name - Name is required (400)');
            return res.status(400).json({ message: "Name is required" });
        }
        const result = await accountInfoCollection.deleteOne({ name });
        if (result.deletedCount === 0) {
            console.log('DELETE /api/account_info/:name - Name not found (404):', name);
            return res.status(404).json({ message: "Name not found" });
        }
        console.log('DELETE /api/account_info/:name - Name removed successfully:', name, 'Result:', result);
        res.status(200).json({ message: "Name removed successfully" });
    } catch (error) {
        console.error('Error in removeAccountInfo:', error);
        res.status(500).json({ message: error.message });
    }
};