const mongoose = require('mongoose');

const roleFeatureSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true
    },
    apis: [
        String
    ],
    containers: [
        {
            name: String,
            container: String,
            parent: String,
            icon: String,
            isSidebar: Boolean,
            noparent: Boolean
        }
    ],
    configurations: {
        afterLoginPage: { type: String, defaultValue: '/dashboard' }
    }
}, { timestamps: true });
const RoleModel = mongoose.model('Roles', roleFeatureSchema);

export default RoleModel;
