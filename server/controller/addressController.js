const Address = require('../model/addressModel')

// Get all addresses for the logged-in user
const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 })
        res.status(200).json(addresses)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to fetch addresses', error })
    }
}

// Add a new address
const addAddress = async (req, res) => {
    try {
        const { name, phone, line1, line2, city, state, pincode, isDefault } = req.body

        // If this address is set as default, unset other defaults
        if (isDefault) {
            await Address.updateMany({ user: req.user._id }, { isDefault: false })
        }

        const address = await Address.create({
            user: req.user._id,
            name,
            phone,
            line1,
            line2,
            city,
            state,
            pincode,
            isDefault: isDefault || false,
        })

        res.status(201).json(address)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to add address', error })
    }
}

// Update an address
const updateAddress = async (req, res) => {
    try {
        const { id } = req.params
        const { name, phone, line1, line2, city, state, pincode, isDefault } = req.body

        // If this address is set as default, unset other defaults
        if (isDefault) {
            await Address.updateMany({ user: req.user._id }, { isDefault: false })
        }

        const address = await Address.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { name, phone, line1, line2, city, state, pincode, isDefault },
            { new: true }
        )

        if (!address) {
            return res.status(404).json({ message: 'Address not found' })
        }

        res.status(200).json(address)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to update address', error })
    }
}

// Delete an address
const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params

        const address = await Address.findOneAndDelete({ _id: id, user: req.user._id })

        if (!address) {
            return res.status(404).json({ message: 'Address not found' })
        }

        res.status(200).json({ message: 'Address deleted successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to delete address', error })
    }
}

// Set an address as default
const setDefaultAddress = async (req, res) => {
    try {
        const { id } = req.params

        // Unset all other defaults
        await Address.updateMany({ user: req.user._id }, { isDefault: false })

        // Set this one as default
        const address = await Address.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { isDefault: true },
            { new: true }
        )

        if (!address) {
            return res.status(404).json({ message: 'Address not found' })
        }

        res.status(200).json(address)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to set default address', error })
    }
}

module.exports = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
}
