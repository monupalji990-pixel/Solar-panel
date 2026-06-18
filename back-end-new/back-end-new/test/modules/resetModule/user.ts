var userData:any = [];
import userModel from '../../../models/user';
exports.add = async() => {
    for (var i = 0; i < userData.length; i++) {
       await userModel.updateOne({
            email: userData[i].email
        }, userData[i], {upsert: true})
    }
}
exports.delete = async() => {
    await userModel.deleteMany({})
}
userData = [
    {
        "_id": "5d5146479bc51c5b4469f67a",
        "email": "suresh@1001",
        "password": "suresh1212#",
        "portal": "5d51475d6c47915b8ae1f7e5",
        "role": "5d5141273a9b65536a81c91c"
    }
]