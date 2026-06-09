module.exports = {
    user: {
        config: {
            list: {
                email: 1,
                password: 1
            }
        },
        admin: {
            list: {
                name:1
            }
        },
        regUser:{
            list:{
                name:1,
                email:1,
                role:1,
                isActive:1,
                city_list:1,
                color:1,
                installerType:1
            }
        }
    },
    company: {
        admin: {
            list: {}
        }
    }
};
