//backend/controllers/clientController.js

import Client from '../models/clientModel.js';

// ============================= GET CLIENT PROFILE =======================
export const getClientProfile = async (req, res) => {
    try {
        const client = await Client.findById(req.userId).select("-password");

        if (!client) {
            return res.status(404).json({ success: false, message: "Profil client introuvable" });
        }

        res.status(200).json({ success: true, client });
    } catch (error) {
        console.error("Erreur dans getClientProfile: ", error);
        res.status(500).json({ success: false, message: "Erreur lors de la récupération du profil" });
    }
}

// ============================= UPDATE CLIENT PROFILE =======================
export const updateClientProfile = async (req, res) => {
    try {
        const { name, address, phone } = req.body;

        let client = await Client.findById(req.userId);

        if (!client) {
            return res.status(404).json({ success: false, message: "Profil client introuvable" });
        }

        if (name) client.name = name;
        if (address) client.address = address;
        if (phone) client.phone = phone;

        const updatedClient = await client.save();

        const clientResponse = { ...updatedClient._doc };
        delete clientResponse.password;

        res.status(200).json({ 
            success: true, 
            message: "Profil mis à jour avec succès", 
            client: clientResponse 
        });

    } catch (error) {
        console.error("Erreur dans updateClientProfile: ", error);
        res.status(500).json({ success: false, message: "Erreur lors de la mise à jour du profil" });
    }
}