module.exports = function(sequelize, Datatypes) {
    return sequelize.define('user', {
    username : {
        type : Datatypes.STRING
    },
    password : {
        type : Datatypes.STRING
    },
    isAdmin : {
        type : Datatypes.BOOLEAN
    }
}, {
    timestamps: false
})
}

